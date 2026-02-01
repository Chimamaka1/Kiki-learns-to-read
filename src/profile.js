// Profile Page Functionality
let currentUser = null;
let userData = null;
let selectedKidForEdit = null;
let selectedAvatar = 'avatar1';
let selectedEditAvatar = 'avatar1';
let isProfileInitialized = false;

// Initialize profile page
function initializeProfilePage() {
  // Prevent multiple initializations
  if (isProfileInitialized) return;
  
  // Check if Firebase is ready
  if (typeof auth === 'undefined' || typeof db === 'undefined') {
    setTimeout(initializeProfilePage, 100);
    return;
  }
  
  isProfileInitialized = true;
  
  // Wait for Firebase Auth to be ready
  auth.onAuthStateChanged((user) => {
    if (!user) {
      console.log("⚠️  No user found, redirecting to home");
      window.location.href = 'index.html';
      return;
    }
    
    console.log("✅ User found:", user.email);
    currentUser = user;
    
    // Load profile data
    loadUserProfile();
    setupEventListeners();
  });
}

// Start initialization when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProfilePage);
} else {
  setTimeout(initializeProfilePage, 50);
}

// Load user profile from Firestore
async function loadUserProfile() {
  try {
    const userId = currentUser.uid;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    
    if (doc.exists) {
      userData = doc.data();
      displayUserInfo();
      displayKids();
      displayProgress();
      loadSettings();
      
      // Also update kid selector on home page if available
      if (typeof populateKidSelector === 'function') {
        populateKidSelector();
      }
    } else {
      // Create user document if it doesn't exist
      await userRef.set({
        email: currentUser.email,
        createdAt: new Date(),
        settings: {
          soundEnabled: true,
          musicEnabled: false,
          language: 'en'
        }
      });
      userData = {
        email: currentUser.email,
        kids: [],
        settings: {
          soundEnabled: true,
          musicEnabled: false,
          language: 'en'
        }
      };
      displayUserInfo();
      displayKids();
      displayProgress();
      loadSettings();
      
      // Also update kid selector on home page if available
      if (typeof populateKidSelector === 'function') {
        populateKidSelector();
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    showMessage('Error loading profile', 'error');
  }
}

// Display user information
function displayUserInfo() {
  const emailEl = document.getElementById('user-email-display');
  const nameEl = document.getElementById('user-name-display');
  const createdEl = document.getElementById('user-created-display');
  
  if (emailEl) emailEl.textContent = userData.email || '-';
  
  if (nameEl) {
    const displayName = currentUser.displayName || userData.displayName || 'Parent';
    nameEl.textContent = displayName;
  }
  
  if (createdEl) {
    const createdDate = userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : '-';
    createdEl.textContent = createdDate;
  }
}

// Display kids list
function displayKids() {
  const kidsList = document.getElementById('kids-list');
  
  if (!userData.kids || userData.kids.length === 0) {
    kidsList.innerHTML = `
      <div class="empty-state">
        <p>👶 No children added yet</p>
        <p class="empty-description">Click "Add Child" to get started with Kiki's learning adventure!</p>
      </div>
    `;
    return;
  }
  
  kidsList.innerHTML = '';
  
  userData.kids.forEach(kid => {
    const avatarEmoji = getAvatarEmoji(kid.avatar);
    const completedGames = calculateCompletedGames(kid);
    const totalStars = calculateTotalStars(kid);
    
    const kidCard = document.createElement('div');
    kidCard.className = 'kid-card';
    kidCard.innerHTML = `
      <div class="kid-avatar">${avatarEmoji}</div>
      <div class="kid-name">${kid.name}</div>
      <div class="kid-age">${formatAge(kid.age)}</div>
      
      <div class="kid-stats">
        <div class="kid-stat-row">
          <span>Games Played:</span>
          <span>${completedGames}</span>
        </div>
        <div class="kid-stat-row">
          <span>Stars Earned:</span>
          <span>⭐ ${totalStars}</span>
        </div>
        <div class="kid-stat-row">
          <span>Level:</span>
          <span>${calculateAverageLevel(kid)}</span>
        </div>
      </div>
      
      <div class="kid-actions">
        <button class="kid-action-btn kid-edit-btn" onclick="openEditKidModal('${kid.id}')">✏️ Edit</button>
        <button class="kid-action-btn kid-delete-btn" onclick="deleteKid('${kid.id}')">🗑️ Delete</button>
      </div>
    `;
    
    kidsList.appendChild(kidCard);
  });
}

// Display progress overview
function displayProgress() {
  const progressOverview = document.getElementById('progress-overview');
  
  if (!userData.kids || userData.kids.length === 0) {
    progressOverview.innerHTML = `
      <div class="empty-state">
        <p>📈 No progress data yet</p>
        <p class="empty-description">Once your child plays games, their progress will appear here!</p>
      </div>
    `;
    return;
  }
  
  progressOverview.innerHTML = '';
  
  userData.kids.forEach(kid => {
    const progress = kid.progress || {};
    
    const progressCard = document.createElement('div');
    progressCard.className = 'progress-card';
    
    let progressHtml = `
      <div class="progress-header">
        👶 ${kid.name}'s Learning Progress
      </div>
      <div class="progress-grid">
    `;
    
    const categories = [
      { key: 'readingSkills', name: '📚 Reading', emoji: '📚' },
      { key: 'numbersAndMaths', name: '🔢 Numbers', emoji: '🔢' },
      { key: 'logicAndThinking', name: '🧩 Logic', emoji: '🧩' },
      { key: 'creativity', name: '🎨 Creativity', emoji: '🎨' }
    ];
    
    categories.forEach(category => {
      const catProgress = progress[category.key] || {};
      const level = catProgress.level || 1;
      const gamesCompleted = catProgress.gamesCompleted || 0;
      const stars = catProgress.stars || 0;
      
      progressHtml += `
        <div class="progress-item">
          <div class="progress-label">${category.name}</div>
          <div class="progress-value">${level}</div>
          <div class="progress-label" style="margin-top: 8px; font-size: 11px; color: #999;">⭐ ${stars}</div>
        </div>
      `;
    });
    
    progressHtml += '</div>';
    progressCard.innerHTML = progressHtml;
    progressOverview.appendChild(progressCard);
  });
}

// Helper function to format age
function formatAge(age) {
  if (typeof age === 'object' && age.years !== undefined) {
    if (age.months > 0) {
      return `${age.years} years, ${age.months} months`;
    }
    return `${age.years} year${age.years !== 1 ? 's' : ''}`;
  }
  // Fallback for old format
  return `${age} year${age !== 1 ? 's' : ''}`;
}

// Setup event listeners
function setupEventListeners() {
  // Edit profile form
  const editProfileForm = document.getElementById('edit-profile-form');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const parentName = document.getElementById('edit-name').value;
      await updateParentProfile(parentName);
    });
  }
  
  // Add kid form
  const addKidForm = document.getElementById('add-kid-form');
  if (addKidForm) {
    addKidForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addNewKid();
    });
  }
  
  // Edit kid form
  const editKidForm = document.getElementById('edit-kid-form');
  if (editKidForm) {
    editKidForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await updateKidProfile();
    });
  }
  
  // Avatar selection for add kid
  document.querySelectorAll('#add-kid-modal .avatar-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('#add-kid-modal .avatar-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      selectedAvatar = this.dataset.avatar;
      document.getElementById('kid-avatar').value = selectedAvatar;
    });
  });
  
  // Avatar selection for edit kid
  document.querySelectorAll('#edit-kid-modal .avatar-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('#edit-kid-modal .avatar-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      selectedEditAvatar = this.dataset.avatar;
      document.getElementById('edit-kid-avatar').value = selectedEditAvatar;
    });
  });
  
  // Settings toggles
  const soundToggle = document.getElementById('sound-toggle');
  const musicToggle = document.getElementById('music-toggle');
  const languageSelect = document.getElementById('language-select');
  
  if (soundToggle) {
    soundToggle.addEventListener('change', async (e) => {
      await updateSetting('soundEnabled', e.target.checked);
    });
  }
  
  if (musicToggle) {
    musicToggle.addEventListener('change', async (e) => {
      await updateSetting('musicEnabled', e.target.checked);
    });
  }
  
  if (languageSelect) {
    languageSelect.addEventListener('change', async (e) => {
      await updateSetting('language', e.target.value);
    });
  }
}

