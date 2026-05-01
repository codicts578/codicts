require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // 1. ADDED THIS

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static('frontend'));

// 2. ADDED SESSION MIDDLEWARE (Must be before routes)
app.use(session({
    secret: 'codicts_secret_key', // You can change this to any random string
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Session expires in 1 hour
}));

// MongoDB Atlas Connection
const dbURI = process.env.MONGO_URI; 
mongoose.connect(dbURI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch(err => console.error('Connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likes: [String], // Array of Strings to store item IDs or names
    isPaid: { type: Boolean, default: false } // NEW: Defaults to false

});

const User = mongoose.model('User', userSchema);

// --- ROUTES ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 1. SIGNUP
app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.send("Passwords do not match. <a href='signup.html'>Try again</a>");
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/frontend/Pages/Login and Signup Pages/login.html'); 
    } catch (error) {
        res.send("Error: Email already exists.");
    }
});

// 2. UPDATED LOGIN: Now creates a session and redirects to homepage
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send("User not found. <a href='/frontend/Pages/Login and Signup Pages/signup.html'>Create an account</a>");
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            // SAVE TO SESSION
            req.session.userId = user._id;
            req.session.username = user.username;
            
            // REDIRECT TO HOMEPAGE (index.html)
            res.redirect('index.html'); 
        } else {
            res.send("Invalid password. <a href='login.html'>Try again</a>");
        }
    } catch (error) {
        res.status(500).send("An error occurred during login.");
    }
});


// 4. NEW ROUTE: Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.post('/like-item', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Please log in to save items." });
    }

    const { itemName } = req.body;

    try {
        const user = await User.findById(req.session.userId);
        const isLiked = user.likes.includes(itemName);

        if (isLiked) {
            // Remove it if it exists ($pull)
            await User.findByIdAndUpdate(req.session.userId, {
                $pull: { likes: itemName }
            });
            res.json({ message: "Removed from favorites", status: "unliked" });
        } else {
            // Add it if it doesn't ($addToSet)
            await User.findByIdAndUpdate(req.session.userId, {
                $addToSet: { likes: itemName }
            });
            res.json({ message: "Saved to favorites", status: "liked" });
        }
    } catch (error) {
        res.status(500).send("Error updating favorites.");
    }
});

// Route to get all liked items for the "Saved" page
app.get('/my-likes', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login.html');
    
    const user = await User.findById(req.session.userId);
    res.json({ likes: user.likes });
});

const PORT = 3000;

app.get('/check-auth', async (req, res) => {
    console.log("Session ID checking auth:", req.session.userId); // Debug log
    
    if (!req.session.userId) {
        return res.json({ loggedIn: false });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.json({ loggedIn: false });

        console.log(`Sending to frontend -> User: ${user.username}, Paid: ${user.isPaid}`);
        
        res.json({ 
            loggedIn: true, 
            username: user.username, 
            isPaid: !!user.isPaid // The !! forces it to be true or false
        });
    } catch (error) {
        console.error("Auth route error:", error);
        res.status(500).json({ loggedIn: false });
    }
});

// --- NEW PAYMENT ROUTE ---
app.post('/process-payment', async (req, res) => {
    if (!req.session.userId) return res.send("Please login.");

    // Capture the path from the hidden input
    const redirectTo = req.body.redirectPath || '/index.html'; 

    try {
        await User.findByIdAndUpdate(req.session.userId, { isPaid: true });
        req.session.isPaid = true; 

        req.session.save((err) => {
            if (err) return res.status(500).send("Error saving session.");
            
            res.send(`
                <script>
                    alert('Success! Account upgraded to PRO.');
                    // Go back to the specific component page!
                    window.location.href = '${redirectTo}';
                </script>
            `);
        });
    } catch (error) {
        res.status(500).send("Update failed.");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

