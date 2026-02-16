const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Student = require("./models/Student");


const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// test route
app.get("/", async (req, res) => {

    const students = await Student.find();

    res.render("index", { students });
});


app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", async (req, res) => {

    const newStudent = new Student({
        name: req.body.name,
        age: req.body.age
    });

    await newStudent.save();

    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {

    await Student.findByIdAndDelete(req.params.id);

    res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {

    const student = await Student.findById(req.params.id);

    res.render("edit", { student });
});

app.post("/edit/:id", async (req, res) => {

    await Student.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        age: req.body.age
    });

    res.redirect("/");
});



// start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
