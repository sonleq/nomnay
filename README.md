================================================================================
                              📜 NÔMNAY
                          Nôm Now — Modern
                    Chữ Nôm Translator
================================================================================

Version: 1.0.0
License: MIT
Author: Son Le

================================================================================
                              WHAT IS NÔMNAY?
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
                                 FEATURES
================================================================================

🔍 SMART SEARCH
  - Type any Quốc Ngữ word
  - Instant character matching
  - Partial word support
  - Multi-word search

📚 COMPREHENSIVE DICTIONARY
  - 3,000+ Chữ Nôm entries
  - Curated from trusted sources
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
  - Vietnamese (quốc ngữ) to Vietnamese (chunom)
  - More coming soon!

📱 RESPONSIVE DESIGN
  - Desktop
  - Tablet
  - Mobile

================================================================================
                              QUICK START
================================================================================

THE EASIEST WAY TO RUN:

1. Download or clone this repository
2. Open the folder
3. Double-click index.html

BUT WAIT! If you see a blank page or CORS errors, you need a web server.

========== OPTION 1: XAMPP (Recommended for Beginners) ==========

1. Download XAMPP from https://www.apachefriends.org
2. Copy the "nomnay" folder to C:/xampp/htdocs/
3. Open XAMPP Control Panel → Start Apache
4. Open browser: http://localhost/nomnay/

========== OPTION 2: VS Code Live Server ==========

1. Install "Live Server" extension in VS Code
2. Right-click index.html → "Open with Live Server"

========== OPTION 3: Python HTTP Server ==========

python -m http.server
# Then open: http://localhost:8000

========== OPTION 4: Node.js ==========

npm install -g http-server
http-server -p 8000
# Then open: http://localhost:8000

================================================================================
                              HOW TO USE
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
                          PROJECT STRUCTURE
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
│   ├── screenshots/        # Demo screenshots (optional)
│   └── logo/               # Logo files (optional)
│
├── LICENSE                 # MIT License
└── README.txt              # This file

================================================================================
                          ADDING TO DICTIONARY
================================================================================

TO ADD NEW CHỮ NÔM ENTRIES:

1. Open mapping_chunom.json

2. Add new entries in this format:
   "quốc ngữ phrase": ["chữ nôm character 1", "chữ nôm character 2"]

   Example:
   "anh yêu em": ["英 要 妹"]

3. Save the file and refresh the page

RULES:

- Use UTF-8 encoding
- Keep the JSON format valid
- Use proper Quốc Ngữ spelling
- Use correct Chữ Nôm characters

================================================================================
                              CONTRIBUTING
================================================================================

We welcome contributions from everyone!

HOW TO CONTRIBUTE:

1. 🐛 Report bugs via GitHub Issues
2. 💡 Suggest features via GitHub Issues
3. 📝 Improve documentation
4. 🌍 Add new language support
5. 🔍 Expand the dictionary
6. 🎨 Enhance UI/UX

QUICK GUIDE:

1. Fork the repository
2. Create a feature branch
   git checkout -b feature/amazing-feature
3. Make your changes
4. Commit your changes
   git commit -m 'Add amazing feature'
5. Push to branch
   git push origin feature/amazing-feature
6. Create a Pull Request

================================================================================
                              LICENSE
================================================================================

This project is licensed under the MIT License.
See the LICENSE file for details.

================================================================================
                              CONTACT
================================================================================

📂 GitHub: coming soon!
 
📧 Email: coming soon!

================================================================================
                              ABOUT THE NAME
================================================================================

NômNay = Nôm + Nay

Nôm  = Chữ Nôm (traditional Sino-Vietnamese characters)
Nay  = Now / Modern / Today

Together, NômNay represents the fusion of tradition and modernity —
bringing ancient Chữ Nôm characters into the modern digital age.

================================================================================
                              ACKNOWLEDGMENTS
================================================================================

Special thanks to:

- Chữ Nôm Project for preserving Vietnamese heritage
- All contributors who have helped improve NômNay
- The open source community for tools and inspiration

================================================================================
                              SUPPORT
================================================================================

If you find NômNay helpful, please consider:

⭐ Starring the repository on GitHub
🐦 Sharing it on social media
💬 Mentioning it in your projects
🤝 Contributing to the project

================================================================================
                             END OF README
================================================================================

Made with ❤️ for preserving Vietnamese heritage

Last Updated: January 2024
================================================================================
