async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function signUp() {
    let email = document.getElementById("signupEmail").value.trim();
    let reenterEmail = document.getElementById("reenterEmail").value.trim();
    let password = document.getElementById("signupPassword").value;
    let reenterPassword = document.getElementById("reenterPassword").value;
    let message = document.getElementById("message");

    // Hide message box initially
    message.style.display = "none";
    message.innerText = ""; 

    // Check if email already exists
    if (localStorage.getItem(email)) {
        message.innerText = "You already have an account. Try signing in.";
        message.style.display = "block";
        return;
    }

    // Validate input fields
    if (!email || !reenterEmail || !password || !reenterPassword) {
        message.innerText = "Please fill in all fields.";
    } else if (email !== reenterEmail) {
        message.innerText = "Emails do not match.";
    } else if (password.length < 6) {
        message.innerText = "Password must be at least 6 characters.";
    } else if (password !== reenterPassword) {
        message.innerText = "Passwords do not match.";
    } else {
        // Successful signup
        const passwordHash = await hashPassword(password);
        localStorage.setItem(email, passwordHash);
        message.innerText = "Account created successfully!";
        message.style.backgroundColor = "green";

        setTimeout(() => {
            window.location.href = "signin.html"; // Redirect to sign-in page after sign-up
        }, 1500);
    }

    // Show message only if there's text
    if (message.innerText !== "") {
        message.style.display = "block";
    }
}