const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const form = document.getElementById("signupForm");
const message = document.getElementById("message");

const lengthRule = document.getElementById("length");
const uppercaseRule = document.getElementById("uppercase");
const numberRule = document.getElementById("number");
const specialRule = document.getElementById("special");

// Password Validation
password.addEventListener("keyup", function() {
    const value = password.value;
    if (value.length >= 8) lengthRule.classList.add("valid"); else lengthRule.classList.remove("valid");
    if (/[A-Z]/.test(value)) uppercaseRule.classList.add("valid"); else uppercaseRule.classList.remove("valid");
    if (/[0-9]/.test(value)) numberRule.classList.add("valid"); else numberRule.classList.remove("valid");
    if (/[!@#$%^&*]/.test(value)) specialRule.classList.add("valid"); else specialRule.classList.remove("valid");
});

// Eye Icon
document.getElementById("togglePassword").onclick = function() {
    password.type = (password.type === "password") ? "text" : "password";
};

// Form Submission
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameValue = document.getElementById("name").value;
    const emailValue = document.getElementById("email").value;
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if (passwordValue !== confirmPasswordValue) {
        message.style.color = "red";
        message.textContent = "Passwords do not match!";
        return;
    }

    message.style.color = "white";
    message.textContent = "Processing...";

    // --- RENDER URL UPDATE ---
    // Yahan apna asli Render link dalo (Jo aapko Render Dashboard par mila hai)
    // Example: 'https://sinup-page.onrender.com/signup'
    fetch('https://sinup-page.onrender.com/signup', {
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
            message.textContent = "🎉 " + data.message;
            form.reset();
            [lengthRule, uppercaseRule, numberRule, specialRule].forEach(el => el.classList.remove("valid"));
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        message.style.color = "red";
        message.textContent = "Server se connect nahi ho paya!";
    });
});