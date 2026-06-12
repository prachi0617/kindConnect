const API = "http://localhost:8080";

function openModal(title, bodyHtml) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalBody").innerHTML = bodyHtml;
    document.getElementById("modalBg").style.display = "flex";
}

function closeModal() {
    document.getElementById("modalBg").style.display = "none";
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function setDashboardDate() {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    document.getElementById("dashboardDate").innerText = "📅 " + formattedDate;

    const hour = today.getHours();
    let greeting = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning! You’ve got this.";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon! Keep going.";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening! You did great today.";
    } else {
        greeting = "Good night! Take some rest.";
    }

    const greetingElement = document.getElementById("dashboardGreeting");

    if (greetingElement) {
        greetingElement.innerText = greeting;
    }
}

/* ===================== MESSAGES ===================== */

async function openMessages() {
    openModal("Messages", `<p>Loading messages...</p>`);

    try {
        const response = await fetch(`${API}/api/messages`);

        if (!response.ok) {
            throw new Error("Messages API failed");
        }

        const messages = await response.json();

        let html = `
            <button class="modal-action" onclick="openAddMessageForm()">+ Add Message</button>
        `;

        messages.forEach(message => {
            html += `
                <div class="info-card">
                    <h3>${message.readMessage ? "✅" : "🔔"} ${message.title}</h3>
                    <p>${message.content}</p>

                    <button class="modal-action" onclick="markMessageRead(${message.id})">
                        Mark Read
                    </button>

                    <button class="modal-action" onclick="deleteMessage(${message.id})">
                        Delete
                    </button>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML =
            messages.length > 0 ? html : `
                <button class="modal-action" onclick="openAddMessageForm()">+ Add Message</button>
                <p>No messages yet.</p>
            `;

    } catch (error) {
        document.getElementById("modalBody").innerHTML =
            "<p>Could not load messages.</p>";
    }
}

function openAddMessageForm() {
    openModal("Add New Message", `
        <div class="form-group">
            <label>User ID</label>
            <input id="messageUserId" value="1">
        </div>

        <div class="form-group">
            <label>Title</label>
            <input id="messageTitle" placeholder="Example: Electric Bill Due">
        </div>

        <div class="form-group">
            <label>Type</label>
            <select id="messageType">
                <option>Bill</option>
                <option>Reminder</option>
                <option>Appointment</option>
                <option>Transportation</option>
                <option>Food</option>
                <option>Friendly Call</option>
                <option>Volunteer</option>
                <option>Community Services</option>
            </select>
        </div>

        <div class="form-group">
            <label>Message Content</label>
            <textarea id="messageContent" placeholder="Example: Your electric bill is due on June 15."></textarea>
        </div>

        <button class="modal-action" onclick="saveMessageFromWebsite()">Save Message</button>
        <button class="modal-action" onclick="openMessages()">Back to Messages</button>

        <div id="messageResult" class="result-box"></div>
    `);
}

async function saveMessageFromWebsite() {
    const message = {
        userId: Number(document.getElementById("messageUserId").value),
        title: document.getElementById("messageTitle").value,
        type: document.getElementById("messageType").value,
        content: document.getElementById("messageContent").value,
        readMessage: false
    };

    try {
        const response = await fetch(`${API}/api/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message)
        });

        const data = await response.json();

        document.getElementById("messageResult").innerText =
            "Message saved successfully:\n" + JSON.stringify(data, null, 2);

    } catch (error) {
        document.getElementById("messageResult").innerText =
            "Could not save message.";
    }
}

async function markMessageRead(id) {
    try {
        await fetch(`${API}/api/messages/${id}/read`, {
            method: "PUT"
        });

        openMessages();

    } catch (error) {
        alert("Could not mark message as read.");
    }
}

async function deleteMessage(id) {
    try {
        await fetch(`${API}/api/messages/${id}`, {
            method: "DELETE"
        });

        openMessages();

    } catch (error) {
        alert("Could not delete message.");
    }
}

/* ===================== SETTINGS ===================== */

function openSettings() {
    openModal("Settings", `
        <div class="info-card">
            <h3>⚙️ User Settings</h3>
            <p>Settings page will be added later.</p>
        </div>

        <div class="info-card">
            <h3>🔔 Notifications</h3>
            <p>Reminder notifications can be added in a future version.</p>
        </div>

        <div class="info-card">
            <h3>🤖 AI Provider</h3>
            <p>Current AI provider: Spring Boot chat endpoint.</p>
        </div>
    `);
}

