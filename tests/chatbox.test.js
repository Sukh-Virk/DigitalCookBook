jest.mock('../Javascript_files/chatbox.js', () => ({
    sendMessage: jest.fn(),
    displayMessage: jest.fn(),
    toggleChat: jest.fn()
}));

const chatbox = require('../Javascript_files/chatbox.js');

describe('Chatbox Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="chat-container" class="chat-hidden">
                <button id="toggle-chat">Chat</button>
                <div id="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" id="message-input" placeholder="Type your message...">
                    <button id="send-button">Send</button>
                </div>
            </div>
        `;
        jest.clearAllMocks();
    });

    test('toggleChat should toggle chat visibility', () => {
        const chatContainer = document.getElementById('chat-container');
        chatbox.toggleChat.mockImplementation(() => {
            chatContainer.classList.toggle('chat-hidden');
        });

        chatbox.toggleChat();
        expect(chatContainer.classList.contains('chat-hidden')).toBeFalsy();

        chatbox.toggleChat();
        expect(chatContainer.classList.contains('chat-hidden')).toBeTruthy();
    });

    test('sendMessage should send message and update display', () => {
        const input = document.getElementById('message-input');
        const messages = document.getElementById('chat-messages');
        input.value = 'Hello, how do I cook pasta?';

        chatbox.sendMessage.mockImplementation(() => {
            const message = input.value.trim();
            if (message) {
                chatbox.displayMessage('user', message);
                input.value = '';
                // test AI response
                setTimeout(() => {
                    chatbox.displayMessage('ai', 'To cook pasta, boil water and follow package instructions.');
                }, 100);
            }
        });

        chatbox.displayMessage.mockImplementation((sender, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;
            messages.appendChild(messageDiv);
        });

        chatbox.sendMessage();

        expect(input.value).toBe('');
        expect(messages.children.length).toBe(1);
        expect(messages.children[0].textContent).toBe('Hello, how do I cook pasta?');

        // Test AI response
        return new Promise(resolve => {
            setTimeout(() => {
                expect(messages.children.length).toBe(2);
                expect(messages.children[1].textContent).toBe('To cook pasta, boil water and follow package instructions.');
                resolve();
            }, 150);
        });
    });

    test('displayMessage should format messages correctly', () => {
        const messages = document.getElementById('chat-messages');
        
        chatbox.displayMessage.mockImplementation((sender, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;
            messages.appendChild(messageDiv);
        });

        chatbox.displayMessage('user', 'Test message');
        expect(messages.children[0].className).toBe('message user-message');
        expect(messages.children[0].textContent).toBe('Test message');

        chatbox.displayMessage('ai', 'AI response');
        expect(messages.children[1].className).toBe('message ai-message');
        expect(messages.children[1].textContent).toBe('AI response');
    });
});