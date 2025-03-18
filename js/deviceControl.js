// Device Controller Implementation
class DeviceController {
    constructor() {
        this.devices = {
            light: {
                state: true, // true = on, false = off
                element: null
            },
            thermostat: {
                temperature: 72,
                element: null
            },
            door: {
                locked: true,
                element: null
            }
        };
        
        this.setupEventListeners();
        this.initializeDeviceStates();
    }

    setupEventListeners() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Light toggle
            const lightToggle = document.querySelector('input[type="checkbox"]');
            if (lightToggle) {
                this.devices.light.element = lightToggle;
                lightToggle.addEventListener('change', (e) => {
                    this.toggleLight(e.target.checked);
                });
            }

            // Temperature controls
            const tempButtons = document.querySelectorAll('.device-button:nth-child(2) button');
            if (tempButtons.length === 2) {
                tempButtons[0].addEventListener('click', () => this.adjustTemperature(-1));
                tempButtons[1].addEventListener('click', () => this.adjustTemperature(1));
            }

            // Door lock control
            const doorButton = document.querySelector('.device-button:nth-child(3) button');
            if (doorButton) {
                this.devices.door.element = doorButton;
                doorButton.addEventListener('click', () => this.toggleDoor(!this.devices.door.locked));
            }

            // Emergency button
            const emergencyButton = document.querySelector('.bg-red-600');
            if (emergencyButton) {
                emergencyButton.addEventListener('click', () => this.triggerEmergency());
            }

            // Help tooltip
            const helpButton = document.querySelector('.fixed.bottom-4 button');
            if (helpButton) {
                helpButton.addEventListener('click', () => this.showHelp());
            }
        });
    }

    initializeDeviceStates() {
        // Set initial states for all devices
        this.updateLightDisplay();
        this.updateThermostatDisplay();
        this.updateDoorDisplay();
    }

    // Light Control
    toggleLight(state) {
        this.devices.light.state = state;
        this.updateLightDisplay();
        this.provideFeedback(`Light turned ${state ? 'on' : 'off'}`);
    }

    updateLightDisplay() {
        const lightStatus = document.querySelector('.device-button:first-child p');
        if (lightStatus) {
            lightStatus.textContent = `Currently: ${this.devices.light.state ? 'On' : 'Off'}`;
        }
        if (this.devices.light.element) {
            this.devices.light.element.checked = this.devices.light.state;
        }
    }

    // Thermostat Control
    setTemperature(temp) {
        if (temp >= 60 && temp <= 80) {
            this.devices.thermostat.temperature = temp;
            this.updateThermostatDisplay();
            this.provideFeedback(`Temperature set to ${temp}°F`);
        } else {
            this.provideFeedback("Temperature must be between 60 and 80 degrees");
        }
    }

    adjustTemperature(change) {
        const newTemp = this.devices.thermostat.temperature + change;
        this.setTemperature(newTemp);
    }

    updateThermostatDisplay() {
        const tempStatus = document.querySelector('.device-button:nth-child(2) p');
        if (tempStatus) {
            tempStatus.textContent = `Temperature: ${this.devices.thermostat.temperature}°F`;
        }
    }

    // Door Control
    toggleDoor(unlock) {
        // Add a confirmation for unlocking
        if (unlock && !confirm('Are you sure you want to unlock the door?')) {
            return;
        }

        this.devices.door.locked = !unlock;
        this.updateDoorDisplay();
        this.provideFeedback(`Door ${this.devices.door.locked ? 'locked' : 'unlocked'}`);
    }

    updateDoorDisplay() {
        const doorStatus = document.querySelector('.device-button:nth-child(3) p');
        const doorButton = this.devices.door.element;
        
        if (doorStatus) {
            doorStatus.textContent = `Status: ${this.devices.door.locked ? 'Locked' : 'Unlocked'}`;
        }
        if (doorButton) {
            doorButton.textContent = this.devices.door.locked ? 'Unlock' : 'Lock';
            doorButton.className = this.devices.door.locked ? 
                'bg-green-500 text-white text-xl rounded-lg px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300' :
                'bg-red-500 text-white text-xl rounded-lg px-6 py-3 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300';
        }
    }

    // Emergency Assistance
    triggerEmergency() {
        const confirmed = confirm('This will contact emergency services. Continue?');
        if (confirmed) {
            this.provideFeedback("Emergency services have been notified. Help is on the way.");
            // In a real application, this would trigger an actual emergency call
            document.body.classList.add('emergency-mode');
            setTimeout(() => {
                document.body.classList.remove('emergency-mode');
            }, 5000);
        }
    }

    // Help System
    showHelp() {
        const helpText = `
            Voice Commands:
            • "Turn on/off light"
            • "Set temperature to [60-80]"
            • "Lock/unlock door"
            • "Help" - Show this menu
            • "Emergency" - Call for help

            You can also use the buttons to control devices directly.
            For emergency assistance, press the red button at the bottom.
        `;
        alert(helpText);
    }

    // Feedback System
    provideFeedback(message) {
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.className = 'fixed top-4 right-4 bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        feedback.textContent = message;
        document.body.appendChild(feedback);

        // Remove feedback after 3 seconds
        setTimeout(() => {
            feedback.remove();
        }, 3000);

        // Voice feedback if voice assistant is available
        if (window.voiceAssistant) {
            window.voiceAssistant.speak(message);
        }
    }
}

// Initialize device controller when the page loads
window.deviceController = new DeviceController();
