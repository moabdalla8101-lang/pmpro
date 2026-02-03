# Monetization Implementation Guide

This guide provides step-by-step instructions for implementing monetization features in your PMP Exam Prep app.

## Quick Start

### 1. Subscription Utilities ✅ (Already Created)

The subscription utilities are ready to use:
- **Location**: `mobile/src/utils/subscriptionUtils.ts`
- **Functions**:
  - `hasPremiumAccess()` - Check if user has premium
  - `isSubscriptionActive()` - Check if subscription is valid
  - `requiresPremium()` - Check if feature needs premium
  - `hasReachedFreeLimit()` - Check free tier limits

### 2. Paywall Component ✅ (Already Created)

The paywall screen is ready:
- **Location**: `mobile/src/components/PaywallScreen.tsx`
- **Usage**: Import and use in your screens

---

## Implementation Steps

### Step 1: Integrate Payment Processor

Choose one of these options:

#### Option A: RevenueCat (Recommended for Mobile)

```bash
cd mobile
npm install react-native-purchases
```

**Setup:**
1. Create account at [RevenueCat](https://www.revenuecat.com)
2. Create app and configure products
3. Add API keys to your app

**Example Integration:**
```typescript
// mobile/src/services/paymentService.ts
import Purchases from 'react-native-purchases';

export const initializeRevenueCat = async () => {
  if (Platform.OS === 'ios') {
    await Purchases.configure({ apiKey: 'YOUR_IOS_API_KEY' });
  } else {
    await Purchases.configure({ apiKey: 'YOUR_ANDROID_API_KEY' });
  }
};

export const getOfferings = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
};

export const purchasePackage = async (packageToPurchase: any) => {
  const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
  return customerInfo;
};
```

#### Option B: Stripe

```bash
cd mobile
npm install @stripe/stripe-react-native
```

**Setup:**
1. Create Stripe account
2. Get publishable key
3. Set up backend webhook endpoint

#### Option C: Native In-App Purchases

For iOS: Use `react-native-iap`
For Android: Use `react-native-iap`

---

### Step 2: Add Feature Gating

#### Example: Gate Mock Exams

```typescript
// mobile/src/screens/main/ExamStartScreen.tsx
import { hasPremiumAccess } from '../../utils/subscriptionUtils';
import { PaywallScreen } from '../../components';
import { useSelector } from 'react-redux';

export default function ExamStartScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleStartExam = () => {
    if (!hasPremiumAccess(user?.subscriptionTier)) {
      setShowPaywall(true);
      return;
    }
    // Start exam logic
  };

  if (showPaywall) {
    return <PaywallScreen feature="mock_exams" onClose={() => setShowPaywall(false)} />;
  }

  // Rest of component
}
```

#### Example: Limit Free Questions

```typescript
// mobile/src/screens/main/PracticeScreen.tsx
import { hasReachedFreeLimit, FREE_TIER_LIMITS } from '../../utils/subscriptionUtils';
import { useSelector } from 'react-redux';

export default function PracticeScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleAnswerQuestion = () => {
    if (hasReachedFreeLimit('MAX_PRACTICE_QUESTIONS', questionsAnswered, user?.subscriptionTier)) {
      // Show paywall
      navigation.navigate('Paywall', { feature: 'unlimited_questions' });
      return;
    }
    // Continue with question
    setQuestionsAnswered(prev => prev + 1);
  };
}
```

---

### Step 3: Update Paywall Component

Connect the PaywallScreen to your payment processor:

```typescript
// In PaywallScreen.tsx, update handleSubscribe:

const handleSubscribe = async (planId: string) => {
  try {
    // Option A: RevenueCat
    const offerings = await getOfferings();
    const packageToPurchase = offerings?.availablePackages.find(
      p => p.identifier === planId
    );
    if (packageToPurchase) {
      const customerInfo = await purchasePackage(packageToPurchase);
      // Update user subscription in Redux
      dispatch(updateSubscription(customerInfo));
      onClose?.();
    }

    // Option B: Stripe
    // const { error, paymentMethod } = await createPaymentMethod(...);
    // await backendAPI.subscribe({ paymentMethodId, planId });
  } catch (error) {
    console.error('Purchase failed:', error);
    Alert.alert('Error', 'Failed to process subscription');
  }
};
```

---

### Step 4: Add Paywall Triggers

#### Trigger 1: After Free Questions Limit

```typescript
// After user answers 5 free questions
if (freeQuestionsAnswered >= 5 && !hasPremiumAccess(user?.subscriptionTier)) {
  navigation.navigate('Paywall', { 
    feature: 'unlimited_questions',
    showFreeTrial: true 
  });
}
```

#### Trigger 2: Before Mock Exam

```typescript
// When user tries to start mock exam
const handleStartMockExam = () => {
  if (!hasPremiumAccess(user?.subscriptionTier)) {
    navigation.navigate('Paywall', { 
      feature: 'mock_exams',
      showFreeTrial: true 
    });
    return;
  }
  // Start exam
};
```

#### Trigger 3: When Bookmarking

```typescript
// When free user tries to bookmark
const handleBookmark = () => {
  if (!hasPremiumAccess(user?.subscriptionTier)) {
    Alert.alert(
      'Premium Feature',
      'Bookmarking is available for Premium users.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade', 
          onPress: () => navigation.navigate('Paywall', { feature: 'bookmarks' })
        }
      ]
    );
    return;
  }
  // Bookmark logic
};
```

---

### Step 5: Add Subscription Status Check

Create a service to sync subscription status:

```typescript
// mobile/src/services/api/subscriptionService.ts
import axios from 'axios';
import { getApiUrl } from '../../utils/getApiUrl';

export const subscriptionService = {
  getSubscription: async (token: string) => {
    const response = await axios.get(`${getApiUrl()}/api/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateSubscription: async (token: string, subscriptionData: any) => {
    const response = await axios.put(
      `${getApiUrl()}/api/subscriptions`,
      subscriptionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
```

Update Redux to sync subscription:

```typescript
// mobile/src/store/slices/authSlice.ts
export const syncSubscription = createAsyncThunk(
  'auth/syncSubscription',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) throw new Error('Not authenticated');
    
    const subscription = await subscriptionService.getSubscription(token);
    return subscription;
  }
);
```

---

### Step 6: Add Navigation Route

Add paywall to your navigation:

```typescript
// mobile/src/navigation/MainNavigator.tsx
import PaywallScreen from '../screens/PaywallScreen'; // Or use component directly

// In your Stack.Navigator:
<Stack.Screen 
  name="Paywall" 
  component={PaywallScreen}
  options={{ presentation: 'modal' }}
/>
```

---

### Step 7: Backend Webhook Handler

Handle subscription events from payment processor:

```typescript
// backend/server/src/routes/webhooks.ts
import express from 'express';
import { pool } from '../db/connection';

const router = express.Router();

// RevenueCat webhook
router.post('/revenuecat', async (req, res) => {
  const { event } = req.body;
  
  if (event.type === 'INITIAL_PURCHASE' || event.type === 'RENEWAL') {
    const { app_user_id, product_id } = event;
    
    // Map product_id to subscription tier
    const tierMap: Record<string, string> = {
      'premium_monthly': 'premium_monthly',
      'premium_annual': 'premium_annual',
      // ... etc
    };
    
    const tier = tierMap[product_id] || 'free';
    const expiresAt = new Date(event.expires_at);
    
    await pool.query(
      `UPDATE users 
       SET subscription_tier = $1, 
           subscription_expires_at = $2
       WHERE id = $3`,
      [tier, expiresAt, app_user_id]
    );
  }
  
  res.status(200).send('OK');
});

export default router;
```

---

## Testing Checklist

- [ ] Free users see paywall after 5 questions
- [ ] Free users cannot start mock exams
- [ ] Free users cannot bookmark
- [ ] Premium users have full access
- [ ] Subscription purchase flow works
- [ ] Subscription status syncs with backend
- [ ] Webhook handles subscription events
- [ ] Free trial works correctly
- [ ] Subscription expiration is checked
- [ ] Churned users see paywall again

---

## Analytics to Track

Add analytics for:
- Paywall views
- Paywall conversion rate
- Subscription purchases by plan
- Free trial starts
- Free trial to paid conversion
- Churn rate by tier
- Feature usage by tier

---

## Next Steps

1. **Choose payment processor** (RevenueCat recommended)
2. **Set up products** in payment processor dashboard
3. **Integrate payment SDK** in mobile app
4. **Add feature gates** to key screens
5. **Test purchase flow** thoroughly
6. **Set up webhooks** for subscription events
7. **Launch and monitor** conversion metrics

---

## Support Resources

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [Stripe Mobile Docs](https://stripe.com/docs/mobile)
- [React Native IAP](https://github.com/dooboolab/react-native-iap)

---

**Remember**: Start with basic feature gating, then optimize based on user behavior data!
