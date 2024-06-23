const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Path to the file where users will be stored
const usersFilePath = path.join(__dirname, 'users.json');

// Load users from the file
function loadUsers() {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
}

// Save users to the file
function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Hash the password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Register a new user
app.post('/register', (req, res) => {
    const { fullname, gender, age, phone, email, country, username, password } = req.body;
    const users = loadUsers();

    if (users.some(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }

    users.push({ fullname, gender, age, phone, email, country, username, password: hashPassword(password) });
    saveUsers(users);

    res.status(201).send('Registration successful');
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.password === hashPassword(password));

    if (!user) {
        return res.status(400).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
});

// Get user data
app.get('/user/:username', (req, res) => {
    const { username } = req.params;
    const users = loadUsers();

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).send('User not found');
    }

    res.status(200).json(user);
});

// Update user data
app.put('/user/:username', (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;
    const users = loadUsers();

    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    saveUsers(users);

    res.status(200).send('User data updated successfully');
});

// Change user password
app.put('/user/:username/password', (req, res) => {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.password === hashPassword(currentPassword));

    if (!user) {
        return res.status(400).send('Invalid current password');
    }

    user.password = hashPassword(newPassword);
    saveUsers(users);

    res.status(200).send('Password changed successfully');
});

// Upload profile picture
app.post('/upload', upload.single('profilePicture'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    console.log(`Uploaded file: ${req.file.path}`);
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// Route for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for profile.html
app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
