/**
 * Subscription Service
 * Manages user subscriptions and payments
 * 
 * @module firebase/services/subscription
 */

const SubscriptionService = (function() {
  'use strict';

  /**
   * Update subscription status
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise<Object>} Result object
   */
  async function updateSubscription(subscriptionData) {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'Please log in first' };
    }
    
    const userId = auth.currentUser.uid;
    
    try {
      await db.collection('users').doc(userId).update({
        subscription: {
          status: subscriptionData.status,
          plan: subscriptionData.plan,
          startDate: subscriptionData.startDate,
          endDate: subscriptionData.endDate,
          stripeCustomerId: subscriptionData.stripeCustomerId || null,
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId || null
        },
        'subscription.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Subscription updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has active subscription
   * @returns {Promise<boolean>} Active subscription status
   */
  async function hasActiveSubscription() {
    const auth = FirebaseConfig.getAuth();
    const db = FirebaseConfig.getFirestore();
    
    if (!auth || !auth.currentUser) {
      return false;
    }
    
    const userId = auth.currentUser.uid;
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const subscription = userDoc.data().subscription;
        return subscription && subscription.status === 'active';
      }
      return false;
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get subscription details
   * @returns {Promise<Object|null>} Subscription data
   */
  async function getSubscriptionDetails() {
    const userData = UserService.getUserData();
    if (!userData || !userData.subscription) {
      return null;
    }
    return userData.subscription;
  }

  /**
   * Cancel subscription
   * @returns {Promise<Object>} Result object
   */
  async function cancelSubscription() {
    // This would typically interact with Stripe
    // For now, just update the status
    return await updateSubscription({
      status: 'cancelled',
      plan: 'free',
      startDate: null,
      endDate: null
    });
  }

  // Public API
  return {
    updateSubscription,
    hasActiveSubscription,
    getSubscriptionDetails,
    cancelSubscription
  };
})();
