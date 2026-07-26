================================================================================
                              📜 NÔMNAY
                          Nôm Now — Modern
                    Chữ Nôm Translator
================================================================================

Version: 1.0.0
License: MIT
Author: Son Le
Website: coming soon...
GitHub: coming soon...

================================================================================
                              TABLE OF CONTENTS
================================================================================

1. What is NômNay?
2. Features
3. Quick Start
4. Requirements
5. Installation
6. How to Use
7. Project Structure
8. Localization (i18n)
9. Contributing
10. License
11. Contact

================================================================================
                            1. WHAT IS NÔMNAY?
================================================================================

NômNay (Nôm + Nay = "Nôm Now") is a web application that translates
Quốc Ngữ (modern Vietnamese script) into Chữ Nôm (traditional
Sino-Vietnamese characters).

Whether you're a student, researcher, historian, or language enthusiast,
NômNay helps you discover the rich heritage of Vietnamese writing with
just a few keystrokes.

* No installation needed
* No internet connection required (after first load)
* 100% free and open source

================================================================================
                                2. FEATURES
================================================================================

🔍 SMART SEARCH
  - Type any Quốc Ngữ word
  - Instant character matching
  - Partial word support
  - Multi-word search capabilities

📚 COMPREHENSIVE DICTIONARY
  - 3,000+ Chữ Nôm entries
  - Curated from trusted sources
  - Regular updates
  - Community contributions welcome

🎨 BEAUTIFUL INTERFACE
  - Modern, clean design
  - Mobile responsive
  - Fast and smooth
  - Multiple view modes (Grid/List)

💾 CHARACTER MANAGEMENT
  - Save characters to your collection
  - Add favorites
  - Export collection as JSON
  - Persistent storage (localStorage)

🌍 MULTI-LANGUAGE SUPPORT
  - Vietnamese (vi)
  - English (en)
  - Chinese (zh)
  - French (fr)
  - More coming soon!

📱 RESPONSIVE DESIGN
  - Desktop
  - Tablet
  - Mobile

================================================================================
                             3. QUICK START
================================================================================

THE EASIEST WAY TO RUN:

1. Download or clone this repository
2. Open the folder
3. Double-click index.html

BUT WAIT! If you see a blank page or CORS errors, you need a web server.

========== OPTION 1: XAMPP (Recommended for Beginners) ==========

1. Download and install XAMPP from https://www.apachefriends.org
2. Copy the "nomnay" folder to C:/xampp/htdocs/
3. Open XAMPP Control Panel
4. Click "Start" for Apache
5. Open your browser and go to:
   http://localhost/nomnay/

========== OPTION 2: VS Code Live Server ==========

1. Install VS Code: https://code.visualstudio.com
2. Install the "Live Server" extension by Ritwick Dey
3. Open the nomnay folder in VS Code
4. Right-click index.html → "Open with Live Server"

========== OPTION 3: Python HTTP Server ==========

# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer

Then open: http://localhost:8000

========== OPTION 4: Node.js ==========

npm install -g http-server
http-server -p 8000

Then open: http://localhost:8000

================================================================================
                             4. REQUIREMENTS
================================================================================

Minimum Requirements:
  - Any modern web browser (Chrome, Firefox, Edge, Safari)
  - Web server (XAMPP, Live Server, Python, Node.js, etc.)

Recommended:
  - Chrome or Firefox
  - XAMPP (for local development)
  - Screen resolution: 1280x720 or higher

No special software, dependencies, or databases needed!

================================================================================
                             5. INSTALLATION
================================================================================

FOR LOCAL USE:

1. Clone the repository:
   git clone https://github.com/yourusername/nomnay.git

2. Move to your web server folder:
   - XAMPP:   C:/xampp/htdocs/nomnay
   - MAMP:    /Applications/MAMP/htdocs/nomnay
   - WAMP:    C:/wamp/www/nomnay
   - LAMP:    /var/www/html/nomnay

3. Start your web server

4. Open browser: http://localhost/nomnay/

FOR PRODUCTION DEPLOYMENT:

1. Upload all files to your web hosting
2. Ensure the mapping_chunom.json file is in the same folder
3. Visit your website URL

================================================================================
                             6. HOW TO USE
================================================================================

SEARCHING:

1. Type a Quốc Ngữ word in the search box
   Examples: "truyện", "hoa", "ai", "trời", "nước"

2. NômNay instantly shows the corresponding Chữ Nôm character

3. Click on the character to add it to your collection

VIEWING:

