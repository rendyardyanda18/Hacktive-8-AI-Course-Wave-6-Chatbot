const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', message: userMessage });
  input.value = '';

  // Show a thinking indicator
  const thinkingMsg = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const botReply = data.data;

    // Update the thinking message with the actual reply
    thinkingMsg.textContent = botReply;
    conversation.push({ role: 'model', message: botReply });
  } catch (error) {
    console.error('Error:', error);
    thinkingMsg.textContent = 'Sorry, something went wrong. Please try again.';
    thinkingMsg.style.backgroundColor = '#f8d7da'; // Error color
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the message element
}
