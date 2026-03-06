const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameValue = document.getElementById("name").value;
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    message.style.color = "white";
    message.textContent = "Processing...";

    // Auto-detect URL: Isse 'Not Found' error nahi aayega
    const currentURL = window.location.origin;

    fetch(`${currentURL}/signup`, {
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
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        message.style.color = "red";
        message.textContent = "Server connect nahi ho paya!";
    });
});