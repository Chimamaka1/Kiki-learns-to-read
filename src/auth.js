// Authentication Functions for Firebase

// Sign Up with Email and Password
async function signUp(email, password, displayName = '') {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Update profile with display name if provided
    if (displayName) {
      await user.updateProfile({ displayName });
    }
    
    console.log("✅ User created successfully:", user.email);
    return { success: true, user };
  } catch (error) {
    console.error("❌ Sign up error:", error);
    return { success: false, error: error.message };
  }
}

// Sign In with Email and Password
async function signIn(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("✅ User signed in:", userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("❌ Sign in error:", error);
    return { success: false, error: error.message };
  }
}

// Sign Out
async function signOut() {
  try {
    await auth.signOut();
    console.log("✅ User signed out");
    return { success: true };
  } catch (error) {
    console.error("❌ Sign out error:", error);
    return { success: false, error: error.message };
  }
}

// Sign In with Google
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    console.log("✅ Signed in with Google:", result.user.email);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("❌ Google sign in error:", error);
    return { success: false, error: error.message };
  }
}

// Password Reset
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    console.log("✅ Password reset email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Password reset error:", error);
    return { success: false, error: error.message };
  }
}

// Get Current User
function getCurrentUser() {
  return auth.currentUser;
}

// Check if user is logged in
function isLoggedIn() {
  return auth.currentUser !== null;
}

// Handle Auth Form Submissions
function setupAuthForms() {
  // Sign Up Form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const name = document.getElementById('signup-name')?.value || '';
      
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
      
      const result = await signUp(email, password, name);
      
      if (result.success) {
        showMessage('Account created successfully! Welcome!', 'success');
        signupForm.reset();
        closeModal('signup-modal');
      } else {
        showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    });
  }
  
  // Sign In Form
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      
      const submitBtn = signinForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';
      
      const result = await signIn(email, password);
      
      if (result.success) {
        showMessage('Welcome back!', 'success');
        signinForm.reset();
        closeModal('signin-modal');
      } else {
        showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    });
  }
  
  // Password Reset Form
  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reset-email').value;
      
      const submitBtn = resetForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      const result = await resetPassword(email);
      
      if (result.success) {
        showMessage('Password reset email sent! Check your inbox.', 'success');
        resetForm.reset();
        closeModal('reset-modal');
      } else {
        showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Link';
    });
  }
  
  // Google Sign In Button
  const googleBtn = document.getElementById('google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      googleBtn.disabled = true;
      googleBtn.textContent = 'Signing in...';
      
      const result = await signInWithGoogle();
      
      if (result.success) {
        showMessage('Welcome!', 'success');
      } else {
        showMessage(result.error, 'error');
      }
      
      googleBtn.disabled = false;
      googleBtn.textContent = '🔐 Sign In with Google';
    });
  }
  
  // Sign Out Button
  const signoutBtn = document.getElementById('signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      const result = await signOut();
      if (result.success) {
        showMessage('Signed out successfully', 'success');
      }
    });
  }
}

// Utility: Show message to user
function showMessage(message, type = 'info') {
  // Create or get message container
  let messageDiv = document.getElementById('auth-message');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'auth-message';
    messageDiv.className = 'auth-message';
    document.body.appendChild(messageDiv);
  }
  
  messageDiv.textContent = message;
  messageDiv.className = `auth-message ${type}`;
  messageDiv.style.display = 'block';
  
  // Auto-hide after 4 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 4000);
}

// Utility: Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Initialize auth forms when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAuthForms);
} else {
  setupAuthForms();
}
