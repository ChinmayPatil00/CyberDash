# CyberDash

![CyberDash Interface](https://img.shields.io/badge/Status-Active-success) ![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E) ![Web Audio API](https://img.shields.io/badge/Web_Audio-API-blue)

CyberDash is a highly interactive, sci-fi-themed web application that simulates a futuristic command terminal and telemetry dashboard. Built entirely with pure HTML, CSS, and Vanilla JavaScript, it demonstrates advanced front-end engineering techniques including state management, dynamic DOM manipulation, and native audio synthesis.

## 🚀 Features

- **Anomaly Detection Mini-Game**: The Telemetry Dashboard features an interactive radar scanner. Unknown anomalies (blinking red dots) spawn dynamically at random coordinates. Users must click them before they disappear to collect data points.
- **Interactive Command Line Interface (CLI)**: A fully functional terminal located in the Comms Log. Users can type operational commands (e.g., `/status`, `/ping`, `/override`) to retrieve simulated telemetry data and trigger environmental responses.
- **Environmental State Engine**: Physical UI buttons are bound to the page's environment. Engaging features like "Shields" or "Floodlights" dynamically alters the atmospheric lighting and CSS rendering of the entire application.
- **Synthetic Audio Generation**: All sound effects (beeps, clicks, sirens, clunks) are generated dynamically in real-time using the native browser **Web Audio API** oscillators—no external sound files required.
- **Tactile Neumorphism**: The user interface relies heavily on advanced CSS Neumorphism, utilizing layered 3D shadowing to provide highly responsive tactile feedback.
- **Fully Mobile Responsive**: CSS Media Queries ensure that the complex side-by-side dashboard layout stacks perfectly on mobile devices.

## 🛠️ Tech Stack

- **HTML5**: Semantic layout and structure.
- **CSS3**: Variables, Flexbox, Media Queries, CSS Animations, Neumorphism (`box-shadow`), and Glassmorphism (`backdrop-filter`).
- **Vanilla JavaScript (ES6)**: DOM manipulation, event listeners, intervals/timeouts, and CLI parsing.
- **Web Audio API**: Real-time programmatic sound synthesis.

## 🖥️ How to Run

Since CyberDash is built with vanilla web technologies, there is no build step or package installation required.

1. Clone the repository:
   ```bash
   git clone https://github.com/ChinmayPatil00/CyberDash.git
   ```
2. Open the project folder.
3. Simply double-click `index.html` to open it in any modern web browser.

## 🎨 Design Philosophy

CyberDash was built to break away from traditional "flat" web design. By combining the physical, pressed-button feel of Neumorphism with the futuristic transparency of Glassmorphism, the interface feels like an actual piece of hardware. This is further enhanced by the immediate auditory feedback from the Web Audio API, creating an immersive, sensory-rich user experience.
