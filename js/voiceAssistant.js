// Voice Assistant Implementation
class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.setupSpeechRecognition();
        this.setupEventListeners();
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateButtonState(true);
                this.speak("I'm listening. How can I help?");
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateButtonState(false);
            };

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.speak("I'm sorry, I couldn't understand that. Please try again.");
                this.isListening = false;
                this.updateButtonState(false);
            };
        } else {
            console.error('Speech recognition not supported');
            alert('Speech recognition is not supported in your browser. Please use Chrome for the best experience.');
        }
    }

    setupEventListeners() {
        const voiceButton = document.getElementById('voiceAssistBtn');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleListening());
        }
    }

    toggleListening() {
        if (!this.isListening) {
            this.recognition.start();
        } else {
            this.recognition.stop();
        }
    }

    updateButtonState(isListening) {
        const button = document.getElementById('voiceAssistBtn');
        if (button) {
            if (isListening) {
                button.classList.add('bg-red-600');
                button.classList.remove('bg-blue-600');
                button.innerHTML = '<i class="fas fa-microphone-slash mr-2"></i>Listening...';
            } else {
                button.classList.remove('bg-red-600');
                button.classList.add('bg-blue-600');
                button.innerHTML = '<i class="fas fa-microphone mr-2"></i>Voice Assistant';
            }
        }
    }

    processCommand(command) {
        console.log('Processing command:', command);
        
        // Command patterns
        const patterns = {
            light: /(turn|switch) (on|off) (the )?(living room )?light/i,
            temperature: /set (the )?temperature to (\d+)/i,
            door: /(lock|unlock) (the )?door/i,
            help: /(help|assist|support)/i,
            emergency: /(emergency|help me|sos)/i
        };

        // Process different commands
        if (patterns.light.test(command)) {
            const state = command.includes('on') ? 'on' : 'off';
            this.speak(`Turning ${state} the living room light`);
            window.deviceController.toggleLight(state === 'on');
        }
        else if (patterns.temperature.test(command)) {
            const match = command.match(/(\d+)/);
            if (match) {
                const temp = match[1];
                this.speak(`Setting temperature to ${temp} degrees`);
                window.deviceController.setTemperature(parseInt(temp));
            }
        }
        else if (patterns.door.test(command)) {
            const action = command.includes('lock') ? 'lock' : 'unlock';
            this.speak(`${action}ing the door`);
            window.deviceController.toggleDoor(action === 'unlock');
        }
        else if (patterns.help.test(command)) {
            this.speak("You can control the lights by saying 'turn on lights' or 'turn off lights'. " +
                      "Control the temperature by saying 'set temperature to 72'. " +
                      "Control the door by saying 'lock door' or 'unlock door'.");
        }
        else if (patterns.emergency.test(command)) {
            this.speak("Calling emergency assistance now");
            window.deviceController.triggerEmergency();
        }
        else {
            this.speak("I'm sorry, I didn't understand that command. Please try again or say 'help' for assistance.");
        }
    }

    speak(message) {
        // Use Speech Synthesis to provide audio feedback
        const speech = new SpeechSynthesisUtterance(message);
        speech.volume = 1;
        speech.rate = 0.9; // Slightly slower for better comprehension
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }
}

// Initialize voice assistant when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new VoiceAssistant();
});
