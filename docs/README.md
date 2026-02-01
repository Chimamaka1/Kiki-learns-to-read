# 🧸 Kiki Learns to Read - CVC Phonics Games 

A collection of interactive educational games designed to help children learn phonics and reading through Consonant-Vowel-Consonant (CVC) patterns. The games use engaging visuals, audio feedback, and gamification to create an enjoyable learning experience.

## 🔥 NEW: Firebase Backend Integration

The application now includes a complete Firebase backend for user authentication, progress tracking, and subscription management!

📖 **Quick Links:**
- [Firebase Setup Guide](FIREBASE_SETUP.md) - Get started with Firebase
- [Backend Documentation](firebase/README.md) - API reference
- [Refactoring Summary](REFACTORING_SUMMARY.md) - What changed
- [Migration Guide](MIGRATION_GUIDE.md) - Update existing code

## 🎮 Games Overview

### 1. **Main CVC Phonics Game** (`index.html`)
- **Core Features**: Interactive letter blending with slider controls
- **Learning Modes**: VC (Vowel-Consonant), CV (Consonant-Vowel), CVC (Consonant-Vowel-Consonant)
- **Audio Integration**: Individual letter sounds and background music
- **Interface**: Tap letters to hear sounds, blend words progressively

### 2. **🎈 Pop the Balloon** (`games/balloon-pop/`)
- **Objective**: Pop balloons to match heard sounds
- **Skills**: Letter-sound recognition, auditory processing
- **Feedback**: Visual and audio rewards for correct answers

### 3. **👂 Listen & Choose** (`games/listen-choose/`)
- **Objective**: Select the correct letter after hearing a sound
- **Skills**: Phonemic awareness, sound discrimination
- **Format**: Multiple choice with audio cues

### 4. **🥚 Crack the Egg** (`games/egg-match/`)
- **Objective**: Match words to corresponding images by cracking eggs
- **Skills**: Word-picture association, vocabulary building
- **Interaction**: Click to reveal images and make matches

### 5. **🧠 Memory Game** (`games/memory-game/`)
- **Objective**: Remember and reproduce sequences of sounds/letters
- **Skills**: Working memory, pattern recognition
- **Challenge**: Progressively increasing difficulty levels

## 📁 Project Structure

```
Kiki-learns-to-read/
├── index.html              # Main application with Firebase integration
├── script.js              # Core game logic and audio handling
├── config.js              # Your Firebase & API credentials (not in git)
├── config.template.js     # Template for configuration
├── README.md              # This documentation
│
├── firebase/              # 🔥 Backend module (NEW)
│   ├── core/
│   │   └── config.js      # Firebase initialization
│   ├── services/          # Business logic services
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── kid.service.js
│   │   ├── progress.service.js
│   │   └── subscription.service.js
│   ├── utils/             # Utility functions
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── ui/                # UI components
│   │   ├── handlers.js
│   │   └── game-integration.js
│   ├── index.js           # Main entry point
│   └── README.md          # Backend API documentation
│
├── css/
│   ├── style.css          # Main stylesheet
│   └── auth.css           # Authentication UI styles
│
├── games/                 # Individual learning games
│   ├── reading-skills/
│   │   ├── balloon-pop/
│   │   ├── listen-choose/
│   │   ├── egg-match/
│   │   └── ... (other reading games)
│   ├── numbers-and-maths/
│   ├── logic/
│   └── creativity/
│
├── assets/
│   ├── sounds/            # Audio files
│   └── images/            # Visual assets
│
└── docs/                  # Documentation
    ├── FIREBASE_SETUP.md
    ├── DATABASE_SCHEMA.md
    ├── MIGRATION_GUIDE.md
    ├── REFACTORING_SUMMARY.md
    └── BACKEND_IMPLEMENTATION.md
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 audio support
- Firebase account (for backend features)
- Local web server (recommended) or ability to open HTML files directly

### Installation

#### 1. Basic Setup
```bash
# Clone or download the project
git clone [your-repo-url]
cd Kiki-learns-to-read
```

#### 2. Configure Firebase (Optional but Recommended)
```bash
# Copy configuration template
cp config.template.js config.js

