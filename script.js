document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Store the entire conversation history
    const conversation = [];

    /**
     * Appends a new message to the chat box.
     * @param {string} sender - The sender of the message ('user' or 'bot').
     * @param {string} text - The message content.
     * @returns {HTMLElement} The created message element.
     */
    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        // Scroll to the bottom to show the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    }

    /**
     * Handles the form submission to send a message to the backend.
     * @param {Event} event - The form submission event.
     */
    async function handleChatSubmit(event) {
        event.preventDefault();
        const userMessage = userInput.value.trim();

        if (!userMessage) {
            return; // Don't send empty messages
        }

        // 1. Add user's message to the UI and conversation history
        appendMessage('user', userMessage);
        conversation.push({ role: 'user', message: userMessage });
        userInput.value = ''; // Clear the input field

        // 2. Show a temporary "Thinking..." message
        const thinkingMessageElement = appendMessage('bot', 'Thinking...');

        try {
            // 3. Send the conversation to the backend API
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ conversation }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const aiReply = data.data;

            if (data.success && aiReply) {
                // 4. Replace "Thinking..." with the actual AI reply
                thinkingMessageElement.textContent = aiReply;
                // Add the AI's response to the history for future context
                conversation.push({ role: 'model', message: aiReply });
            } else {
                // Handle cases where the response is successful but contains no result
                thinkingMessageElement.textContent = data.message || 'Sorry, no response received.';
            }
        } catch (error) {
            console.error('Failed to get response from server:', error);
            // 5. Show an error message if the fetch fails
            thinkingMessageElement.textContent = 'Failed to get response from server.';
            thinkingMessageElement.style.color = 'red';
        }
    }

    chatForm.addEventListener('submit', handleChatSubmit);
});
