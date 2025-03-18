const chatContainer = document.getElementById("chat-container");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyDPMLq6MuAKrsfpPqwpEppg5bZlH115vKE";  // Replace with your actual key

// Toggle chatbot visibility
function toggleChat() {
    chatContainer.style.display = chatContainer.style.display === "flex" ? "none" : "flex";
}

// Handle enter key press
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Function to send user input to Gemini API
async function sendMessage() {
    let message = userInput.value.trim();
    if (!message) return;

    // Display user message
    appendMessage("You", message);
    userInput.value = ""; // Clear input

    // Send request to Gemini API
    try {
        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        let data = await response.json();
        
        if (data && data.candidates && data.candidates.length > 0) {
            appendMessage("Chatbot", data.candidates[0].content.parts[0].text.trim());
        } else {
            appendMessage("Chatbot", "Sorry, I couldn't understand that.");
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage("Chatbot", "Sorry, something went wrong.");
    }
}

// Function to append messages to chat
function appendMessage(sender, message) {
    let msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}
