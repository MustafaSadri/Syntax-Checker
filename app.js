const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const User = require('./models/User');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/syntax-checker');
    console.log('Connected to database');
}

main().catch(err => console.log(err));

// Render the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        req.session.userId = user._id; 
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/login');
});

// Render dashboard page
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard');
});

// app.post("/checksyntax", (req, res) => {
//     const code = req.body.code;
//     const language = req.body.language; 
    

//     let extension;
//     if (language === "c") {
//         extension = "c";
//     } else if (language === "cpp") {
//         extension = "cpp";
//     } else if (language === "java") {
//         extension = "java";
//     } else {
//         return res.send("Unsupported language");
//     }
    

//     const fs = require("fs");
//     const filePath = path.join(__dirname, `temp.${extension}`);
//     fs.writeFileSync(filePath, code);

 
//     let command;
//     if (language === "c") {
//         command = `gcc -fsyntax-only ${filePath}`;
//     } else if (language === "cpp") {
//         command = `g++ -fsyntax-only ${filePath}`;
//     } else if (language === "java") {
//         command = `javac ${filePath}`;
//     }

//     exec(command, (error, stdout, stderr) => {
//         if (error) {
//             res.send(`Syntax Error: ${stderr}`);
//         } else {
//             res.send("No Syntax Errors Found");
//         }
        
       
//         fs.unlinkSync(filePath);
//     });
// });

app.post("/checksyntax", (req, res) => {
    const code = req.body.code;
    const language = req.body.language; 

    let extension;
    if (language === "c") {
        extension = "c";
    } else if (language === "cpp") {
        extension = "cpp";
    } else if (language === "java") {
        extension = "java";
    } else {
        return res.send("Unsupported language");
    }

    const filePath = path.join(__dirname, `temp.${extension}`);
    fs.writeFileSync(filePath, code);

    let command;
    if (language === "c") {
        command = `gcc -fsyntax-only ${filePath}`; // Check syntax only
    } else if (language === "cpp") {
        command = `g++ -fsyntax-only ${filePath}`; // Check syntax only
    } else if (language === "java") {
        command = `javac ${filePath}`; // Compile Java code
    }

    exec(command, (error, stdout, stderr) => {
        
        if (error) {
            res.send(`Syntax Error: ${stderr}`);
        } else {
            res.send("No Syntax Errors Found");
        }

        // fs.unlinkSync(filePath); // Clean up temp file
    });
});



// Start server
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
