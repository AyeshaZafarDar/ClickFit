$(document).ready(() => {
  // Animate elements when they come into view
  function animateOnScroll() {
    $(".animate__animated").each(function () {
      const position = $(this).offset().top
      const scroll = $(window).scrollTop()
      const windowHeight = $(window).height()

      if (scroll + windowHeight > position) {
        const animation = $(this).data("animation") || "animate__fadeIn"
        const delay = $(this).data("delay") || 0

        setTimeout(() => {
          $(this).addClass(animation)
          $(this).css("opacity", "1")
        }, delay)
      }
    })
  }

  $(".animate__animated").css("opacity", "0")
  $(window).on("scroll", animateOnScroll)
  animateOnScroll()

  // AJAX Numbers API
  $.ajax({
    url: "http://numbersapi.com/1/30/date?json",
    method: "GET",
    dataType: "json",
    success: (data) => {
      $("#fact-container").html(`
                <i class="bi bi-info-circle text-primary fs-1 mb-3"></i>
                <p class="lead">${data.text}</p>
                <p class="text-muted">Fun fact for today!</p>
            `)
    },
    error: () => {
      $("#fact-container").html(`
                <i class="bi bi-exclamation-circle text-danger fs-1 mb-3"></i>
        <p>Oops! Couldn't load today's fact.</p>
            `)
    },
  })

  // Image Upload Logic
  const uploadContainer = document.getElementById("upload-container");
  const fileInput = document.getElementById("file-input");
  const previewContainer = document.getElementById("preview-container");
  const uploadButton = document.getElementById("upload-button");
  const uploadStatus = document.getElementById("upload-status");

  let files = [];

  ["dragenter", "dragover", "dragleave", "drop"].forEach(e =>
    uploadContainer.addEventListener(e, preventDefaults, false)
  );

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach(e =>
    uploadContainer.addEventListener(e, () => uploadContainer.classList.add("highlight"), false)
  );

  ["dragleave", "drop"].forEach(e =>
    uploadContainer.addEventListener(e, () => uploadContainer.classList.remove("highlight"), false)
  );

  uploadContainer.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFiles);
  uploadContainer.addEventListener("drop", e => handleFiles({ target: { files: e.dataTransfer.files } }));

  function handleFiles(e) {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (selected.length === 0) {
      showUploadStatus("Only image files allowed", "danger");
      return;
    }

    files = [...files, ...selected];
    updatePreviews();
    uploadButton.disabled = files.length === 0;
  }

  function updatePreviews() {
    previewContainer.innerHTML = "";
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement("div");
        div.className = "col-md-4 col-6 mb-3";
        div.innerHTML = `
          <div class="card">
            <img src="${e.target.result}" class="card-img-top" alt="Preview">
            <div class="card-body p-2">
              <button class="btn btn-sm btn-danger w-100" onclick="removeFile(${i})">Remove</button>
                            </div>
                        </div>
        `;
        previewContainer.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  }

  window.removeFile = function (index) {
    files.splice(index, 1);
    updatePreviews();
    uploadButton.disabled = files.length === 0;
  };

  // --- SESSION CHECK & NAVBAR USER INFO ---
  function renderAuthButtons() {
    // Desktop (large screens)
    if (!$("#navbar-auth-buttons").length) {
      // Insert after .navbar-nav (inside .navbar-collapse)
      $(".navbar-nav").after(`
        <div class='d-flex ms-auto align-items-center d-none d-lg-flex' id='navbar-auth-buttons'>
          <button class='btn btn-primary ms-2' data-bs-toggle='modal' data-bs-target='#registerModal'>Register</button>
          <button class='btn btn-outline-primary ms-2' data-bs-toggle='modal' data-bs-target='#loginModal'>Login</button>
        </div>
      `);
    }
    // Mobile (small screens)
    if (!$("#navbar-auth-buttons-mobile").length) {
      $(".navbar-collapse").append(`
        <div class="d-flex justify-content-center gap-2 w-100 d-lg-none mb-2 mb-lg-0" id="navbar-auth-buttons-mobile">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
          <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
        </div>
      `);
    }
  }

  function updateNavbarUserInfo(user) {
    if (user) {
      // Get user's initials (first letter of first name and first letter of last name)
      const nameParts = user.email.split('@')[0].split('.');
      const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : user.email[0].toUpperCase();
      
      const userInfoHtmlDesktop = `
        <div class="d-flex align-items-center">
          <div class="profile-circle me-2" title="${user.email}">
            ${initials}
          </div>
          <button class="btn btn-outline-danger btn-logout d-flex align-items-center" id="logoutBtnDesktop" title="Logout">
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      `;
      const userInfoHtmlMobile = `
        <div class="d-flex align-items-center justify-content-center w-100">
          <div class="profile-circle me-2" title="${user.email}">
            ${initials}
          </div>
          <button class="btn btn-outline-danger btn-logout d-flex align-items-center" id="logoutBtnMobile" title="Logout">
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      `;

      // Update both desktop and mobile containers
      $("#navbar-user-info").html(userInfoHtmlDesktop);
      $("#navbar-user-info-mobile").html(userInfoHtmlMobile);

      // Add logout handler to both containers
      $("#logoutBtnDesktop").on("click", handleLogout);
      $("#logoutBtnMobile").on("click", handleLogout);

      // Remove auth buttons from DOM in both containers
      $("#navbar-auth-buttons").remove();
      $("#navbar-auth-buttons-mobile").remove();
    } else {
      // Clear both containers
      $("#navbar-user-info").empty();
      $("#navbar-user-info-mobile").empty();

      // Render auth buttons in both containers
      renderAuthButtons();
    }
  }

  function checkSession() {
    $.get("/session", function(data) {
      if (data.loggedIn) {
        updateNavbarUserInfo(data.user);
      } else {
        updateNavbarUserInfo(null);
      }
    });
  }

  checkSession();

  // --- UPLOAD BUTTON: SHOW ERROR IF NOT LOGGED IN OR NO FILES SELECTED ---
  $("#upload-button").off("click").on("click", async function(e) {
    e.preventDefault();

    // Check if files are selected
    if (!files || files.length === 0) {
      showUploadStatus("Please select at least one image to upload.", "danger");
      return;
    }

    // Check session before upload
    const session = await $.get("/session");
    if (!session.loggedIn) {
      showUploadStatus("You must be logged in to upload images.", "danger");
      // Clear selected files and previews
      files = [];
      updatePreviews();
      fileInput.value = ''; // Clear the file input
      return;
    }

    // ... continue with upload logic ...
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    uploadButton.disabled = true;
    uploadButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Uploading...`;

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        showUploadStatus("Upload successful!", "success");
        files = [];
        updatePreviews();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showUploadStatus("Upload failed: " + err.message, "danger");
    } finally {
      uploadButton.disabled = false;
      uploadButton.textContent = "Upload Images";
    }
  });

  // Use jQuery for status
  function showUploadStatus(msg, type) {
    $("#upload-status").html(`<div class="alert alert-${type}">${msg}</div>`);
    setTimeout(() => $("#upload-status").html(""), 4000);
  }

  // --- HANDLE LOGOUT ---
  async function handleLogout() {
    await fetch("/logout", { method: "POST" });
    updateNavbarUserInfo(null);
    checkSession();
    showLogoutToast();
    // Remove logout buttons from both containers
    $("#logoutBtnDesktop").remove();
    $("#logoutBtnMobile").remove();
    // Show Register/Login buttons in both containers
    $("#navbar-auth-buttons").show();
    $("#navbar-auth-buttons-mobile").show();
  }

  // Add this function to show the status/error toast
  function showStatusToast(message, type = 'danger') {
    const toastEl = document.getElementById("statusToast");
    $("#statusToastBody").html(message);
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastEl, { delay: 1200, autohide: true });
    toast.show();
  }

  // Register
  document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    const type = $("#userType").val();

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type })
      });
      const data = await res.json();
      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
        showStatusToast("Registration successful! You can now log in.", "success");
      } else {
        // Registration failed, show error toast
        showStatusToast("Failed: " + data.message, "danger");
      }
    } catch (err) {
      // Show error toast
      showStatusToast("Error: " + err.message, "danger");
    }
  });

  // Login
  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        showLoginToast(data.user);
        updateNavbarUserInfo(data.user);
      } else {
        // Login failed, show error toast
        showStatusToast("Login failed: " + data.message, "danger");
      }
    } catch (err) {
      // Show error toast
      showStatusToast("Login error: " + err.message, "danger");
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      // --- AUTO COLLAPSE NAVBAR ON SMALL SCREENS ---
      const navbarCollapse = document.querySelector('.navbar-collapse');
      const navbarToggler = document.querySelector('.navbar-toggler');
      if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
        // If toggler is visible, collapse the navbar
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Add this function to show the login toast
  function showLoginToast(user) {
    $("#loginToastBody").html(`Welcome, <b>${user.email}</b>! You are now logged in as <b>${user.type}</b>.`);
    const toast = new bootstrap.Toast(document.getElementById("loginToast"), { delay: 1200, autohide: true });
    toast.show();
  }

  // Add this function to show the logout toast
  function showLogoutToast() {
    $("#logoutToastBody").html("You have been logged out.");
    const toast = new bootstrap.Toast(document.getElementById("logoutToast"), { delay: 1200, autohide: true });
    toast.show();
  }

  // Collapse navbar on small screens
  function collapseNavbarIfMobile() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
  }

  // Event delegation for Register/Login (mobile & desktop)
  $(document).on('click', '#navbar-auth-buttons-mobile button, #navbar-auth-buttons button', function() {
    collapseNavbarIfMobile();
  });
  // Event delegation for Logout (mobile & desktop)
  $(document).on('click', '#logoutBtnMobile, #logoutBtnDesktop', function() {
    collapseNavbarIfMobile();
  });

  function logout() {
    // Clear user session
    localStorage.removeItem('user');
    
    // Hide user info and show auth buttons on both large and small screens
    document.getElementById('navbar-user-info').classList.add('d-none');
    document.getElementById('navbar-user-info-mobile').classList.add('d-none');
    document.getElementById('navbar-auth-buttons').classList.remove('d-none');
    document.getElementById('navbar-auth-buttons-mobile').classList.remove('d-none');
    
    // Show logout toast
    const logoutToast = new bootstrap.Toast(document.getElementById('logoutToast'));
    logoutToast.show();
  }
});
