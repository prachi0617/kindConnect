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

/* =================== AI CHAT ===================== */

function openAIChat() {
    openModal("Kindly AI Assistant", `
        <div class="ai-chat-wrapper">
            <div class="ai-chat-header">
                
            </div>

            <div class="ai-conversation" id="aiChatBox">
                
                    <strong>Kindly AI Assistant:</strong><br>
                    Hi! I am your Kindly assistant! How can I help you today?
               
            </div>

            
            <div class="ai-input-row">
                <textarea 
                    id="aiMessageInput" 
                    placeholder="Type your message here..."
                    onkeydown="handleAIEnter(event)"
                ></textarea>

                <button onclick="sendAIMessage()">Send</button>
            </div>
        </div>
    `);

    setTimeout(() => {
        const input = document.getElementById("aiMessageInput");
        if (input) {
            input.focus();
        }
    }, 100);
}


function quickAIMessage(message) {
    const input = document.getElementById("aiMessageInput");
    if (input) {
        input.value = message;
        sendAIMessage();
    }
}

function handleAIEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendAIMessage();
    }
}

function sendAIMessage() {
    const input = document.getElementById("aiMessageInput");
    const chatBox = document.getElementById("aiChatBox");

    if (!input || !chatBox) return;

    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Show user message
    chatBox.innerHTML += `
        <div class="user-message">
            <strong>You:</strong> ${userMessage}
        </div>
    `;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Small delay to feel natural
    setTimeout(() => {
        const aiResponse = getDemoAIResponse(userMessage);

        chatBox.innerHTML += `
            <div class="ai-message">
                <strong>Kindly AI:</strong> ${aiResponse.reply}
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}


/* ---------- Local AI Responses ---------- */

function getDemoAIResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return {
            reply: "Hi there! I'm your Kindly assistant 💙 I can help with reminders, mood check-ins, food resources, rides, and volunteer support. What do you need today?"
        };
    }

    if (text.includes("sad") || text.includes("lonely") || text.includes("depressed") || text.includes("alone")) {
        return {
            reply: "I'm sorry you're feeling this way 💙 You are not alone. You can do a mood check-in, listen to calming music, or request a friendly call from a volunteer. We are here for you!"
        };
    }

    if (text.includes("medicine") || text.includes("medication") || text.includes("pill") || text.includes("drug")) {
        return {
            reply: "I can help with medicine reminders! 💊 Click on Daily Reminders, choose Medicine, add the date and time, and it will show up on your dashboard automatically."
        };
    }

    if (text.includes("appointment") || text.includes("doctor") || text.includes("clinic") || text.includes("hospital")) {
        return {
            reply: "I can help with appointment reminders! 🏥 Go to Daily Reminders and add your appointment date and time. Your dashboard will show it as Pending, Upcoming, or Completed."
        };
    }

    if (text.includes("food") || text.includes("grocery") || text.includes("hungry") || text.includes("eat") || text.includes("meal")) {
        return {
            reply: "I can help you find food support! 🍏 Open Community Resources and choose Food. You can also request Grocery Help from a volunteer near you."
        };
    }

    if (text.includes("ride") || text.includes("transportation") || text.includes("drive") || text.includes("car") || text.includes("travel")) {
        return {
            reply: "For transportation support 🚗 open Community Resources and choose Rides. You can also submit a Ride Help request and a volunteer will assist you."
        };
    }

    if (text.includes("volunteer")) {
        return {
            reply: "That's wonderful 💜 Click Become a Volunteer and choose how you'd like to help — options include Friendly Call, Grocery Help, Ride Help, or Tech Help. Thank you for giving back!"
        };
    }

    if (text.includes("tech") || text.includes("computer") || text.includes("laptop") || text.includes("phone") || text.includes("internet")) {
        return {
            reply: "For tech support 💻 open Community Resources and choose Tech Help. You can also request help from a volunteer who will guide you step by step."
        };
    }

    if (text.includes("reminder") || text.includes("task") || text.includes("schedule") || text.includes("alarm")) {
        return {
            reply: "You can add a reminder from Daily Reminders! ⏰ After saving it, your dashboard will show the task with its time and status (Pending, Upcoming, or Completed)."
        };
    }

    if (text.includes("thank") || text.includes("thanks") || text.includes("thank you")) {
        return {
            reply: "You're so welcome! 😊 I'm always here whenever you need help. Take care and have a wonderful day! 💙"
        };
    }

    if (text.includes("help") || text.includes("what can you do") || text.includes("how")) {
        return {
            reply: "I'm here to help you with many things! 💙 Here's what I can do:<br><br>💊 Medicine reminders<br>📅 Appointment reminders<br>🍏 Food resources<br>🚗 Ride help<br>💜 Mood check-ins<br>💻 Tech support<br>🤝 Volunteer requests<br><br>Just tell me what you need!"
        };
    }

    if (text.includes("bye") || text.includes("goodbye") || text.includes("see you")) {
        return {
            reply: "Goodbye! 👋 Take care of yourself and don't hesitate to come back anytime you need help. We're always here for you 💙"
        };
    }

    return {
        reply: "I'm your Kindly assistant 💙 I can help with reminders, mood check-ins, food resources, rides, tech support, and volunteer requests. Could you tell me a little more about what you need?"
    };
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


/* ===================== Dashboards ===================== */

function isReminderCompleted(reminder) {
    return reminder.completed === true || reminder.completed === "true";
}

function getReminderStatus(reminder) {
    if (isReminderCompleted(reminder)) {
        return "Completed";
    }

    if (!reminder.date || !reminder.time) {
        return "Pending";
    }

    const now = new Date();
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);

    if (reminderDateTime > now) {
        return "Upcoming";
    }

    return "Pending";
}

function getStatusClass(status) {
    if (status === "Completed") {
        return "completed-badge";
    }

    if (status === "Upcoming") {
        return "upcoming-badge";
    }

    return "pending-badge";
}

function formatReminderTime(time) {
    if (!time) {
        return "--";
    }

    const parts = time.split(":");
    let hour = Number(parts[0]);
    const minute = parts[1];

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minute} ${ampm}`;
}

function getReminderIcon(type) {
    if (!type) {
        return "🔔";
    }

    const cleanType = type.toLowerCase();

    if (cleanType.includes("medicine")) {
        return "💊";
    }

    if (cleanType.includes("water")) {
        return "💧";
    }

    if (cleanType.includes("appointment")) {
        return "📅";
    }

    if (cleanType.includes("bill")) {
        return "💵";
    }

    if (cleanType.includes("self")) {
        return "💜";
    }

    return "🔔";
}

function escapeText(text) {
    if (!text) {
        return "";
    }

    return text.replace(/'/g, "\\'");
}

function buildReminderRow(reminder, completed) {
    const icon = getReminderIcon(reminder.type);
    const timeText = formatReminderTime(reminder.time);
    const status = completed ? "Completed" : getReminderStatus(reminder);
    const statusClass = getStatusClass(status);

    if (completed) {
        return `
            <div class="task-row task-row-completed">
                <div class="task-icon completed-icon">✅</div>

                <div>
                    <strong>${reminder.title}</strong><br>
                    <small>${reminder.type || "Reminder"}</small>
                </div>

                <span class="task-time">${timeText}</span>

                <span class="status-badge ${statusClass}">
                    Completed
                </span>
            </div>
        `;
    }

    return `
        <div class="task-row clickable-task" onclick="confirmCompleteReminder(${reminder.id}, '${escapeText(reminder.title)}')">
            <div class="task-icon">${icon}</div>

            <div>
                <strong>${reminder.title}</strong><br>
                <small>${reminder.type || "Reminder"}</small>
            </div>

            <span class="task-time">${timeText}</span>

            <span class="status-badge ${statusClass}">
                ${status}
            </span>
        </div>
    `;
}

async function loadDashboardData() {
    const dashboardTasks = document.getElementById("dashboardTasks");
    dashboardTasks.innerHTML = "<p>Loading reminders...</p>";

    try {
        const response = await fetch(`${API}/api/reminders`);
        const reminders = await response.json();

        if (!reminders || reminders.length === 0) {
            dashboardTasks.innerHTML = `
                <div class="task-row">
                    <div class="task-icon">📭</div>
                    <div>
                        <strong>No tasks yet</strong><br>
                        <small>Add a reminder to see it here.</small>
                    </div>
                    <span class="task-time">--</span>
                    <span class="status-badge pending-badge">Pending</span>
                </div>
            `;
            return;
        }

        // Order: Pending first, then Upcoming, then Completed
        const pendingTasks = reminders.filter(reminder =>
            !isReminderCompleted(reminder) && getReminderStatus(reminder) === "Pending"
        );

        const upcomingTasks = reminders.filter(reminder =>
            !isReminderCompleted(reminder) && getReminderStatus(reminder) === "Upcoming"
        );

        const completedTasks = reminders.filter(reminder => isReminderCompleted(reminder));

        let html = "";

        pendingTasks.forEach(reminder => {
            html += buildReminderRow(reminder, false);
        });

        upcomingTasks.forEach(reminder => {
            html += buildReminderRow(reminder, false);
        });

        completedTasks.forEach(reminder => {
            html += buildReminderRow(reminder, true);
        });

        dashboardTasks.innerHTML = html;

    } catch (error) {
        dashboardTasks.innerHTML = "<p>Backend is not running.</p>";
    }
}

function confirmCompleteReminder(id, title) {
    openModal("Complete Task", `
        <div class="info-card">
            <h3>✅ Did you complete this task?</h3>
            <p><strong>${title}</strong></p>
            <p>Tap complete if you finished it.</p>

            <button class="modal-action" onclick="completeReminderFromDashboard(${id})">
                Yes, Complete Task
            </button>

            <button class="modal-action" onclick="closeModal()">
                Cancel
            </button>
        </div>
    `);
}

async function completeReminderFromDashboard(id) {
    try {
        await fetch(`${API}/api/reminders/${id}/complete`, {
            method: "PUT"
        });

        closeModal();

        setTimeout(() => {
            loadDashboardData();
        }, 300);

    } catch (error) {
        alert("Could not complete task. Make sure backend is running.");
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
function openVolunteerSupport() {
    openModal("Volunteer Support", `
        <div class="info-card">
            <h3>🙌 Become a Volunteer</h3>
            <p>Sign up to help with friendly calls, groceries, rides, or tech help.</p>
        </div>

        <div class="form-group">
            <label>Name</label>
            <input id="volunteerName" placeholder="Your name">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input id="volunteerEmail" placeholder="email@example.com">
        </div>

        <div class="form-group">
            <label>Phone</label>
            <input id="volunteerPhone" placeholder="302-000-1111">
        </div>

        <div class="form-group">
            <label>Help Type</label>
            <select id="volunteerSkill">
                <option>Friendly Call</option>
                <option>Grocery Help</option>
                <option>Ride Help</option>
                <option>Tech Help</option>
            </select>
        </div>

        <div class="form-group">
            <label>Available Day</label>
            <select id="volunteerAvailableDay">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Weekend</option>
                <option>Any Day</option>
            </select>
        </div>

        <div class="form-group">
            <label>Available Time</label>
            <select id="volunteerAvailableTime">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Any Time</option>
            </select>
        </div>

        <div class="form-group">
            <label>Short Message</label>
            <textarea id="volunteerNote" placeholder="Example: I can make friendly calls on weekends."></textarea>
        </div>

        <button class="modal-action" onclick="saveVolunteerSupport()">Save Volunteer</button>
        <button class="modal-action" onclick="openVolunteerSupportList()">View Volunteers</button>

        <div id="volunteerResult" class="result-box"></div>
    `);
}

async function saveVolunteerSupport() {
    const volunteer = {
        name: document.getElementById("volunteerName").value,
        email: document.getElementById("volunteerEmail").value,
        phone: document.getElementById("volunteerPhone").value,
        skill: document.getElementById("volunteerSkill").value,
        availableDay: document.getElementById("volunteerAvailableDay").value,
        availableTime: document.getElementById("volunteerAvailableTime").value,
        note: document.getElementById("volunteerNote").value,
        active: true
    };

    try {
        const response = await fetch(`${API}/api/volunteers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(volunteer)
        });

        const data = await response.json();

        document.getElementById("volunteerResult").innerHTML = `
            <div class="success-box">
                ✅ Volunteer saved successfully.<br>
                Name: ${data.name}<br>
                Skill: ${data.skill}<br>
                Available: ${data.availableDay || "Any Day"} at ${data.availableTime || "Any Time"}
            </div>
        `;

    } catch (error) {
        document.getElementById("volunteerResult").innerText =
            "Could not save volunteer. Make sure backend is running.";
    }
}

async function openVolunteerSupportList() {
    openModal("Volunteer List", "<p>Loading volunteers...</p>");

    try {
        const response = await fetch(`${API}/api/volunteers`);
        const volunteers = await response.json();

        let html = "";

        volunteers.forEach(volunteer => {
            html += `
                <div class="info-card">
                    <h3>🙌 ${volunteer.name}</h3>
                    <p><strong>Email:</strong> ${volunteer.email}</p>
                    <p><strong>Phone:</strong> ${volunteer.phone || "Not provided"}</p>
                    <p><strong>Help Type:</strong> ${volunteer.skill}</p>
                    <p><strong>Available:</strong> ${volunteer.availableDay || "Any Day"} at ${volunteer.availableTime || "Any Time"}</p>
                    <p><strong>Note:</strong> ${volunteer.note || "No note"}</p>
                </div>
            `;
        });

        document.getElementById("modalBody").innerHTML =
            html || "<p>No volunteers yet.</p>";

    } catch (error) {
        document.getElementById("modalBody").innerHTML =
            "<p>Could not load volunteers. Make sure backend is running.</p>";
    }
}

/* Run when page loads */
setDashboardDate();
loadDashboardData();

setInterval(() => {
    setDashboardDate();
}, 1000);