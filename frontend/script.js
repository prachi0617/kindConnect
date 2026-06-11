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

    document.getElementById("dashboardGreeting").innerText = greeting;
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        const data = await response.json();

        document.getElementById("messageResult").innerText =
            "Message saved successfully:\n" + JSON.stringify(data, null, 2);

    } catch (error) {
        document.getElementById("messageResult").innerText =
            "Could not save message. Make sure backend is running.";
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
        headers: {
            "Content-Type": "application/json"
        },
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

async function openResourceCategory(category) {
    openModal(category + " Resources", `<p>Loading...</p>`);

    try {
        const response = await fetch(`${API}/api/resources`);
        const resources = await response.json();

        const filtered = resources.filter(r =>
            r.category && r.category.toLowerCase() === category.toLowerCase()
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

async function openResourceCategory(category) {
    openModal(category + " Resources", `<p>Loading...</p>`);

    try {
        const response = await fetch(`${API}/api/resources`);
        const resources = await response.json();

        const filtered = resources.filter(r =>
            r.category && r.category.toLowerCase() === category.toLowerCase()
        );

        let html = `
            <div class="info-card">
               <h3> ${category} resources found</h3>
                <p>Scroll inside this popup to view all resources.</p>
            </div>
        `;

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
            filtered.length > 0 ? html : `<p>No ${category} resources found.</p>`;
    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Could not load resources.</p>";
    }

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

/* ===================== REMINDERS ===================== */
d
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

/* ===================== Dashboard ===================== */

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
                let icon = "✅";

                html += `
                    <div class="task-row task-row-completed">
                        <div class="task-icon completed-icon">${icon}</div>

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
                <option>Happy</option>
                <option>Sad</option>
                <option>Lonely</option>
                <option>Stressed</option>
                <option>Tired</option>
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
    const mood = {
        userId: Number(document.getElementById("moodUserId").value),
        mood: document.getElementById("moodValue").value,
        note: document.getElementById("moodNote").value,
        date: document.getElementById("moodDate").value
    };

    try {
        const response = await fetch(`${API}/api/moods`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mood)
        });

        const data = await response.json();
        document.getElementById("moodResult").innerText =
            "Saved:\n" + JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("moodResult").innerText = "Backend is not running.";
    }
}

async function openMoodList() {
    openModal("Mood History", "<p>Loading moods...</p>");

    try {
        const response = await fetch(`${API}/api/moods`);
        const moods = await response.json();

        let html = "";
        moods.forEach(mood => {
            html += `
                <div class="info-card">
                    <h3>${mood.mood}</h3>
                    <p><strong>Note:</strong> ${mood.note}</p>
                    <p><strong>Date:</strong> ${mood.date}</p>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML = html || "<p>No mood check-ins yet.</p>";
    } catch (error) {
        document.getElementById("modalBody").innerHTML = "<p>Backend is not running.</p>";
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
                <option ${type === "Grocery Help" ? "selected" : ""}>Grocery Help</option>
                <option ${type === "Ride Help" ? "selected" : ""}>Ride Help</option>
                <option ${type === "Tech Help" ? "selected" : ""}>Tech Help</option>
                <option ${type === "Friendly Call" ? "selected" : ""}>Friendly Call</option>
                <option ${type === "General Help" ? "selected" : ""}>General Help</option>
            </select>
        </div>

        <div class="form-group">
            <label>Message</label>
            <textarea id="helpMessage" placeholder="What help do you need?"></textarea>
        </div>

        <button class="modal-action" onclick="saveHelpRequest()">Submit Help Request</button>
        <div id="helpResult" class="result-box"></div>
    `);
}

async function saveHelpRequest() {
    const request = {
        userId: Number(document.getElementById("helpUserId").value),
        requestType: document.getElementById("helpType").value,
        message: document.getElementById("helpMessage").value
    };

    try {
        const response = await fetch(`${API}/api/help-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        document.getElementById("helpResult").innerText =
            "Saved:\n" + JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("helpResult").innerText =
            "Help request backend is not added yet, but this frontend is ready.";
    }
}

function openVolunteerForm() {
    openModal("Become a Volunteer", `
        <div class="form-group">
            <label>Name</label>
            <input id="volunteerName" placeholder="Your name">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input id="volunteerEmail" placeholder="email@example.com">
        </div>

        <div class="form-group">
            <label>Skill</label>
            <select id="volunteerSkill">
                <option>Grocery Help</option>
                <option>Ride Help</option>
                <option>Tech Help</option>
                <option>Friendly Call</option>
            </select>
        </div>

        <div class="form-group">
            <label>Availability</label>
            <input id="volunteerAvailability" placeholder="Weekends, evenings, etc.">
        </div>

        <button class="modal-action" onclick="saveVolunteer()">Save Volunteer</button>
        <div id="volunteerResult" class="result-box"></div>
    `);
}

async function saveVolunteer() {
    const volunteer = {
        name: document.getElementById("volunteerName").value,
        email: document.getElementById("volunteerEmail").value,
        skill: document.getElementById("volunteerSkill").value,
        availability: document.getElementById("volunteerAvailability").value
    };

    try {
        const response = await fetch(`${API}/api/volunteers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(volunteer)
        });

        const data = await response.json();
        document.getElementById("volunteerResult").innerText =
            "Saved:\n" + JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("volunteerResult").innerText =
            "Volunteer backend is not added yet, but this frontend is ready.";
    }
}

/* Run when page loads */
setDashboardDate();
loadDashboardData();