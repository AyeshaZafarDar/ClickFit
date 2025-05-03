require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/upload_images', express.static(path.join(__dirname, 'upload_images')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Modular routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/upload'));

// Catch-all for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});