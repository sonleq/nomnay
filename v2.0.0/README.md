================================================================================ 📜 NÔMNAY Nôm Now — Modern Chữ Nôm Translator
Version: 1.0.0 License: MIT Author: Son Le

================================================================================ WHAT IS NÔMNAY?
Nôm Nay — Modern Chữ Nôm Translator
Version: 2.0.0
License: MIT
Author: Son Le

================================================================================
WHAT IS NÔM NAY?

NômNay (Nôm + Nay = "Nôm Now") is a web application that translates Quốc Ngữ 
(modern Vietnamese script) into Chữ Nôm (traditional Sino-Vietnamese characters).

Whether you're a student, researcher, historian, or language enthusiast, 
NômNay helps you discover the rich heritage of Vietnamese writing with just 
a few keystrokes.

✓ No installation needed
✓ No internet connection required (after first load)
✓ 100% free and open source

================================================================================
FEATURES

🔍 SMART SEARCH
  • Type any Quốc Ngữ word
  • Instant character matching
  • Partial word support
  • Multi-word search

📚 COMPREHENSIVE DICTIONARY
  • 3,000+ Chữ Nôm entries
  • Curated from trusted sources
  • Community contributions welcome

🎨 BEAUTIFUL INTERFACE
  • Modern, clean design
  • Mobile responsive
  • Fast and smooth
  • Multiple view modes (Grid/List)
  • Two display layouts: Modern & Traditional

📐 TWO DISPLAY MODES
  • Modern: Left to right, horizontal layout
  • Traditional: Right to left, vertical columns (top to bottom)
  • Toggle between modes with one click
  • Preserves traditional East Asian writing format

🎨 FONT CONTROLS
  • Font Size Slider (1rem - 6rem)
  • Font Weight Options (Light, Medium, Bold)
  • Real-time preview
  • Perfect for printing or screen viewing

💾 CHARACTER MANAGEMENT
  • Save characters to your collection
  • Add favorites
  • Export collection as JSON
  • Persistent storage (localStorage)
  • Duplicate characters allowed
  • Column break support

📤 EXPORT OPTIONS
  • PDF (Print) - Best for printing & Adobe Illustrator
  • Word (.doc) - Microsoft Word, Google Docs
  • Word (.docx) - Modern Word format
  • HTML - Web viewing
  • Plain Text (.txt) - Simple text editing

🌍 MULTI-LANGUAGE SUPPORT
  • Vietnamese (quốc ngữ) to Vietnamese (chunom)
  • More coming soon!

📱 RESPONSIVE DESIGN
  • Desktop
  • Tablet
  • Mobile

================================================================================
QUICK START

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

Then open: http://localhost:8000

========== OPTION 4: Node.js ==========

npm install -g http-server
http-server -p 8000

Then open: http://localhost:8000

================================================================================
HOW TO USE

SEARCHING:
  • Type a Quốc Ngữ word in the search box
  • Examples: "truyện", "hoa", "ai", "trời", "nước"
  • NômNay instantly shows the corresponding Chữ Nôm character
  • Click on the character to add it to your collection

VIEWING:
  • Grid View: Shows entries in a card layout
  • List View: Shows entries in a list
  • All View: Shows all entries in compact form

DISPLAY MODES:
  • Modern: Left to right, horizontal layout
  • Traditional: Right to left, vertical columns
  • Click the toggle switch to switch between modes

FONT CONTROLS:
  • Font Size: Drag the slider to adjust size (1rem - 6rem)
  • Font Weight: Click Light, Medium, or Bold
  • Changes apply in real-time to your selected characters

COLLECTING:
  • Click any Chữ Nôm character to add it to "Selected Characters"
  • Click on selected characters to remove them
  • Use "Clear All" to remove all selected characters
  • Use "New Column" to add column breaks in Traditional mode

EXPORTING:
  • PDF: Click Export → PDF (Print) → Save as PDF
  • DOC/DOCX: Click Export → Word (.doc) or Word (.docx) (need improvement)
  • HTML: Click Export → HTML
  • TXT: Click Export → Plain Text

KEYBOARD SHORTCUTS:
  • 1-9: Select character from output
  • Enter: Add new column
  • Ctrl+Enter (Cmd+Enter on Mac): Add new column
  • Ctrl+K (Cmd+K on Mac): Focus search bar
  • Escape: Clear search bar

================================================================================
VIETNAMESE KEYBOARD SETUP

To search for Vietnamese words, you need to type with proper diacritics (accents).

QUICK REFERENCE:

Telex Method:
  aa → â    aw → ă    ee → ê    oo → ô    ow → ơ    uw → ư    dd → đ

VNI Method:
  a6 → â    a8 → ă    e6 → ê    o6 → ô    o7 → ơ    u7 → ư    d9 → đ