// Update parent profile
async function updateParentProfile(parentName) {
  try {
    const userId = currentUser.uid;
    
    // Update Firebase Auth display name
    if (parentName) {
      await currentUser.updateProfile({ displayName: parentName });
    }
    
    // Update Firestore
    await db.collection('users').doc(userId).update({
      displayName: parentName
    });
    
    showMessage('Profile updated successfully!', 'success');
    closeModal('edit-profile-modal');
    await loadUserProfile();
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Error updating profile', 'error');
  }
}

// Add new kid
async function addNewKid() {
  try {
    const kidName = document.getElementById('kid-name').value;
    const kidAgeYears = parseInt(document.getElementById('kid-age-years').value);
    const kidAgeMonths = parseInt(document.getElementById('kid-age-months').value) || 0;
    const kidAvatar = selectedAvatar;
    
    if (!kidName || isNaN(kidAgeYears)) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    const userId = currentUser.uid;
    const kidId = 'kid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const newKid = {
      id: kidId,
      name: kidName,
      age: {
        years: kidAgeYears,
        months: kidAgeMonths
      },
      avatar: kidAvatar,
      createdAt: new Date(),
      progress: {
        readingSkills: { level: 1, gamesCompleted: 0, stars: 0 },
        numbersAndMaths: { level: 1, gamesCompleted: 0, stars: 0 },
        logicAndThinking: { level: 1, gamesCompleted: 0, stars: 0 },
        creativity: { level: 1, gamesCompleted: 0, stars: 0 }
      },
      stats: {
        totalPlayTime: 0,
        totalGamesPlayed: 0,
        favoriteGames: []
      }
    };
    
    await db.collection('users').doc(userId).update({
      kids: firebase.firestore.FieldValue.arrayUnion(newKid)
    });
    
    showMessage(`${kidName} has been added! 🎉`, 'success');
    closeModal('add-kid-modal');
    document.getElementById('add-kid-form').reset();
    
    // Reset avatar selection
    document.querySelectorAll('#add-kid-modal .avatar-option').forEach(o => o.classList.remove('selected'));
    document.querySelector('[data-avatar="avatar1"]').classList.add('selected');
    selectedAvatar = 'avatar1';
    
    await loadUserProfile();
  } catch (error) {
    console.error('Error adding kid:', error);
    showMessage('Error adding child', 'error');
  }
}

