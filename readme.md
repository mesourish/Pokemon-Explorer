Pokémon Explorer ⚪🔴
Welcome to Pokémon Explorer, a web application that lets you dive into the world of Pokémon! Built with HTML, CSS, and JavaScript, this app fetches data from the PokéAPI and presents it in a vibrant, Pokémon-themed interface. Featuring a nostalgic startup animation, infinite scroll, search with autocomplete, and detailed Pokémon info, it’s perfect for trainers of all levels! 🌟
 (Placeholder: Add a screenshot to the screenshots/ folder)
Features


Search & Autocomplete 🔍: Type to find Pokémon with real-time suggestions, styled in the Pokémon font (Press Start 2P).
Infinite Scroll 📜: Seamlessly load more Pokémon as you scroll, with a Pokéball spinner for loading.
Detailed Modal ℹ️: Click a Pokémon card to view stats (height, weight, types, abilities, habitat, description) in a sleek glassmorphic modal.
Mega Pokémon Support 💪: Correctly handles Mega Evolutions (e.g., "alakazam-mega") for accurate species data.
Offline Caching 💾: Uses IndexedDB to cache API responses, ensuring fast loads and offline browsing (data persists until manually cleared).
Responsive Design 📱: Grid layout adapts to mobile, tablet, and desktop (1–4 columns).
Pokémon Aesthetic 🎮: Features Press Start 2P font, type-based gradients, Pokéball motifs, and a radial background.

Tech Stack

HTML5: Single-page structure with semantic elements.
CSS3: Embedded Tailwind CSS (subset) with custom animations and glassmorphism.
JavaScript: Vanilla JS for API calls, DOM manipulation, and interactivity.
PokéAPI: Powers Pokémon data (list, details, species).
IndexedDB: Client-side caching for performance.
Google Fonts: Press Start 2P for Pokémon-style text.

Getting Started
Follow these steps to catch 'em all locally! 🏃‍♂️
Prerequisites

A modern web browser (Chrome, Firefox, Edge, etc.).
A local server (e.g., Python’s http.server or Node.js live-server) to serve the app.
[Optional] Git installed to clone the repo.

Installation

Clone the Repository:
git clone https://github.com/mesourish/Pokemon-Explorer.git
cd Pokemon-Explorer


Serve the Application:Use a local server to avoid CORS issues with file:// URLs.

Python:python -m http.server 8000


Node.js (with live-server):npm install -g live-server
live-server


Open your browser to http://localhost:8000.


Add Sound Effects (Optional):

The startup animation is designed to include Pokémon sound effects (Pokéball open, Pikachu cry).
Source legal sound files (e.g., .mp3 or .wav) from public-domain sites like Freesound.
Place them in a sounds/ folder (e.g., sounds/pokeball-open.mp3, sounds/pikachu-cry.mp3).
Update script.js to load and play sounds (see playAnimation function).



Project Structure
pokemon-explorer/
├── index.html       # Main HTML with structure and embedded CSS
├── script.js        # JavaScript for API calls, animation, and interactivity
├── screenshots/     # [Optional] Add screenshots for README
├── sounds/          # [Optional] Add sound files for animation
└── README.md        # This file

Usage

Launch the App:

Open http://localhost:8000 in your browser.
On first load (or after a hard reload), enjoy the 5-second Pokémon startup animation:
Pokéball spins and glows (0–2s).
Pokéball opens with a flash and sparkles (2–3s).
Pikachu silhouette appears with its cry (3–4s).
"Pokémon!" text fades in (4–5s).


The animation plays once per session (stored in sessionStorage).


Explore Pokémon:

Search: Type in the search bar (e.g., "pikachu") for instant filtering and autocomplete suggestions.
Browse: Scroll to load more Pokémon (20 at a time) with a Pokéball spinner.
View Details: Click a Pokémon card to open a modal with stats and flavor text.
Test Mega Pokémon: Search "alakazam-mega" to verify correct species data.


Hard Reload:

To replay the animation, perform a hard reload (Ctrl+Shift+R or Cmd+Shift+R).
This clears the browser cache but retains sessionStorage unless manually cleared.



Screenshots
(Placeholder: Add screenshots to screenshots/ and update the links below)

Startup Animation: screenshots/animation.png
Main Page: screenshots/main-page.png
Search with Autocomplete: screenshots/search.png
Pokémon Details Modal: screenshots/details.png

To add screenshots:

Take screenshots of the app in action.
Save them in the screenshots/ folder.
Update the image paths in this README.

Contributing
We’d love for you to join our Pokémon adventure! 🕹️ Here’s how to contribute:

Fork the Repository:Click the "Fork" button on GitHub to create your own copy.

Create a Branch:
git checkout -b feature/your-feature-name


Make Changes:

Add features (e.g., new animations, sound effects, or Pokémon filters).
Fix bugs or improve performance.
Ensure code follows the existing style (vanilla JS, Tailwind CSS).


Test Locally:

Verify the app runs without errors.
Test the startup animation and core features.


Commit and Push:
git commit -m "Add your feature or fix"
git push origin feature/your-feature-name


Open a Pull Request:

Go to the original repo and create a PR.
Describe your changes and why they’re awesome!



Please follow the Code of Conduct (Placeholder: Add a Code of Conduct file if needed).
License
This project is licensed under the MIT License. Feel free to use, modify, and share it! 📜
Acknowledgments

PokéAPI: For providing a fantastic free API for Pokémon data.
Google Fonts: For the Press Start 2P font that captures the Pokémon vibe.
Pokémon Community: For inspiring this project with their love for the franchise.

Contact
Got questions or ideas? Open an issue on GitHub or reach out to your-username. Let’s make this Pokémon Explorer the very best, like no one ever was! 🎵
⚪🔴 Gotta catch 'em all! ⚪🔴
