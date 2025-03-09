async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function signIn() {
    let email = document.getElementById("signinEmail").value.trim();
    let password = document.getElementById("signinPassword").value;
    let message = document.getElementById("message");

    // Clear previous message
    message.innerText = "";
    message.style.display = "none";

    // Debugging logs
    console.log("Attempting sign-in...");
    console.log("Entered email:", email);

    // Validate input fields
    if (!email || !password) {
        message.innerText = "Please enter both email and password.";
        message.style.display = "block";
        return;
    }

    // Retrieve the stored password hash from localStorage
    const storedPasswordHash = localStorage.getItem(email);
    console.log("Stored hash for email:", storedPasswordHash);

    // Check if the email exists in storage
    if (!storedPasswordHash) {
        message.innerText = "Invalid email or password.";
        message.style.display = "block";
        return;
    }

    // Hash the entered password for comparison
    const enteredPasswordHash = await hashPassword(password);
    console.log("Entered password hash:", enteredPasswordHash);

    // Compare hashes
    if (enteredPasswordHash === storedPasswordHash) {
        message.innerText = "Login successful!";
        message.style.backgroundColor = "green";
        message.style.display = "block";

        setTimeout(() => {
            window.location.href = "index.html"; // Redirect after successful login
        }, 1500);
    } else {
        message.innerText = "Invalid email or password.";
        message.style.display = "block";
    }
}

// Ensure this script runs only when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let signInButton = document.querySelector("button");
    if (signInButton) {
        signInButton.addEventListener("click", signIn);
    }
});