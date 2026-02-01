/**
 * UI Handlers
 * Manages authentication UI interactions
 * 
 * @module firebase/ui/handlers
 */

(function() {
  'use strict';

  /**
   * Set up authentication form handlers
   */
  function setupAuthForms() {
    setupSignUpForm();
    setupSignInForm();
    setupResetPasswordForm();
    setupGoogleSignIn();
    setupSignOutButton();
  }

  /**
   * Set up sign-up form
   */
  function setupSignUpForm() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const name = document.getElementById('signup-name')?.value || '';
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
      
      const result = await AuthService.signUp(email, password, name);
      
      if (result.success) {
        FirebaseHelpers.showMessage('Account created successfully! Welcome!', 'success');
        form.reset();
        FirebaseHelpers.closeModal('signup-modal');
      } else {
        FirebaseHelpers.showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    });
  }

  /**
   * Set up sign-in form
   */
  function setupSignInForm() {
    const form = document.getElementById('signin-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';
      
      const result = await AuthService.signIn(email, password);
      
      if (result.success) {
        FirebaseHelpers.showMessage('Welcome back!', 'success');
        form.reset();
        FirebaseHelpers.closeModal('signin-modal');
      } else {
        FirebaseHelpers.showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    });
  }

  /**
   * Set up password reset form
   */
  function setupResetPasswordForm() {
    const form = document.getElementById('reset-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reset-email').value;
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      const result = await AuthService.resetPassword(email);
      
      if (result.success) {
        FirebaseHelpers.showMessage('Password reset email sent! Check your inbox.', 'success');
        form.reset();
        FirebaseHelpers.closeModal('reset-modal');
      } else {
        FirebaseHelpers.showMessage(result.error, 'error');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Link';
    });
  }

  /**
   * Set up Google sign-in buttons
   */
  function setupGoogleSignIn() {
    const btns = document.querySelectorAll('#google-signin-btn, #google-signup-btn');
    
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Signing in...';
        
        const result = await AuthService.signInWithGoogle();
        
        if (result.success) {
          FirebaseHelpers.showMessage('Welcome!', 'success');
          FirebaseHelpers.closeModal('signin-modal');
          FirebaseHelpers.closeModal('signup-modal');
        } else {
          FirebaseHelpers.showMessage(result.error, 'error');
        }
        
        btn.disabled = false;
        btn.textContent = originalText;
      });
    });
  }

  /**
   * Set up sign-out button
   */
  function setupSignOutButton() {
    const btn = document.getElementById('signout-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const result = await AuthService.signOut();
      if (result.success) {
        FirebaseHelpers.showMessage('Signed out successfully', 'success');
        StorageUtil.clearAll();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAuthForms);
  } else {
    setupAuthForms();
  }

  // Make helper functions available globally
  window.openModal = FirebaseHelpers.openModal;
  window.closeModal = FirebaseHelpers.closeModal;

})();
