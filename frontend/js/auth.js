// auth.js - handles Supabase Authentication for login and registration

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const errorMsg = document.getElementById("auth-error");
    const successMsg = document.getElementById("auth-success");

    // Login logic
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            const loginBtn = document.getElementById("login-btn");
            loginBtn.disabled = true;
            loginBtn.textContent = "Logging in...";
            errorMsg.style.display = "none";

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                errorMsg.textContent = error.message;
                errorMsg.style.display = "block";
                loginBtn.disabled = false;
                loginBtn.textContent = "Log In";
            } else {
                window.location.href = "dashboard.html";
            }
        });
    }

    // Registration logic
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            const registerBtn = document.getElementById("register-btn");
            registerBtn.disabled = true;
            registerBtn.textContent = "Signing up...";
            errorMsg.style.display = "none";
            successMsg.style.display = "none";

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                errorMsg.textContent = error.message;
                errorMsg.style.display = "block";
                registerBtn.disabled = false;
                registerBtn.textContent = "Sign Up";
            } else {
                successMsg.style.display = "block";
                registerForm.reset();
                registerBtn.disabled = false;
                registerBtn.textContent = "Sign Up";
            }
        });
    }

});
