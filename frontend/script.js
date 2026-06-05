function sendMessage() {
    const input = document.querySelector(".message-input input");

    if (input.value.trim() === "") {
        alert("Please type a message first.");
        return;
    }

    alert("CareCompanion AI received your message: " + input.value);
    input.value = "";
}

document.querySelectorAll(".quick-actions button").forEach(button => {
    button.addEventListener("click", () => {
        alert("You selected: " + button.innerText);
    });
});

document.querySelector(".login-btn").addEventListener("click", () => {
    alert("Login page will open here.");
});