// Open edit kid modal
function openEditKidModal(kidId) {
  selectedKidForEdit = userData.kids.find(kid => kid.id === kidId);
  
  if (!selectedKidForEdit) {
    showMessage('Child not found', 'error');
    return;
  }
  
  document.getElementById('edit-kid-id').value = selectedKidForEdit.id;
  document.getElementById('edit-kid-name').value = selectedKidForEdit.name;
  
  // Handle age as object with years and months
  if (typeof selectedKidForEdit.age === 'object' && selectedKidForEdit.age !== null) {
    document.getElementById('edit-kid-age-years').value = selectedKidForEdit.age.years || 0;
    document.getElementById('edit-kid-age-months').value = selectedKidForEdit.age.months || 0;
  } else {
    // Fallback for old format
    document.getElementById('edit-kid-age-years').value = selectedKidForEdit.age || 0;
    document.getElementById('edit-kid-age-months').value = 0;
  }
  
  // Reset avatar selection
  document.querySelectorAll('#edit-kid-modal .avatar-option').forEach(o => o.classList.remove('selected'));
  const selectedOption = document.querySelector(`#edit-kid-modal [data-avatar="${selectedKidForEdit.avatar}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    selectedEditAvatar = selectedKidForEdit.avatar;
  }
  
  openModal('edit-kid-modal');
}

// Update kid profile
async function updateKidProfile() {
  try {
    const kidId = document.getElementById('edit-kid-id').value;
    const kidName = document.getElementById('edit-kid-name').value;
    const kidAgeYears = parseInt(document.getElementById('edit-kid-age-years').value) || 0;
    const kidAgeMonths = parseInt(document.getElementById('edit-kid-age-months').value) || 0;
    
    if (!kidName) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    const userId = currentUser.uid;
    
    // Find and update the kid
    const kids = userData.kids.map(kid => {
      if (kid.id === kidId) {
        return {
          ...kid,
          name: kidName,
          age: { years: kidAgeYears, months: kidAgeMonths },
          avatar: selectedEditAvatar
        };
      }
      return kid;
    });
    
    await db.collection('users').doc(userId).update({ kids });
    
    showMessage('Child profile updated!', 'success');
    closeModal('edit-kid-modal');
    await loadUserProfile();
  } catch (error) {
    console.error('Error updating kid profile:', error);
    showMessage('Error updating child profile', 'error');
  }
}

// Delete current kid
async function deleteCurrentKid() {
  if (!selectedKidForEdit) return;
  await deleteKid(selectedKidForEdit.id);
}

// Delete kid
async function deleteKid(kidId) {
  if (!confirm('Are you sure you want to delete this child? This cannot be undone.')) {
    return;
  }
  
  try {
    const userId = currentUser.uid;
    const kidToDelete = userData.kids.find(kid => kid.id === kidId);
    
    if (!kidToDelete) {
      showMessage('Child not found', 'error');
      return;
    }
    
    const kids = userData.kids.filter(kid => kid.id !== kidId);
    
    await db.collection('users').doc(userId).update({ kids });
    
    showMessage(`${kidToDelete.name} has been removed.`, 'success');
    closeModal('edit-kid-modal');
    await loadUserProfile();
  } catch (error) {
    console.error('Error deleting kid:', error);
    showMessage('Error deleting child', 'error');
  }
}

// Load settings
function loadSettings() {
  if (!userData.settings) return;
  
  const soundToggle = document.getElementById('sound-toggle');
  const musicToggle = document.getElementById('music-toggle');
  const languageSelect = document.getElementById('language-select');
  
  if (soundToggle) soundToggle.checked = userData.settings.soundEnabled !== false;
  if (musicToggle) musicToggle.checked = userData.settings.musicEnabled === true;
  if (languageSelect) languageSelect.value = userData.settings.language || 'en';
}

// Update setting
async function updateSetting(setting, value) {
  try {
    const userId = currentUser.uid;
    const settings = userData.settings || {};
    settings[setting] = value;
    
    await db.collection('users').doc(userId).update({
      settings: settings
    });
    
    userData.settings = settings;
    console.log('Setting updated:', setting, value);
  } catch (error) {
    console.error('Error updating setting:', error);
  }
}

// Open edit profile modal
function openEditProfileModal() {
  const displayName = currentUser.displayName || userData.displayName || '';
  document.getElementById('edit-name').value = displayName;
  openModal('edit-profile-modal');
}

// Open add kid modal
function openAddKidModal() {
  document.getElementById('add-kid-form').reset();
  document.querySelectorAll('#add-kid-modal .avatar-option').forEach(o => o.classList.remove('selected'));
  document.querySelector('#add-kid-modal [data-avatar="avatar1"]').classList.add('selected');
  selectedAvatar = 'avatar1';
  openModal('add-kid-modal');
}

// Helper functions
function getAvatarEmoji(avatar) {
  const avatarMap = {
    'avatar1': '👦',
    'avatar2': '👧',
    'avatar3': '👶',
    'avatar4': '🧒',
    'default': '👶'
  };
  return avatarMap[avatar] || '👶';
}

function calculateCompletedGames(kid) {
  if (!kid.progress) return 0;
  return (
    (kid.progress.readingSkills?.gamesCompleted || 0) +
    (kid.progress.numbersAndMaths?.gamesCompleted || 0) +
    (kid.progress.logicAndThinking?.gamesCompleted || 0) +
    (kid.progress.creativity?.gamesCompleted || 0)
  );
}

function calculateTotalStars(kid) {
  if (!kid.progress) return 0;
  return (
    (kid.progress.readingSkills?.stars || 0) +
    (kid.progress.numbersAndMaths?.stars || 0) +
    (kid.progress.logicAndThinking?.stars || 0) +
    (kid.progress.creativity?.stars || 0)
  );
}

function calculateAverageLevel(kid) {
  if (!kid.progress) return 1;
  const levels = [
    kid.progress.readingSkills?.level || 1,
    kid.progress.numbersAndMaths?.level || 1,
    kid.progress.logicAndThinking?.level || 1,
    kid.progress.creativity?.level || 1
  ];
  const average = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
  return average;
}

// Message utility
function showMessage(message, type) {
  // Create a temporary message element
  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : '#ff4444'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 3000;
    font-weight: 600;
    animation: slideDown 0.3s ease;
  `;
  messageEl.textContent = message;
  document.body.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);
