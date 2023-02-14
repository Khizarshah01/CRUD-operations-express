const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;
const users = require("./MOCK_DATA.json"); // Importing data from a JSON file

app.use(express.urlencoded({ extended: false})); // Setting up middleware for handling form data

// API route for getting all users
app.get('/api/users',(req,res)=>{
    return res.json(users);
});

// API route for getting a single user by ID
app.route("/api/users/:id")
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id); // Find the user with the given ID
    return res.json(user);
})
.patch((req,res)=>{
    const id = Number(req.params.id);
    const body = req.body;

    // Find the index of the user with the given id
    const index = users.findIndex(user => user.id === id);

    // Update the user data
    users[index].first_name = body.first_name;
    users[index].email = body.email;
    users[index].last_name = body.last_name;
    users[index].gender = body.gender;
    users[index].job_title = body.job_title;

    // Write the updated data to the file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error", message: "Failed to update user data." });
        }
        return res.json({ status: "success", message: "User data updated successfully." });
    })
})
.delete((req,res)=>{
    const id = Number(req.params.id);

    // Remove the user with the given id from the array
    const filteredUsers = users.filter(user => user.id !== id);

    // Reassign the id values of the remaining users
    for (let i = 0; i < filteredUsers.length; i++) {
        filteredUsers[i].id = i + 1;
    }

    // Write the updated data to the file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(filteredUsers), (err) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error", message: "Failed to delete user data." });
        }
        return res.json({ status: "success", message: "User data deleted successfully." });
    });
})

// API route for adding a new user
app.post("/api/users", (req,res)=>{
    const body = req.body;
    users.push({id: users.length + 1, ...body}); // Add the new user data to the users array
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err,data)=>{
        return res.json({status: "success", id: users.length});
    });
});

// Listening on the specified port
app.listen(port,()=>{
    console.log(`localhost at ${port}`);
});