/* ===================== AI CHAT ===================== */

async function callKindConnectAI(message) {
    const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: 1,
            message: message
        })
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text);
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return { reply: text };
    }
}

function openAIChat() {
    openModal("KindConnect AI Agent", `
        <div class="info-card">
            <h3>🤖 AI Support Chat</h3>
            <p>Type your message, click Send, and continue chatting.</p>
        </div>

        <div id="modalAIConversation" class="ai-conversation">
            <div class="chat-message bot-chat">
                Hi! I am your KindConnect AI Agent. How can I help you today?
            </div>
        </div>

        <div class="ai-input-row">
            <textarea id="modalAIMessage" placeholder="Type your message here..."></textarea>
            <button onclick="sendModalAIMessage()">Send</button>
        </div>
    `);
}

function addModalChatMessage(text, sender) {
    const conversation = document.getElementById("modalAIConversation");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");

    if (sender === "user") {
        messageDiv.classList.add("user-chat");
    } else if (sender === "thinking") {
        messageDiv.classList.add("thinking-chat");
    } else {
        messageDiv.classList.add("bot-chat");
    }

    messageDiv.innerText = text;
    conversation.appendChild(messageDiv);
    conversation.scrollTop = conversation.scrollHeight;

    return messageDiv;
}

async function sendModalAIMessage() {
    const input = document.getElementById("modalAIMessage");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

    addModalChatMessage(message, "user");
    input.value = "";

    const thinkingMessage = addModalChatMessage("Thinking...", "thinking");

    try {
        const data = await callKindConnectAI(message);

        thinkingMessage.className = "chat-message bot-chat";

        if (data.reply) {
            thinkingMessage.innerText = data.reply;
        } else {
            thinkingMessage.innerText = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        thinkingMessage.className = "chat-message bot-chat";
        thinkingMessage.innerText =
            "AI is not working. Make sure Spring Boot is running on port 8080.\n\n" +
            error.message;
    }
}

/* ===================== AUTH ===================== */

function openRegister() {
    openModal("Register First", `
        <div class="info-card">
            <h3>Create your KindConnect account</h3>
            <p>Register first, then login to use KindConnect.</p>
        </div>

        <div class="form-group">
            <label>Name</label>
            <input id="registerName" placeholder="Your name">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input id="registerEmail" placeholder="email@example.com">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input id="registerPassword" type="password" placeholder="password">
        </div>

        <div class="form-group">
            <label>User Type</label>
            <select id="registerUserType">
                <option>FAMILY</option>
                <option>SENIOR</option>
                <option>CAREGIVER</option>
                <option>VOLUNTEER</option>
            </select>
        </div>

        <button class="modal-action" onclick="registerUser()">Register</button>
        <button class="modal-action" onclick="openLogin()">Already registered? Login</button>

        <div id="registerResult" class="result-box"></div>
    `);
}

async function registerUser() {
    const user = {
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value,
        userType: document.getElementById("registerUserType").value
    };

    try {
        const response = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const result = await response.json();
        document.getElementById("registerResult").innerText =
            JSON.stringify(result, null, 2) + "\n\nNow click Login.";
    } catch (error) {
        document.getElementById("registerResult").innerText =
            "Backend is not running. Start Spring Boot first.";
    }
}

function openLogin() {
    openModal("Login", `
        <div class="info-card">
            <h3>Login to KindConnect</h3>
            <p>Use the same email and password you registered with.</p>
        </div>

        <div class="form-group">
            <label>Email</label>
            <input id="loginEmail" placeholder="email@example.com">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input id="loginPassword" type="password" placeholder="password">
        </div>

        <button class="modal-action" onclick="loginUser()">Login</button>
        <button class="modal-action" onclick="openRegister()">Need account? Register</button>

        <div id="loginResult" class="result-box"></div>
    `);
}

async function loginUser() {
    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("loginResult").innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById("loginResult").innerText = "Backend is not running.";
    }
}

/* ===================== RESOURCES ===================== */

function openResourcesAll() {
    openModal("Community Resources", `<p>Loading resources...</p>`);
    loadResources();
}

