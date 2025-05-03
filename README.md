# Click Fit

**Click Fit** is a modern, responsive fitness and sports web application built with Node.js, Express, MySQL, Bootstrap, HTML5, CSS3, and jQuery (with plugins). It features secure authentication, image uploads, dynamic fitness facts, testimonials, and a modular backend structure for maintainability and scalability.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Set Up the Database](#4-set-up-the-database)
  - [5. Run the Application](#5-run-the-application)
- [Usage](#usage)
- [Development Notes](#development-notes)
- [Security & Best Practices](#security--best-practices)
- [License](#license)

---

## Features

- **User Registration & Login** (with session management)
- **Role-based accounts:** User, Trainer, Admin
- **Image Uploads:** Drag-and-drop or click, only for logged-in users
- **Daily Fitness Facts:** Fetched via AJAX from the Numbers API
- **Testimonials Carousel:** Showcasing user success stories
- **Modern UI/UX:** Responsive, animated, and visually appealing
- **Bootstrap Toasts:** For all user feedback (login, logout, errors, etc.)
- **Modular Backend:** Professional code structure for scalability

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend:**
  - **HTML5:** Semantic markup for structure and accessibility
  - **CSS3:** Custom styles and responsive design
  - **Bootstrap 5:** Modern UI components and layout
  - **jQuery:** DOM manipulation and AJAX
  - **jQuery Plugins:** Used for enhanced interactivity (e.g., carousel, smooth scrolling, toasts)
- **Session Management:** express-session
- **File Uploads:** multer
- **Environment Variables:** dotenv

---

## Project Structure

```
click-fit-website/
├── controllers/         # Business logic (auth, upload, etc.)
├── middleware/          # Custom Express middleware (e.g., requireLogin)
├── models/              # Database connection and queries
├── routes/              # Express route definitions
├── images/          # App images (e.g., testimonials)
│   └── testimonials/
├── upload_images/   # User-uploaded images (via My Journey)
├── styles.css       # Main stylesheet
└── script.js        # Main frontend JS
├── .env                 # Environment variables (not committed)
├── index.html           # Main frontend file
├── server.js            # Express app entry point
├── package.json
└── README.md
```

- **images/**: Contains static images used by the app (e.g., testimonials).
- **upload_images/**: Stores user-uploaded images (e.g., from the My Journey section).
- **styles.css & script.js**: Main static CSS and JS files.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/click-fit-website.git
cd click-fit-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=clickfit_db
SESSION_SECRET=your_session_secret
```

> **Note:** Replace the values with your actual database credentials and a strong session secret.

### 4. Set Up the Database

- Create a MySQL database named `clickfit_db`.
- Import the provided SQL schema (if available) or create the necessary tables and stored procedures for users, images, testimonials, etc.

Example (MySQL CLI):

```sql
CREATE DATABASE clickfit_db;
USE clickfit_db;

-- Example user table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  type ENUM('user','trainer','admin') DEFAULT 'user'
);

-- Add other tables as needed (images, testimonials, etc.)
```

### 5. Run the Application

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Register:** Click the "Register" button in the navbar to create a new account.
- **Login:** Use the "Login" button to sign in.
- **Upload Images:** Once logged in, go to "My Journey" to upload your fitness images. Uploaded images are stored in `upload_images/`.
- **View Facts:** See a new fitness fact daily in the "Facts" section.
- **Browse Programs & Stories:** Explore available programs and user success stories.
- **Logout:** Use the profile/logout button in the navbar.

---

## Development Notes

- **Frontend:** Built with semantic HTML5, custom CSS3, and Bootstrap 5 for a modern, responsive UI.
- **jQuery & Plugins:** jQuery is used for DOM manipulation, AJAX requests, and UI interactivity. Additional jQuery plugins are used for features like the testimonials carousel, smooth scrolling, and Bootstrap toasts.
- **Backend:** Modularized for maintainability. Business logic is separated into controllers, routes, and middleware.
- **Session Handling:** Uses `express-session` for secure login sessions.
- **Image Uploads:** Only logged-in users can upload; files are validated and stored securely in `upload_images/`.
- **AJAX:** Used for dynamic content (e.g., daily facts, login/logout feedback).
- **Static Files:** In your `server.js`, ensure you have:
  ```js
  app.use(express.static(__dirname));
  ```

---

## Security & Best Practices

- **Passwords:** Always hashed before storing (use bcrypt or similar).
- **Sessions:** Use a strong `SESSION_SECRET` and consider secure cookie settings for production.
- **Uploads:** Only allow image files; validate file types and sizes.
- **Environment Variables:** Never commit `.env` to version control.
- **Modular Code:** Follows MVC-like separation for scalability and clarity.

---

**Questions or contributions?**  
Open an issue or submit a pull request on GitHub! 
