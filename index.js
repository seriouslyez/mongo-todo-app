// Require express dependencies
// #Require allows for dependencies to be checked by first loading and caching needd modules. 
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Models
const TodoTask = require("./models/TodoTask");

dotenv.config();

// Use the CSS file for styling 
app.use("/static", express.static("public"));

// Allows for extracting data from the form
app.use(express.urlencoded({ extended: true}));

// Connection to db
//mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and Running"));
});

// View engine configuration 
app.set("view engine", "ejs");

// GET method
// #Get allows for returning a specific element from existing elements
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST method
// #Post allows for posting data to the server. Here we save any newly created todo, and then post the app. 
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        // New todo is saved to database
        // #Await allows for unwrapping of promises. Here, we wait for the new todo to be saved before redirecting to the homepage
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// UPDATE method
app
.route("/edit/:id")
// First get id
// #Get allows for returning a specific element from existing elements; Here, we get the id of the item first
.get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
// Update the task using findByIdAndUpdate
// #Post allows for posting data to the server. Here we post the update of the todo to the server
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// DELETE method
// #Routes
app.route("/remove/:id").get((req, res) => {
    // Find id
    const id = req.params.id;
    // Remove using id
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});