async function loadResources() {
    try {
        const response = await fetch(`${API}/api/resources`);
        const resources = await response.json();

        let html = "";

        resources.forEach(resource => {
            html += `
                <div class="info-card">
                    <h3>${resource.name}</h3>
                    <p><strong>Category:</strong> ${resource.category}</p>
                    <p><strong>Description:</strong> ${resource.description}</p>
                    <p><strong>Location:</strong> ${resource.location}</p>
                    <p><strong>Phone:</strong> ${resource.phone}</p>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML =
            resources.length > 0 ? html : "<p>No resources available right now.</p>";

    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Could not load resources.</p>";
    }
}

async function openResourceCategory(category) {
    openModal(category + " Resources", `<p>Loading...</p>`);

    try {
        const response = await fetch(`${API}/api/resources`);
        const resources = await response.json();

        const filtered = resources.filter(resource =>
            resource.category &&
            resource.category.toLowerCase() === category.toLowerCase()
        );

        let html = "";

        filtered.forEach(resource => {
            html += `
                <div class="info-card">
                    <h3>${resource.name}</h3>
                    <p><strong>Description:</strong> ${resource.description}</p>
                    <p><strong>Location:</strong> ${resource.location}</p>
                    <p><strong>Phone:</strong> ${resource.phone}</p>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML =
            filtered.length > 0 ? html : `<p>No ${category} resources available right now.</p>`;

    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Could not load resources.</p>";
    }
}

/* ===================== REMINDERS ===================== */

function openReminderForm(type) {
    openModal("Add Daily Reminder", `
        <div class="form-group">
            <label>User ID</label>
            <input id="reminderUserId" value="1">
        </div>

        <div class="form-group">
            <label>Title</label>
            <input id="reminderTitle" value="${type === 'Medicine' ? 'Take medicine' : ''}">
        </div>

        <div class="form-group">
            <label>Type</label>
            <select id="reminderType">
                <option>Medicine</option>
                <option>Appointment</option>
                <option>Water</option>
                <option>Bill</option>
                <option>Self-care</option>
            </select>
        </div>

        <div class="form-group">
            <label>Date</label>
            <input id="reminderDate" type="date">
        </div>

        <div class="form-group">
            <label>Time</label>
            <input id="reminderTime" type="time">
        </div>

        <button class="modal-action" onclick="saveReminder()">Save Reminder</button>
        <button class="modal-action" onclick="openReminderList()">View Reminders</button>
        <div id="reminderResult" class="result-box"></div>
    `);
}

async function saveReminder() {
    const reminder = {
        userId: Number(document.getElementById("reminderUserId").value),
        title: document.getElementById("reminderTitle").value,
        type: document.getElementById("reminderType").value,
        date: document.getElementById("reminderDate").value,
        time: document.getElementById("reminderTime").value
    };

    try {
        const response = await fetch(`${API}/api/reminders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reminder)
        });

        const data = await response.json();
        document.getElementById("reminderResult").innerText =
            "Saved:\n" + JSON.stringify(data, null, 2);
        loadDashboardData();
    } catch (error) {
        document.getElementById("reminderResult").innerText = "Backend is not running.";
    }
}

async function openReminderList() {
    openModal("Daily Reminders", "<p>Loading reminders...</p>");

    try {
        const response = await fetch(`${API}/api/reminders`);
        const reminders = await response.json();

        let html = "";
        reminders.forEach(reminder => {
            html += `
                <div class="info-card">
                    <h3>${reminder.title}</h3>
                    <p><strong>Type:</strong> ${reminder.type}</p>
                    <p><strong>Date:</strong> ${reminder.date}</p>
                    <p><strong>Time:</strong> ${reminder.time}</p>
                    <p><strong>Completed:</strong> ${reminder.completed}</p>
                    <button class="modal-action" onclick="completeReminder(${reminder.id})">Mark Complete</button>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML = html || "<p>No reminders yet.</p>";
    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Backend is not running.</p>";
    }
}

async function completeReminder(id) {
    try {
        await fetch(`${API}/api/reminders/${id}/complete`, {
            method: "PUT"
        });

        loadDashboardData();

        const modalTitle = document.getElementById("modalTitle");
        if (modalTitle && modalTitle.innerText === "Daily Reminders") {
            openReminderList();
        }

    } catch (error) {
        alert("Backend is not running.");
    }
}

async function loadDashboardData() {
    const dashboardTasks = document.getElementById("dashboardTasks");
    dashboardTasks.innerHTML = "<p>Loading reminders...</p>";

    try {
        const response = await fetch(`${API}/api/reminders`);
        const reminders = await response.json();

        const pendingReminders = reminders.filter(reminder => reminder.completed === false);
        const completedReminders = reminders.filter(reminder => reminder.completed === true);

        let html = "";

        html += `<h3 class="dashboard-small-title">Pending Tasks</h3>`;

        if (pendingReminders.length === 0) {
            html += `
                <div class="task-row task-row-completed">
                    <div class="task-icon">✅</div>
                    <div>
                        <strong>No pending tasks</strong><br>
                        <small>You are all caught up.</small>
                    </div>
                    <span class="status-badge completed-badge">Completed</span>
                    <button class="complete-btn disabled-btn">Done</button>
                </div>
            `;
        } else {
            pendingReminders.forEach(reminder => {
                let icon = "🔔";

                if (reminder.type && reminder.type.toLowerCase().includes("medicine")) {
                    icon = "💊";
                } else if (reminder.type && reminder.type.toLowerCase().includes("water")) {
                    icon = "💧";
                } else if (reminder.type && reminder.type.toLowerCase().includes("appointment")) {
                    icon = "📅";
                } else if (reminder.type && reminder.type.toLowerCase().includes("bill")) {
                    icon = "💵";
                }

                html += `
                    <div class="task-row">
                        <div class="task-icon">${icon}</div>

                        <div>
                            <strong>${reminder.title}</strong><br>
                            <small>${reminder.type}</small>
                        </div>

                        <span class="status-badge pending-badge">⏳ Pending</span>

                        <button class="complete-btn" onclick="completeReminder(${reminder.id})">
                            Complete
                        </button>
                    </div>
                `;
            });
        }

        html += `<h3 class="dashboard-small-title completed-title">Completed Tasks</h3>`;

        if (completedReminders.length === 0) {
            html += `
                <div class="task-row task-row-completed">
                    <div class="task-icon">📭</div>
                    <div>
                        <strong>No completed tasks yet</strong><br>
                        <small>Completed tasks will show here.</small>
                    </div>
                    <span class="status-badge pending-badge">Waiting</span>
                    <button class="complete-btn disabled-btn">--</button>
                </div>
            `;
        } else {
            completedReminders.forEach(reminder => {
                html += `
                    <div class="task-row task-row-completed">
                        <div class="task-icon completed-icon">✅</div>

                        <div>
                            <strong>${reminder.title}</strong><br>
                            <small>You completed this task.</small>
                        </div>

                        <span class="status-badge completed-badge">✅ Completed</span>

                        <button class="complete-btn disabled-btn">
                            Done
                        </button>
                    </div>
                `;
            });
        }

        dashboardTasks.innerHTML = html;

    } catch (error) {
        dashboardTasks.innerHTML = "<p>Backend is not running.</p>";
    }
}

/* ===================== MOODS ===================== */

function openMoodForm() {
    openModal("Mood Check-ins", `
        <div class="form-group">
            <label>User ID</label>
            <input id="moodUserId" value="1">
        </div>

        <div class="form-group">
            <label>Mood</label>
            <select id="moodValue">
                <option value="Sad">Sad</option>
                <option value="Lonely">Lonely</option>
                <option value="Stressed">Stressed</option>
            </select>
        </div>

        <div class="form-group">
            <label>Note</label>
            <textarea id="moodNote" placeholder="Write how you feel..."></textarea>
        </div>

        <div class="form-group">
            <label>Date</label>
            <input id="moodDate" type="date">
        </div>

        <button class="modal-action" onclick="saveMood()">Save Mood</button>
        <button class="modal-action" onclick="openMoodList()">View Mood History</button>
        <div id="moodResult" class="result-box"></div>
    `);
}

async function saveMood() {
    const moodValue = document.getElementById("moodValue").value;
    const moodNote = document.getElementById("moodNote").value;

    const mood = {
        userId: Number(document.getElementById("moodUserId").value),
        mood: moodValue,
        note: moodNote,
        date: document.getElementById("moodDate").value
    };

    try {
        await fetch(`${API}/api/moods`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mood)
        });
    } catch (error) {
        console.log("Mood save failed, but mood support popup will still show.");
    }

    showBackendMoodPopup(moodValue);
}

async function showBackendMoodPopup(moodValue) {
    try {
        const response = await fetch(`${API}/api/mood-support/${moodValue}`);

        if (!response.ok) {
            throw new Error("Mood support backend not found.");
        }

        const support = await response.json();

        let suggestionsHtml = "";
        support.suggestions.forEach(item => {
            suggestionsHtml += `<p>${item}</p>`;
        });

        let buttonsHtml = "";
        support.buttons.forEach(button => {
            if (button === "Laugh Video") {
                buttonsHtml += `<button onclick="openLaughVideo()">😂 Laugh Video</button>`;
            }

            if (button === "Happy Playlist") {
                buttonsHtml += `<button onclick="openHappyPlaylist()">🎵 Happy Playlist</button>`;
            }

            if (button === "Funny Talk") {
                buttonsHtml += `<button onclick="openSadFunnyTalk()">🎤 Funny Talk</button>`;
            }

            if (button === "Friendly Call") {
                buttonsHtml += `<button onclick="openHelpRequest('Friendly Call')">☎️ Friendly Call</button>`;
            }

            if (button === "Comfort Movie") {
                buttonsHtml += `<button onclick="openComfortMovie()">🎬 Comfort Movie</button>`;
            }

            if (button === "Kind Talk") {
                buttonsHtml += `<button onclick="openLonelyKindTalk()">💬 Kind Talk</button>`;
            }

            if (button === "Relaxing Music") {
                buttonsHtml += `<button onclick="openRelaxingMusic()">🌿 Relaxing Music</button>`;
            }

            if (button === "Concerts Near Me") {
                buttonsHtml += `<button onclick="openConcertsNearMe()">🎤 Concerts Near Me</button>`;
            }

            if (button === "Funny Break") {
                buttonsHtml += `<button onclick="openStressFunnyBreak()">😂 Funny Break</button>`;
            }
        });

        const moodClass = support.mood.toLowerCase() + "-flyer";

        openModal(support.flyerTitle, `
            <div class="mood-flyer ${moodClass}">
                <h1>${support.title}</h1>
                <p>${support.message}</p>

                <div class="flyer-box">
                    <h3>Suggestions:</h3>
                    ${suggestionsHtml}
                </div>

                <h2>KindConnect is here with you 💙</h2>

                <div class="popup-button-row">
                    ${buttonsHtml}
                </div>
            </div>
        `);

    } catch (error) {
        showFrontendBackupMoodPopup(moodValue);
    }
}

function showFrontendBackupMoodPopup(moodValue) {
    const selectedMood = moodValue.toLowerCase();

    if (selectedMood === "sad") {
        openModal("Sad Support", `
            <div class="mood-flyer sad-flyer">
                <h1>💙 A Little Smile For You</h1>
                <p>Feeling sad is okay. Let’s try something small that can help your heart feel lighter.</p>

                <div class="flyer-box">
                    <h3>Suggestions:</h3>
                    <p>😂 Watch a laugh video</p>
                    <p>🎵 Play a happy playlist</p>
                    <p>🎤 Read a quick funny talk</p>
                </div>

                <div class="popup-button-row">
                    <button onclick="openLaughVideo()">😂 Laugh Video</button>
                    <button onclick="openHappyPlaylist()">🎵 Happy Playlist</button>
                    <button onclick="openSadFunnyTalk()">🎤 Funny Talk</button>
                </div>
            </div>
        `);
    }

    if (selectedMood === "lonely") {
        openModal("Lonely Support", `
            <div class="mood-flyer lonely-flyer">
                <h1>💜 You Are Not Alone</h1>
                <p>Feeling lonely happens, but you do not have to sit with it alone.</p>

                <div class="flyer-box">
                    <h3>Suggestions:</h3>
                    <p>☎️ Request a friendly call</p>
                    <p>🎬 Watch comfort movie clips</p>
                    <p>💬 Read a kind message</p>
                </div>

                <div class="popup-button-row">
                    <button onclick="openHelpRequest('Friendly Call')">☎️ Friendly Call</button>
                    <button onclick="openComfortMovie()">🎬 Comfort Movie</button>
                    <button onclick="openLonelyKindTalk()">💬 Kind Talk</button>
                </div>
            </div>
        `);
    }

    if (selectedMood === "stressed") {
        openModal("Stress Support", `
            <div class="mood-flyer stressed-flyer">
                <h1>🌿 Pause. Breathe. Reset.</h1>
                <p>Stress can feel heavy. Let’s give your mind a short break with something relaxing or fun.</p>

                <div class="flyer-box">
                    <h3>Suggestions:</h3>
                    <p>🌬️ Take 3 slow breaths</p>
                    <p>🎵 Listen to calm music</p>
                    <p>🎤 Find concerts or events near you</p>
                </div>

                <div class="popup-button-row">
                    <button onclick="openRelaxingMusic()">🌿 Relaxing Music</button>
                    <button onclick="openConcertsNearMe()">🎤 Concerts Near Me</button>
                    <button onclick="openStressFunnyBreak()">😂 Funny Break</button>
                </div>
            </div>
        `);
    }
}

/* ===== MOOD LINKS ===== */

function openLaughVideo() {
    window.open("https://www.youtube.com/results?search_query=funny+videos+to+make+you+laugh", "_blank");
}

function openHappyPlaylist() {
    window.open("https://www.youtube.com/results?search_query=happy+songs+playlist", "_blank");
}

function openRelaxingMusic() {
    window.open("https://www.youtube.com/results?search_query=relaxing+music+for+stress+relief", "_blank");
}

function openComfortMovie() {
    window.open("https://www.youtube.com/results?search_query=comfort+movie+clips+funny+scenes", "_blank");
}

function openConcertsNearMe() {
    window.open("https://www.google.com/search?q=concerts+near+me+this+weekend", "_blank");
}

/* ===== SECOND POPUPS ===== */

function openSadFunnyTalk() {
    openModal("Funny Talk For Sad Mood", `
        <div class="funny-talk-card">
            <h2>😂 Tiny Laugh Break</h2>

            <p><strong>Joke 1:</strong> Why did the cookie go to the doctor?</p>
            <p>Because it felt crumby.</p>

            <p><strong>Joke 2:</strong> Why did the phone need glasses?</p>
            <p>Because it lost all its contacts.</p>

            <p><strong>Joke 3:</strong> Why did the banana go to the party?</p>
            <p>Because it was a-peeling.</p>

            <p class="kind-line">
                You do not have to feel better all at once. One small smile counts 💙
            </p>

            <button class="modal-action" onclick="openLaughVideo()">Watch Laugh Video</button>
            <button class="modal-action" onclick="openHappyPlaylist()">Play Happy Music</button>
        </div>
    `);
}

function openLonelyKindTalk() {
    openModal("Kind Talk", `
        <div class="kind-talk-card">
            <h2>💜 Kind Talk</h2>

            <p>You are not invisible.</p>
            <p>You are allowed to need connection.</p>
            <p>A small call, song, or funny video can be a first step.</p>

            <div class="flyer-box">
                <h3>Try this now:</h3>
                <p>☎️ Ask for a friendly call</p>
                <p>🎵 Play one song you like</p>
                <p>😂 Watch one short funny clip</p>
                <p>💬 Send one message to someone you trust</p>
            </div>

            <button class="modal-action" onclick="openHelpRequest('Friendly Call')">Request Friendly Call</button>
            <button class="modal-action" onclick="openLaughVideo()">Watch Funny Video</button>
        </div>
    `);
}

function openStressFunnyBreak() {
    openModal("Stress Funny Break", `
        <div class="stress-break-card">
            <h2>🌿 60 Second Reset</h2>

            <p><strong>Step 1:</strong> Relax your shoulders.</p>
            <p><strong>Step 2:</strong> Take one deep breath.</p>
            <p><strong>Step 3:</strong> Watch something funny or play calm music.</p>

            <div class="flyer-box">
                <h3>Quick choice:</h3>
                <p>😂 Laugh first if your mind feels too full</p>
                <p>🎵 Calm music if your body feels tense</p>
                <p>🎤 Concerts near you if you need something to look forward to</p>
            </div>

            <button class="modal-action" onclick="openLaughVideo()">Funny Video</button>
            <button class="modal-action" onclick="openRelaxingMusic()">Calm Music</button>
            <button class="modal-action" onclick="openConcertsNearMe()">Concerts Near Me</button>
        </div>
    `);
}

/* ===================== MOOD HISTORY ===================== */

async function openMoodList() {
    openModal("Mood History", "<p>Loading mood history...</p>");

    try {
        const response = await fetch(`${API}/api/moods`);
        const moods = await response.json();

        let html = "";

        moods.forEach(mood => {
            html += `
                <div class="info-card">
                    <h3>💜 ${mood.mood}</h3>
                    <p><strong>Note:</strong> ${mood.note}</p>
                    <p><strong>Date:</strong> ${mood.date}</p>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML = html || "<p>No mood history yet.</p>";

    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Could not load mood history.</p>";
    }
}

/* ===================== HELP / VOLUNTEER ===================== */

function openHelpRequest(type) {
    openModal(type + " Request", `
        <div class="form-group">
            <label>User ID</label>
            <input id="helpUserId" value="1">
        </div>

        <div class="form-group">
            <label>Request Type</label>
            <select id="helpType">
                <option ${type === "Friendly Call" ? "selected" : ""}>Friendly Call</option>
                <option ${type === "Grocery Help" ? "selected" : ""}>Grocery Help</option>
                <option ${type === "Ride Help" ? "selected" : ""}>Ride Help</option>
                <option ${type === "Tech Help" ? "selected" : ""}>Tech Help</option>
                <option ${type === "General Help" ? "selected" : ""}>General Help</option>
            </select>
        </div>

        <div class="form-group">
            <label>Preferred Day</label>
            <select id="preferredDay">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Weekend</option>
                <option>Any Day</option>
            </select>
        </div>

        <div class="form-group">
            <label>Preferred Time</label>
            <select id="preferredTime">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Any Time</option>
            </select>
        </div>

        <div class="form-group">
            <label>Urgency</label>
            <select id="urgency">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
        </div>

        <div class="form-group">
            <label>Reason / Message</label>
            <textarea id="helpMessage" placeholder="Example: I feel lonely and would like a friendly call."></textarea>
        </div>

        <button class="modal-action" onclick="saveHelpRequest()">Submit Request</button>
        <button class="modal-action" onclick="openHelpRequestList()">View Requests</button>

        <div id="helpResult" class="result-box"></div>
    `);
}

async function saveHelpRequest() {
    const request = {
        userId: Number(document.getElementById("helpUserId").value),
        requestType: document.getElementById("helpType").value,
        preferredDay: document.getElementById("preferredDay").value,
        preferredTime: document.getElementById("preferredTime").value,
        urgency: document.getElementById("urgency").value,
        message: document.getElementById("helpMessage").value,
        status: "Pending",
        completed: false
    };

    try {
        const response = await fetch(`${API}/api/help-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        const data = await response.json();

        document.getElementById("helpResult").innerHTML = `
            <div class="success-box">
                ✅ Request submitted successfully.<br>
                Status: ${data.status}<br>
                Request ID: ${data.id}
            </div>

            <button class="modal-action" onclick="matchHelpRequest(${data.id})">
                Match With Volunteer
            </button>
        `;

    } catch (error) {
        document.getElementById("helpResult").innerText =
            "Could not submit help request. Make sure backend is running.";
    }
}

async function openHelpRequestList() {
    openModal("Help Requests", "<p>Loading requests...</p>");

    try {
        const response = await fetch(`${API}/api/help-requests`);
        const requests = await response.json();

        let html = "";

        requests.forEach(request => {
            html += `
                <div class="info-card">
                    <h3>☎️ ${request.requestType}</h3>
                    <p><strong>Message:</strong> ${request.message || "No message"}</p>
                    <p><strong>Preferred Day:</strong> ${request.preferredDay || "Any Day"}</p>
                    <p><strong>Preferred Time:</strong> ${request.preferredTime || "Any Time"}</p>
                    <p><strong>Urgency:</strong> ${request.urgency || "Low"}</p>
                    <p><strong>Status:</strong> ${request.status || "Pending"}</p>

                    <button class="modal-action" onclick="matchHelpRequest(${request.id})">
                        Match Volunteer
                    </button>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML =
            html || "<p>No help requests yet.</p>";

    } catch (error) {
        document.getElementById("modalBody").innerHTML =
            "<p>Could not load help requests.</p>";
    }
}

async function matchHelpRequest(id) {
    try {
        const response = await fetch(`${API}/api/matches/help-request/${id}`);
        const text = await response.text();

        openModal("Volunteer Match Result", `
            <div class="match-card">
                <h2>🤝 Match Result</h2>
                <p>${text}</p>

                <button class="modal-action" onclick="openHelpRequestList()">
                    Back to Requests
                </button>
            </div>
        `);

    } catch (error) {
        alert("Could not match volunteer.");
    }
}

/* Run when page loads */
setDashboardDate();
loadDashboardData();