HOW TO SET UP:

Windows:
  Settings → Time & Language → Language & Region → Add a language → Vietnamese
  Switch with Windows + Space

macOS:
  System Settings → Keyboard → Input Sources → Add → Vietnamese
  Switch with Control + Space

Linux:
  Settings → Region & Language → Input Sources → Add → Vietnamese
  Switch with Super + Space

Mobile (iOS/Android):
  Settings → Keyboard → Add New Keyboard → Vietnamese

Online Tools (No installation):
  https://vietnamese-typing.com/
  https://www.typevietnamese.com/

================================================================================
PROJECT STRUCTURE

nomnay/
│
├── index.html              # Main HTML file
├── app.js                  # Application logic
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
└── README.md               # This file

================================================================================
ADDING TO DICTIONARY

TO ADD NEW CHỮ NÔM ENTRIES:

1. Open mapping_chunom.json
2. Add new entries in this format:
   "quốc ngữ phrase": ["chữ nôm character 1", "chữ nôm character 2"]
3. Example: "anh yêu em": ["英", "要", "妹"]
4. Save the file and refresh the page

RULES:
  • Use UTF-8 encoding
  • Keep the JSON format valid
  • Use proper Quốc Ngữ spelling
  • Use correct Chữ Nôm characters

================================================================================
TROUBLESHOOTING

| Issue                           | Solution                                        |
|---------------------------------|-------------------------------------------------|
| Dictionary not loading          | Ensure mapping_chunom.json is in the folder     |
| Characters not displaying       | Check internet connection for Google Fonts      |
| Export not working              | Allow pop-ups for the page                      |
| Traditional mode not vertical   | Toggle the layout switch                        |
| Characters cut off              | Adjust font size or use the slider              |
| Can't type Vietnamese           | Set up Vietnamese keyboard (see above)          |
| Search not finding words        | Type exact Quốc Ngữ with correct accents        |

================================================================================
BROWSER COMPATIBILITY

| Browser   | Version | Status              |
|-----------|---------|---------------------|
| Chrome    | 60+     | ✅ Fully Supported  |
| Firefox   | 55+     | ✅ Fully Supported  |
| Safari    | 12+     | ✅ Fully Supported  |
| Edge      | 79+     | ✅ Fully Supported  |
| Opera     | 47+     | ✅ Fully Supported  |

================================================================================
VERSION HISTORY

Version 2.0.0 (July 29, 2026)
  • Added Traditional display mode (Right to Left, Top to Bottom)
  • Added Font Size Slider (1rem - 6rem)
  • Added Font Weight controls (Light, Medium, Bold)
  • Added PDF export with print dialog
  • Added DOCX export format
  • Added HTML export format
  • Added TXT export format
  • Added column break support
  • Added duplicate character support
  • Improved column spacing and layout
  • Fixed character cut-off issues
  • Enhanced Traditional mode display

Version 1.0.0 (Initial Release)
  • Basic search functionality
  • Grid and List views
  • Character selection
  • DOC export
  • Persistent storage (localStorage)

================================================================================
CONTRIBUTING

We welcome contributions from everyone!

HOW TO CONTRIBUTE:
  🐛 Report bugs via GitHub Issues
  💡 Suggest features via GitHub Issues
  📝 Improve documentation
  🌍 Add new language support
  🔍 Expand the dictionary
  🎨 Enhance UI/UX

QUICK GUIDE:
  1. Fork the repository
  2. Create a feature branch: git checkout -b feature/amazing-feature
  3. Make your changes
  4. Commit your changes: git commit -m 'Add amazing feature'
  5. Push to branch: git push origin feature/amazing-feature
  6. Create a Pull Request

================================================================================
LICENSE

This project is licensed under the MIT License. See the LICENSE file for details.

================================================================================
CONTACT

📂 GitHub: coming soon!
📧 Email: coming soon!

================================================================================
ABOUT THE NAME

NômNay = Nôm + Nay

Nôm = Chữ Nôm (traditional Sino-Vietnamese characters)
Nay = Now / Modern / Today

Together, NômNay represents the fusion of tradition and modernity — 
bringing ancient Chữ Nôm characters into the modern digital age.

================================================================================
ACKNOWLEDGMENTS

Special thanks to:
  • Chữ Nôm Project for preserving Vietnamese heritage
  • All contributors who have helped improve NômNay
  • The open source community for tools and inspiration

================================================================================
SUPPORT

If you find NômNay helpful, please consider:
  ⭐ Starring the repository on GitHub
  🐦 Sharing it on social media
  💬 Mentioning it in your projects
  🤝 Contributing to the project

================================================================================
END OF README

Made with ❤️ for preserving Vietnamese heritage

Last Updated: July 29, 2026
