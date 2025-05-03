const db = require('../models/db');

exports.register = (req, res) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type) {
    return res.status(400).json({ message: "All fields required" });
  }
  const callProc = "CALL addUser(?, ?, ?)";
  db.query(callProc, [email, password, type], (err) => {
    if (err) return res.status(500).json({ message: "Registration error" });
    res.status(201).json({ message: "User registered" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ? AND active = 1";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Login error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    req.session.user = {
      id: results[0].ID,
      email: results[0].email,
      type: results[0].type
    };
    res.json({ message: "Login successful", user: req.session.user });
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};

exports.sessionInfo = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
}; 