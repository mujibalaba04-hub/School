console.log("EduManage JavaScript connected successfully!");

const loginForm = document.getElementById("login-form");

const username = document.getElementById("username");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirm-password");

const confirmPasswordWrap = document.getElementById("confirm-password-wrap");

const showPassword = document.getElementById("mark");

const submitButton = document.getElementById("submit-button");

const resetButton = document.getElementById("reset-button");

const logoutButton = document.getElementById("logout-button");

const modeToggle = document.getElementById("mode-toggle");

const formHeading = document.getElementById("form-heading");

const formDescription = document.getElementById("form-description");

const formMessage = document.getElementById("form-message");


// 2. LOGIN / REGISTER MODE
// ==========================================

let isRegisterMode = false;


// Display messages

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message";

    if (type) {
        formMessage.classList.add(type);
    }

}


// Switch between Login and Create Account

modeToggle.addEventListener("click", function () {

    isRegisterMode = !isRegisterMode;

    showMessage("", "");

    if (isRegisterMode) {

        // REGISTER MODE

        formHeading.textContent = "Create Account";

        formDescription.textContent =
            "Create your EduManage account";

        submitButton.textContent = "Register";

        modeToggle.textContent = "Already have an account? Login";

        confirmPasswordWrap.hidden = false;

        confirmPassword.disabled = false;

        confirmPassword.required = true;

        password.autocomplete = "new-password";

    } else {

        // LOGIN MODE

        formHeading.textContent = "Welcome Back!";

        formDescription.textContent =
            "Please login to access your dashboard";

        submitButton.textContent = "Login";

        modeToggle.textContent = "Create an account";

        confirmPasswordWrap.hidden = true;

        confirmPassword.disabled = true;

        confirmPassword.required = false;

        confirmPassword.value = "";

        password.autocomplete = "current-password";

    }

});


// 3. SHOW / HIDE PASSWORD
// ==========================================

showPassword.addEventListener("change", function () {

    const inputType = this.checked ? "text" : "password";

    password.type = inputType;

    confirmPassword.type = inputType;

});


// 4. RESET FORM
// ==========================================

loginForm.addEventListener("reset", function () {

    setTimeout(function () {

        showMessage("", "");

        password.type = "password";

        confirmPassword.type = "password";

        showPassword.checked = false;

    }, 0);

});


// 5. GET REGISTERED USERS
// ==========================================

function getUsers() {

    const users = localStorage.getItem("edumanage_users");

    return users ? JSON.parse(users) : {};

}


// 6. CREATE ACCOUNT
// ==========================================

function createAccount() {

    const user = username.value.trim();

    const pass = password.value;

    const confirmPass = confirmPassword.value;


    // Check if username exists

    const users = getUsers();

    if (users[user]) {

        showMessage(
            "This username already exists!",
            "error"
        );

        return;

    }


    // Check password match

    if (pass !== confirmPass) {

        showMessage(
            "Passwords do not match!",
            "error"
        );

        confirmPassword.focus();

        return;

    }


    // Save account

    users[user] = pass;

    localStorage.setItem(
        "edumanage_users",
        JSON.stringify(users)
    );


    // Show success message

    showMessage(
        "Account created successfully! You can now login.",
        "success"
    );


    // Switch back to login mode

    isRegisterMode = false;

    formHeading.textContent = "Welcome Back!";

    formDescription.textContent =
        "Please login to access your dashboard";

    submitButton.textContent = "Login";

    modeToggle.textContent = "Create an account";

    confirmPasswordWrap.hidden = true;

    confirmPassword.disabled = true;

    confirmPassword.required = false;

    password.autocomplete = "current-password";

    password.value = "";

    confirmPassword.value = "";

}


// 7. LOGIN FUNCTION
// ==========================================

function loginUser() {

    const user = username.value.trim();

    const pass = password.value;

    const users = getUsers();


    // Check if account exists

    if (!users[user]) {

        showMessage(
            "Username not found. Please create an account.",
            "error"
        );

        return;

    }


    // Check password

    if (users[user] !== pass) {

        showMessage(
            "Incorrect password. Please try again.",
            "error"
        );

        return;

    }


    // Keep the verified username for the dashboard, then leave the login page.
    sessionStorage.setItem("edumanage_logged_user", user);
    window.location.replace("./dashboard.html");

}


// 8. HANDLE FORM SUBMISSION
// ==========================================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Check browser validation

    if (!loginForm.checkValidity()) {

        loginForm.reportValidity();

        return;

    }


    if (isRegisterMode) {

        createAccount();

    } else {

        loginUser();

    }

});


// 9. LOGOUT FUNCTION
// ==========================================

logoutButton.addEventListener("click", function () {

    // Remove logged-in user

    sessionStorage.removeItem("edumanage_logged_user");


    // Reset login form

    loginForm.reset();


    // Enable inputs

    username.disabled = false;

    password.disabled = false;

    showPassword.disabled = false;


    // Restore buttons

    submitButton.hidden = false;

    resetButton.hidden = false;

    modeToggle.hidden = false;

    logoutButton.hidden = true;


    // Reset message

    showMessage(
        "You have successfully logged out.",
        "success"
    );

});


// 10. CHECK EXISTING LOGIN SESSION
// ==========================================

const loggedInUser = sessionStorage.getItem(
    "edumanage_logged_user"
);

if (loggedInUser) {

    // Reopen the dashboard directly when this tab already has a login session.
    window.location.replace("./dashboard.html");

}