- Grid View: Shows entries in a card layout
- List View: Shows entries in a list
- All View: Shows all entries in compact form

COLLECTING:

- Click any Chữ Nôm character to add it to "Selected Characters"
- Click on selected characters to remove them
- Use "Clear All" to remove all selected characters

KEYBOARD SHORTCUTS:

- Ctrl+K (Cmd+K on Mac): Focus search bar
- Escape: Clear search bar

================================================================================
                          7. PROJECT STRUCTURE
================================================================================

nomnay/
│
├── index.html              # Main HTML file
├── app.js                  # Application logic
├── style.css               # Styles
├── mapping_chunom.json     # Dictionary data (3,000+ entries)
│
├── locales/                # Localization files
│   ├── en.json             # English
│   ├── vi.json             # Vietnamese
│   ├── zh.json             # Chinese
│   └── fr.json             # French
│
├── assets/                 # Static assets
│   ├── screenshots/        # Demo screenshots
│   └── logo/               # Logo files
│
├── LICENSE                 # License file
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
└── README.txt              # This file

================================================================================
                         8. LOCALIZATION (i18n)
================================================================================

NômNay supports multiple languages for the user interface.

TO ADD A NEW LANGUAGE:

1. Create a new file in the locales/ folder
   Example: locales/ja.json (Japanese)

2. Copy the structure from locales/en.json

3. Translate all values to the target language

4. Add the language code to LOCALES object in app.js

5. The language switcher will automatically show the new option

SUPPORTED LANGUAGES:

  Code  Language        Status
  ----  --------        ------
  en    English         ✅ Complete
  vi    Vietnamese      ✅ Complete
  zh    Chinese         🔜 Planned
  ja    Japanese        🔜 Planned
  ko    Korean          🔜 Planned
 

================================================================================
                            9. CONTRIBUTING
================================================================================

We welcome contributions from everyone!

HOW TO CONTRIBUTE:

1. 🐛 Report bugs via GitHub Issues
2. 💡 Suggest features via GitHub Issues
3. 📝 Improve documentation
4. 🌍 Add new language support
5. 🔍 Expand the dictionary
6. 🎨 Enhance UI/UX
7. 🧪 Write tests

QUICK CONTRIBUTION GUIDE:

1. Fork the repository
2. Create a feature branch
   git checkout -b feature/amazing-feature

3. Make your changes
4. Commit your changes
   git commit -m 'Add amazing feature'

5. Push to branch
   git push origin feature/amazing-feature

6. Create a Pull Request

STYLE GUIDE:

JavaScript:
  - Use ES6+ syntax
  - Use const and let (not var)
  - Use descriptive variable names
  - Add comments for complex logic

CSS:
  - Use BEM naming convention
  - Keep selectors specific
  - Use CSS variables for theming

HTML:
  - Use semantic HTML5 elements
  - Keep accessibility in mind
  - Validate with W3C validator

================================================================================
                            10. LICENSE
================================================================================

This project is licensed under the MIT License.

MIT License

Copyright (c) 2024 Son Le

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

================================================================================
                             11. CONTACT
================================================================================

Project Maintainer: Son Le
Email: your.email@example.com
Twitter: @yourhandle
LinkedIn: yourprofile

Project Links:
  Website:  coming soon...
  GitHub:   coming soon...
  Issues:   coming soon...

================================================================================
                                ACKNOWLEDGMENTS
================================================================================

Special thanks to:

- Chữ Nôm Project for preserving Vietnamese heritage
- All contributors who have helped improve NômNay
- The open source community for tools and inspiration

================================================================================
                               SUPPORT THIS PROJECT
================================================================================

If you find NômNay helpful, please consider:

⭐ Starring the repository on GitHub
🐦 Sharing it on social media
💬 Mentioning it in your projects
🤝 Contributing to the project

================================================================================
                              ABOUT THE NAME
================================================================================

NômNay = Nôm + Nay

Nôm  = Chữ Nôm (traditional Sino-Vietnamese characters)
Nay  = Now/Modern/Today

Together, NômNay represents the fusion of tradition and modernity —
bringing ancient Chữ Nôm characters into the modern digital age.

================================================================================
                                 VERSION HISTORY
================================================================================

v1.0.0 (2024-01-01)
  - Initial release
  - 3,000+ dictionary entries
  - Multi-language support
  - Responsive design

v0.9.0 (2023-12-15)
  - Beta release
  - Basic functionality

================================================================================
                             END OF README
================================================================================

Made with ❤️ for preserving Vietnamese heritage

Last Updated: January 2024
================================================================================
