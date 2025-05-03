function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: "You must be logged in to upload images." });
  }
}

module.exports = requireLogin; 