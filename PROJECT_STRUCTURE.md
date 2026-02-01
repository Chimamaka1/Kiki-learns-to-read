# Kiki Learns to Read - Project Structure

## Overview
This project has been reorganized for better maintainability and clarity. All files are now organized into logical folders.

## Directory Structure

### Root Level
- **index.html** - Main home page of the application
- **profile.html** - Parent profile management page
- **404.html** - 404 error page
- **icon.png** - App icon

### `/config` - Configuration Files
All configuration and setup files are stored here:
- **config.js** - Main configuration file with Firebase credentials and API keys
- **config.template.js** - Template file showing the config structure
- **firebase-config.js** - Firebase initialization and setup
- **firebase.json** - Firebase project configuration
- **.firebaserc** - Firebase CLI configuration

### `/src` - Source Code
All JavaScript source files:
- **script.js** - Core game logic and audio handling
- **auth.js** - Authentication functions (sign in, sign up, sign out)
- **profile.js** - Profile page functionality
- **database.js** - Database operations
- **game-integration.js** - Game integration utilities

### `/css` - Stylesheets
- **style.css** - Main application styles
- **auth.css** - Authentication modal styles
- **profile.css** - Profile page styles

### `/games` - Game Files
Organized by skill category:
- `/reading-skills/` - Reading games
- `/numbers-and-maths/` - Math games
- `/logic/` - Logic games
- `/creativity/` - Creative games

### `/assets` - Static Assets
- `/images/` - Image files
- `/sounds/` - Audio files

### `/firebase` - Firebase Services (Modular Services)
Alternative Firebase service layer:
- `/core/` - Core configuration
- `/services/` - Service modules
- `/ui/` - UI handlers
- `/utils/` - Utility functions

### `/docs` - Documentation
Complete documentation files:
- README.md - Project overview
- FIREBASE_SETUP.md - Firebase setup guide
- DATABASE_SCHEMA.md - Database schema documentation
- QUICK_START.md - Quick start guide
- BACKEND_IMPLEMENTATION.md - Backend implementation details
- And more...

### Other Directories
- **/.git** - Git repository
- **/.github** - GitHub configuration
- **/.gitignore** - Git ignore rules

## Updated Script References

All HTML files have been updated to reference the new locations:

### Main Pages
```html
<!-- index.html and profile.html now load scripts from new locations -->
<script src="config/config.js"></script>
<script src="config/firebase-config.js"></script>
<script src="src/auth.js"></script>
<script src="src/profile.js"></script>
<script src="src/script.js"></script>
```

### Game Pages
```html
<!-- Game HTML files now reference scripts with updated paths -->
<script src="../../../config/config.js"></script>
<script src="../../../src/script.js"></script>
<script src="game-name.js"></script>
```

## Recent Changes

### Files Moved
- **Config Directory** (from root → /config/):
  - config.js, config.template.js, firebase-config.js, firebase.json, .firebaserc

- **Source Code** (from root → /src/):
  - script.js, auth.js, database.js, game-integration.js, profile.js

- **Documentation** (from root → /docs/):
  - All .md documentation files

### Bug Fixes in This Reorganization
1. **Fixed Firebase initialization**: firebase-config.js now properly uses credentials from config.js instead of placeholder values
2. **Fixed "Let's Read" speech issue**: Added guard to prevent audio initialization on profile page
3. **Fixed profile page disappearing**: Corrected Firebase configuration loading

## How to Use

1. **Starting the App**: Open `index.html` in a web browser
2. **Parent Profile**: Click the "👤 Profile" button when logged in
3. **Playing Games**: Select a skill category and play available games

## Setup Instructions

1. Update `/config/config.js` with your Firebase credentials
2. Ensure all script paths are correct (they should be after reorganization)
3. Run the application

## Notes
- All scripts are now in their appropriate locations
- Firebase configuration is centralized in `/config/`
- All documentation is organized in `/docs/`
- The root directory is now clean and contains only essential files
