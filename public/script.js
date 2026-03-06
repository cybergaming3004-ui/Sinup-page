const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const form = document.getElementById("signupForm");
const message = document.getElementById("message");

const lengthRule = document.getElementById("length");
const uppercaseRule = document.getElementById("uppercase");
const numberRule = document.getElementById("number");
const specialRule = document.getElementById("special");

// 1. Password Validation Logic (Rules update karne ke liye)
password.addEventListener("keyup", function() {
    const value = password.value;
    if (value.length >= 8) lengthRule.classList.add("valid"); else lengthRule.classList.remove("valid");
    if (/[A-Z]/.test(value)) uppercaseRule.classList.add("valid"); else uppercaseRule.classList.remove("valid");
    if (/[0-9]/.test(value)) numberRule.classList.add("valid"); else numberRule.classList.remove("valid");
    if (/[!@#$%^&*]/.test(value)) specialRule.classList.add("valid"); else specialRule.classList.remove("valid");
});

// 2. Eye Icon Logic (Password dekhne ke liye)
document.getElementById("togglePassword").onclick = function() {
    password.type = (password.type === "password") ? "text" : "password";
};

// 3. Form Submission Logic (Database mein bhejne ke liye)
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameValue = document.getElementById("name").value;
    const emailValue = document.getElementById("email").value;
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    // Validation checks
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailValue.match(emailPattern)) {
        message.style.color = "red";
        message.textContent = "Enter valid email";
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        message.style.color = "red";
        message.textContent = "Passwords do not match";
        return;
    }

    // --- SERVER KO DATA BHEJNA ---
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nameValue,
            email: emailValue,
            password: passwordValue
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            message.style.color = "lightgreen";
            message.textContent = "🎉 Account successfully ban gaya!";
            form.reset(); // Form khali kar dega
            // Sabhi rules ko wapas normal kar do
            [lengthRule, uppercaseRule, numberRule, specialRule].forEach(el => el.classList.remove("valid"));
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }
    })
    .catch(err => {
        console.error("Lafda:", err);
        message.style.color = "red";
        message.textContent = "Server se connect nahi ho paya!";
    });
});