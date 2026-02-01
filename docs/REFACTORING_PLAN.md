# Directory Refactoring & Cleanup Guide

## Folder Structure Reorganization

The project is being restructured to improve maintainability and clarity:

### Current Messy Root Directory
```
kiki-learns-to-read/
├── index.html
├── profile.html
├── script.js
├── auth.js
├── database.js
├── config.js
├── firebase-config.js
├── game-integration.js
├── *.md (12 documentation files)
├── .firebaserc
├── firebase.json
├── 404.html
├── icon.png
├── .gitignore
├── .git/
└── ... more folders
```

### New Organized Structure
```
kiki-learns-to-read/
├── index.html
├── profile.html
├── 404.html
├── icon.png
│
├── src/                    # Application source code
│   ├── script.js
│   ├── auth.js
│   ├── profile.js
│   ├── database.js
│   ├── game-integration.js
│   └── config.js
│
├── config/                 # Configuration files
│   ├── firebase-config.js
│   ├── config.template.js
│   ├── .firebaserc
│   └── firebase.json
│
├── css/                    # Stylesheets (already organized)
│   ├── style.css
│   ├── auth.css
│   └── profile.css
│
├── firebase/               # Firebase services (already organized)
│   ├── core/
│   ├── services/
│   ├── ui/
│   ├── utils/
│   └── index.js
│
├── games/                  # Game files (already organized)
│   ├── creativity/
│   ├── logic/
│   ├── numbers-and-maths/
│   └── reading-skills/
│
├── assets/                 # Assets (already organized)
│   ├── images/
│   └── sounds/
│
├── docs/                   # Documentation
│   ├── README.md
│   ├── QUICK_START.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── FIREBASE_SETUP.md
│   ├── BACKEND_IMPLEMENTATION.md
│   ├── MIGRATION_GUIDE.md
│   ├── REFACTORING_CHECKLIST.md
│   ├── REFACTORING_SUMMARY.md
│   ├── PROFILE_MANAGEMENT_GUIDE.md
│   ├── PARENT_QUICK_START.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── FILE_STRUCTURE.md
│   ├── README_PROFILE_SYSTEM.md
│   └── VERIFICATION_CHECKLIST.md
│
├── .git/
├── .github/
├── .gitignore
└── .env.example
```

## Files to Move

### Move to `src/` directory:
- script.js
- auth.js
- profile.js (update path references)
- database.js
- game-integration.js
- config.js

**After moving, update references in:**
- index.html (update script src paths)
- profile.html (update script src paths)
- Game HTML files (update script src paths)

### Move to `config/` directory:
- firebase-config.js
- config.template.js
- .firebaserc
- firebase.json

**After moving, update references in:**
- index.html
- profile.html
- All files that reference firebase-config.js

### Move to `docs/` directory:
- README.md
- QUICK_START.md
- ARCHITECTURE.md
- DATABASE_SCHEMA.md
- FIREBASE_SETUP.md
- BACKEND_IMPLEMENTATION.md
- MIGRATION_GUIDE.md
- REFACTORING_CHECKLIST.md
- REFACTORING_SUMMARY.md
- PROFILE_MANAGEMENT_GUIDE.md
- PARENT_QUICK_START.md
- IMPLEMENTATION_SUMMARY.md
- FILE_STRUCTURE.md
- README_PROFILE_SYSTEM.md
- VERIFICATION_CHECKLIST.md

## Reference Update Checklist

After moving files, update these references:

### In index.html:
```html
<!-- OLD -->
<script src="config.js"></script>
<script src="firebase-config.js"></script>
<script src="auth.js"></script>
<script src="script.js?v=final1"></script>

<!-- NEW -->
<script src="config/firebase-config.js"></script>
<script src="config.js"></script>
<script src="src/auth.js"></script>
<script src="src/script.js?v=final1"></script>
```

### In profile.html:
```html
<!-- OLD -->
<script src="config.js"></script>
<script src="firebase-config.js"></script>
<script src="auth.js"></script>
<script src="profile.js"></script>

<!-- NEW -->
<script src="config/firebase-config.js"></script>
<script src="config.js"></script>
<script src="src/auth.js"></script>
<script src="src/profile.js"></script>
```

### In game HTML files:
Update paths from:
```html
<script src="../../../script.js"></script>
```
To:
```html
<script src="../../../src/script.js"></script>
```

## Migration Steps

1. ✅ Create directories: `src/`, `config/`, `docs/`
2. Move all application JavaScript files to `src/`
3. Move all configuration files to `config/`
4. Move all documentation to `docs/`
5. Update all script src paths in HTML files
6. Test that everything still works
7. Update this refactoring guide with completion status

## Expected Benefits

✅ **Cleaner root directory** - Only essential files visible
✅ **Better organization** - Related files grouped together
✅ **Easier maintenance** - Clear file purposes
✅ **Scalability** - Room to grow without clutter
✅ **Faster navigation** - Find files quickly
✅ **Professional structure** - Industry-standard layout

## Current Status

- [x] Directories created
- [ ] Files moved to src/
- [ ] Files moved to config/
- [ ] Files moved to docs/
- [ ] Path references updated in index.html
- [ ] Path references updated in profile.html
- [ ] Path references updated in game files
- [ ] Testing completed
- [ ] Documentation updated

---

**Next Step**: Start moving files according to the plan above.