# Edit config.js and add your Firebase credentials
# Follow FIREBASE_SETUP.md for detailed instructions
```

#### 3. Run the Application
```bash
# Option 1: Use a local web server
python -m http.server 8000
# Then open http://localhost:8000

# Option 2: Open directly in browser
# Open index.html in your browser
```

### Quick Start (Without Backend)
```bash
# Using Python 3 (if available)
python -m http.server 8000

# Using Node.js http-server (if available)
npx http-server

# Then navigate to http://localhost:8000
```

### ElevenLabs Configuration (Optional)
For enhanced speech quality, you can configure ElevenLabs API:
1. Get an API key from [ElevenLabs](https://elevenlabs.io)
2. Copy `config.template.js` to `config.js`
3. Add your credentials to `config.js`
4. The app will automatically use ElevenLabs when available

## 🎯 Educational Objectives

### Primary Learning Goals
- **Phonemic Awareness**: Recognizing individual sounds in words
- **Letter-Sound Correspondence**: Connecting letters to their sounds
- **Blending Skills**: Combining sounds to form words
- **Vocabulary Development**: Building sight word recognition
- **Auditory Processing**: Discriminating between similar sounds

### Age Group
- **Target Age**: 4-7 years old
- **Skill Level**: Beginner to intermediate readers
- **Curriculum Alignment**: Pre-K through Grade 1 phonics standards

## 🔧 Technical Features

### Audio System
- **Format**: MP3 files for broad compatibility
- **Audio Gate**: Required interaction for mobile/tablet audio playback
- **Background Music**: Optional ambient music with toggle control
- **Sound Effects**: Immediate feedback for user interactions

### Responsive Design
- **Mobile-First**: Optimized for tablets and touch devices
- **Cross-Browser**: Compatible with modern browsers
- **Accessibility**: Large touch targets and clear visual feedback

### Performance
- **Lightweight**: Minimal dependencies, fast loading
- **Offline Capable**: All assets stored locally
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 🎨 Customization

### Adding New Sounds
1. Place new MP3 files in `assets/sounds/`
2. Follow naming convention: `{letter}.mp3`
3. Update game logic if adding new letter patterns

### Adding New Images
1. Add PNG files to `assets/images/`
2. Update `egg-match.js` items array with new entries
3. Ensure images are optimized for web (recommended: 200x200px)

### Styling Modifications
- Main styles: `css/style.css`
- Game-specific styles: Individual CSS files in game folders
- CSS variables available for easy theming

## 🐛 Troubleshooting

### Common Issues

**Audio Not Playing**
- Ensure browser supports HTML5 audio
- Check volume settings
- Try refreshing the page
- On mobile: tap the "🔊 Tap to Start" button

**Games Not Loading**
- Verify all file paths are correct
- Check browser console for errors
- Ensure local server is running (if using one)

**Missing Images**
- Verify image files exist in `assets/images/`
- Check file names match JavaScript references
- Ensure proper file permissions

## 📱 Browser Compatibility

### Tested Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Support
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Tablet optimized

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature-name`
6. Create pull request

### Coding Standards
- Use semantic HTML5 elements
- Follow existing JavaScript patterns
- Maintain mobile-first responsive design
- Test on multiple devices and browsers

## 📄 License

This project is designed for educational use. Please respect copyright for any included audio or image assets.

## 🙋‍♀️ Support

For questions, issues, or suggestions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all file paths are correctly updated after any modifications

## 🎓 Educational Resources

### Related Learning Concepts
- **Phonics**: Letter-sound relationships
- **Sight Words**: High-frequency word recognition
- **Fluency**: Reading speed and accuracy
- **Comprehension**: Understanding meaning

### Extension Activities
- Practice writing CVC words after playing
- Create new word lists for different themes
- Use games as assessment tools for progress tracking
- Integrate with existing reading curriculum

---

**Version**: 2.0  
**Last Updated**: January 2026  
**Developed for**: Early childhood phonics education
