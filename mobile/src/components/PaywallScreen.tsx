import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import type { PurchasesPackage } from 'react-native-purchases';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';
import {
  getPlanRank,
  formatSubscriptionEndDate,
  getSubscriptionDisplayName,
  matchesSubscriptionTier,
  planHasEnded,
  userHasActivePremium,
} from '../utils/subscriptionUtils';
import { fetchOfferings, purchaseSubscription, restoreSubscription } from '../store/slices/subscriptionSlice';
import { syncSubscription } from '../store/slices/authSlice';
import {
  isRevenueCatAvailable,
  isRevenueCatConfigured,
} from '../services/revenueCatService';
import { useRequireAuth } from '../utils/requireAuth';
import { getApiErrorMessage } from '../utils/apiError';
import {
  APPLE_EULA_URL,
  openExternalUrl,
  privacyPolicyUrl,
  termsOfUseUrl,
} from '../config/legal';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'cram_time',
    name: 'Cram Time',
    price: '$9.99',
    period: 'per week',
    features: [
      'Perfect for last-minute prep',
      'Full premium access',
      'Cancel anytime',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: '$12.49',
    period: 'per month',
    features: [
      '3-day free trial',
      'Unlimited practice questions',
      'Unlimited mock exams',
      'Bookmarked questions',
      'Missed questions review',
      'Advanced analytics',
      'Cancel anytime',
    ],
  },
  {
    id: 'premium_semi_annual',
    name: 'Premium (6 Months)',
    price: '$49.99',
    period: 'for 6 months',
    savings: 'Save 33%',
    popular: true,
    features: [
      '3-day free trial',
      'Everything in Monthly',
      'Best value option',
      'Cancel anytime',
    ],
  },
  {
    id: 'premium_annual',
    name: 'Premium Annual',
    price: '$79.99',
    period: 'per year',
    savings: 'Save 47%',
    features: [
      '3-day free trial',
      'Everything in Monthly',
      'Lowest price per month',
      'Cancel anytime',
    ],
  },
];

/** Display order: Cram → Monthly → 6 Months → Yearly */
function planSortKey(identifier: string): number {
  return getPlanRank(identifier);
}

function isCramPlanId(identifier: string | undefined): boolean {
  if (!identifier) return false;
  const id = identifier.toLowerCase();
  return id.includes('cram') || id.includes('weekly') || id === '$rc_weekly';
}

function findStaticPlan(
  identifier: string,
  productIdentifier?: string
): SubscriptionPlan | undefined {
  return PLANS.find(
    (p) =>
      p.id === identifier ||
      p.id === productIdentifier ||
      identifier.toLowerCase().includes(p.id) ||
      (productIdentifier || '').toLowerCase().includes(p.id)
  );
}

interface PaywallScreenProps {
  feature?: string;
  onClose?: () => void;
  showFreeTrial?: boolean;
}

export default function PaywallScreen({ 
  feature, 
  onClose,
  showFreeTrial = true
}: PaywallScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const requireAuth = useRequireAuth();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { offerings, isPurchasing, isLoading, error } = useSelector((state: RootState) => state.subscription);
  
  const [selectedPlan, setSelectedPlan] = useState<string>('premium_semi_annual');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const purchasesAvailable = isRevenueCatAvailable();
  const purchasesConfigured = isRevenueCatConfigured();
  const routeParams = route.params as PaywallScreenProps | undefined;
  const requestedFeature = feature || routeParams?.feature;
  // Trial messaging is on by default for monthly / 6-month / annual (not Cram Time).
  const trialEnabled = routeParams?.showFreeTrial ?? showFreeTrial;

  // Fetch offerings on mount
  useEffect(() => {
    if (purchasesConfigured) {
      dispatch(fetchOfferings());
    }
  }, [dispatch, purchasesConfigured]);

  const currentTier = user?.subscriptionTier || 'free';
  const expiresAt = user?.subscriptionExpiresAt;
  const isSubscriber = userHasActivePremium(user);
  const ended = planHasEnded(currentTier, expiresAt);
  const endedOn = formatSubscriptionEndDate(expiresAt);

  // Map RevenueCat packages to plans when offerings are loaded
  useEffect(() => {
    if (offerings?.current) {
      const availablePackages = [...offerings.current.availablePackages].sort(
        (a, b) =>
          planSortKey(a.product.identifier || a.identifier) -
          planSortKey(b.product.identifier || b.identifier)
      );
      setPackages(availablePackages);

      if (availablePackages.length === 0) return;

      // Prefer first upgrade option when already subscribed; otherwise most popular
      const currentRank = getPlanRank(currentTier);
      const upgrade = availablePackages.find(
        (pkg) =>
          getPlanRank(pkg.product.identifier || pkg.identifier) > currentRank
      );
      const semiAnnual = availablePackages.find(
        (pkg) =>
          pkg.identifier.includes('semi_annual') ||
          pkg.identifier.includes('six_month') ||
          pkg.product.identifier === 'premium_semi_annual'
      );
      const fallback = availablePackages.find(
        (pkg) =>
          !matchesSubscriptionTier(pkg.product.identifier, currentTier, expiresAt) &&
          !matchesSubscriptionTier(pkg.identifier, currentTier, expiresAt)
      );

      const initial =
        upgrade ||
        (!isSubscriber ? semiAnnual : undefined) ||
        fallback ||
        availablePackages[0];
      setSelectedPlan(initial.identifier);
    }
  }, [offerings, currentTier, expiresAt, isSubscriber]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const findPackageForPlan = (planId: string): PurchasesPackage | undefined => {
    const direct = packages.find(
      (pkg) =>
        pkg.identifier === planId ||
        pkg.product.identifier === planId
    );
    if (direct) return direct;

    // Map static plan ids / RC package ids to products
    return packages.find((pkg) => {
      const ids = [pkg.identifier, pkg.product.identifier].map((id) =>
        id.toLowerCase()
      );
      const target = planId.toLowerCase();
      if (ids.some((id) => id.includes(target) || target.includes(id))) {
        return true;
      }
      if (isCramPlanId(planId) && ids.some((id) => isCramPlanId(id))) {
        return true;
      }
      if (
        (target.includes('semi') || target.includes('six_month')) &&
        ids.some((id) => id.includes('semi') || id.includes('six_month'))
      ) {
        return true;
      }
      if (
        (target.includes('annual') || target.includes('yearly')) &&
        ids.some((id) => id.includes('annual') || id.includes('yearly'))
      ) {
        return true;
      }
      if (
        target.includes('monthly') &&
        ids.some((id) => id.includes('monthly'))
      ) {
        return true;
      }
      return false;
    });
  };

  const isCurrentPackage = (pkg: PurchasesPackage) =>
    matchesSubscriptionTier(pkg.product.identifier, currentTier, expiresAt) ||
    matchesSubscriptionTier(pkg.identifier, currentTier, expiresAt);

  const isCurrentStaticPlan = (planId: string) =>
    matchesSubscriptionTier(planId, currentTier, expiresAt);

  const handleSubscribe = async (planId: string) => {
    if (!acceptTerms) {
      Alert.alert(
        'Terms Required',
        'Please check the box to agree to the Terms of Service, then try again.'
      );
      return;
    }

    if (!requireAuth('paywall')) return;

    const packageToPurchase = findPackageForPlan(planId);
    if (
      (packageToPurchase && isCurrentPackage(packageToPurchase)) ||
      (!packageToPurchase && isCurrentStaticPlan(planId))
    ) {
      Alert.alert(
        'Already on this plan',
        'Choose a different plan to upgrade or downgrade.'
      );
      return;
    }

    if (!purchasesAvailable) {
      Alert.alert(
        'Development Build Required',
        'In-app purchases cannot run in Expo Go. Open this screen in an iOS or Android development build to test a purchase.'
      );
      return;
    }

    if (!purchasesConfigured) {
      Alert.alert(
        'RevenueCat Setup Required',
        'Add a RevenueCat public SDK key to mobile/.env, then restart the development server.'
      );
      return;
    }

    try {
      if (!packageToPurchase) {
        Alert.alert(
          'Plan Unavailable',
          packages.length === 0
            ? 'Subscription plans could not be loaded from the App Store. Check your connection and try again.'
            : 'That plan is not available right now. Select another plan and try again.'
        );
        return;
      }

      await dispatch(purchaseSubscription(packageToPurchase)).unwrap();
      // Webhook can lag a few seconds behind StoreKit — poll before treating backend as source of truth.
      for (let attempt = 0; attempt < 5; attempt++) {
        await new Promise((r) => setTimeout(r, attempt === 0 ? 800 : 1500));
        try {
          const result = await dispatch(syncSubscription()).unwrap();
          if (result?.subscriptionTier && result.subscriptionTier !== 'free') {
            break;
          }
        } catch {
          // keep local RC-applied tier if backend has not caught up yet
        }
      }

      Alert.alert(
        'Success!',
        isSubscriber
          ? 'Your plan has been updated.'
          : 'Your subscription has been activated. Enjoy premium features!',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose?.();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      if (error.message && error.message.includes('cancelled')) {
        // User cancelled, don't show error
        return;
      }
      Alert.alert('Purchase Failed', getApiErrorMessage(error, 'Failed to complete purchase. Please try again.'));
    }
  };

  const handleStartFreeTrial = async () => {
    // Free trial is an App Store intro offer on the selected package.
    await handleSubscribe(selectedPlan);
  };

  const handleRestorePurchases = async () => {
    if (!requireAuth('paywall')) return;
    if (!purchasesAvailable) {
      Alert.alert(
        'Development Build Required',
        'Purchase restoration is available in iOS and Android development or production builds.'
      );
      return;
    }

    if (!purchasesConfigured) {
      Alert.alert(
        'RevenueCat Setup Required',
        'Add a RevenueCat public SDK key to mobile/.env, then restart the development server.'
      );
      return;
    }

    try {
      await dispatch(restoreSubscription()).unwrap();
      Alert.alert('Success', 'Your purchases have been restored.');
    } catch (error: any) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to restore purchases.'));
    }
  };

  // Get display info for a package
  const getPackageInfo = (pkg: PurchasesPackage) => {
    const product = pkg.product;
    const price = product.priceString || '$0.00';
    const title = product.title || 'Premium';
    const description = product.description || '';
    
    return { price, title, description };
  };

  const getFeatureMessage = () => {
    if (!requestedFeature) return 'Unlock Premium Features';
    
    const messages: Record<string, string> = {
      'mock_exams': 'Unlock Unlimited Mock Exams',
      'unlimited_questions': 'Unlock Unlimited Practice Questions',
      'bookmarks': 'Unlock Bookmark Feature',
      'missed_questions': 'Unlock Missed Questions Review',
      'advanced_analytics': 'Unlock Advanced Analytics',
      'domain_practice': 'Unlock Domain Practice',
    };
    
    return messages[requestedFeature] || 'Unlock Premium Features';
  };

  const selectedPackage = packages.find(
    (pkg) =>
      pkg.identifier === selectedPlan ||
      pkg.product.identifier === selectedPlan
  );
  const selectedStaticPlan =
    findStaticPlan(
      selectedPlan,
      selectedPackage?.product.identifier
    ) || PLANS.find((plan) => plan.id === selectedPlan);
  const selectedPlanPriceLabel = selectedPackage
    ? `${selectedPackage.product.priceString} ${selectedStaticPlan?.period || 'per billing period'}`
    : selectedStaticPlan
      ? `${selectedStaticPlan.price} ${selectedStaticPlan.period}`
      : 'the selected plan price';

  const selectedIsCram =
    isCramPlanId(selectedPlan) ||
    isCramPlanId(selectedPackage?.product.identifier) ||
    selectedStaticPlan?.id === 'cram_time';
  const selectedIsCurrent = selectedPackage
    ? isCurrentPackage(selectedPackage)
    : isCurrentStaticPlan(selectedPlan);
  const selectedRank = getPlanRank(
    selectedPackage?.product.identifier || selectedPlan
  );
  const currentRank = getPlanRank(currentTier);
  const showTrialForSelection =
    trialEnabled && !selectedIsCram && !isSubscriber;
  const sharedFeatures = [
    'Unlimited practice questions',
    'Unlimited mock exams',
    'Bookmarks & missed questions',
    'Advanced analytics',
    'Cancel anytime',
  ];

  const ctaLabel = (() => {
    if (selectedIsCurrent) return 'Current Plan';
    if (!isSubscriber) {
      return showTrialForSelection ? 'Start 3-Day Free Trial' : 'Subscribe Now';
    }
    const name = selectedStaticPlan?.name || 'this plan';
    if (selectedRank > currentRank) return `Upgrade to ${name}`;
    if (selectedRank < currentRank) return `Switch to ${name}`;
    return `Change to ${name}`;
  })();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose || (() => navigation.goBack())}
            style={styles.closeButton}
          >
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Icon name="crown" size={48} color={colors.primary} style={styles.crownIcon} />
          <Text variant="headlineMedium" style={styles.title}>
            {getFeatureMessage()}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Get unlimited access to practice, exams, review tools, and analytics.
          </Text>
          <View style={styles.trialBadgeRow}>
            {showTrialForSelection && (
              <View style={styles.trialBadge}>
                <Icon name="gift-outline" size={16} color={colors.primary} />
                <Text variant="labelMedium" style={styles.trialBadgeText}>
                  3-day free trial
                </Text>
              </View>
            )}
            <View style={styles.trialBadge}>
              <Icon name="close-circle-outline" size={16} color={colors.primary} />
              <Text variant="labelMedium" style={styles.trialBadgeText}>
                Cancel anytime
              </Text>
            </View>
          </View>
        </View>

        {isSubscriber && (
          <View style={styles.currentPlanBanner}>
            <Icon name="check-decagram" size={18} color={colors.primary} />
            <Text variant="bodyMedium" style={styles.currentPlanBannerText}>
              Current plan: {getSubscriptionDisplayName(currentTier)}
            </Text>
          </View>
        )}

        {ended && (
          <View style={styles.currentPlanBanner}>
            <Icon name="alert-circle-outline" size={18} color={colors.error} />
            <Text variant="bodyMedium" style={styles.currentPlanBannerText}>
              {getSubscriptionDisplayName(currentTier)} ended
              {endedOn ? ` on ${endedOn}` : ''}. Choose a plan to renew.
            </Text>
          </View>
        )}

        {/* Subscription Plans — compact rows, no radio buttons */}
        <View style={styles.plansContainer}>
          {isLoading && packages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="bodyMedium" style={styles.loadingText}>
                Loading subscription plans...
              </Text>
            </View>
          ) : packages.length > 0 ? (
            packages.map((pkg) => {
              const packageInfo = getPackageInfo(pkg);
              const isSelected = selectedPlan === pkg.identifier;
              const isCurrent = isCurrentPackage(pkg);
              const isPopular =
                pkg.identifier.includes('semi_annual') ||
                pkg.identifier.includes('six_month') ||
                pkg.product.identifier === 'premium_semi_annual';
              const staticPlan = findStaticPlan(
                pkg.identifier,
                pkg.product.identifier
              );
              const showPlanTrial =
                trialEnabled &&
                !isCramPlanId(pkg.identifier) &&
                !isCramPlanId(pkg.product.identifier);

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan(pkg.identifier)}
                  style={[
                    styles.planRow,
                    isSelected && styles.planRowSelected,
                    isCurrent && styles.planRowCurrent,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.planRowLeft}>
                    <View style={styles.planTitleRow}>
                      <Text
                        variant="titleMedium"
                        style={styles.planName}
                        numberOfLines={1}
                      >
                        {staticPlan?.name || packageInfo.title}
                      </Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}
                      {!isCurrent && isPopular && (
                        <View style={styles.popularInlineBadge}>
                          <Text style={styles.popularInlineBadgeText}>
                            POPULAR
                          </Text>
                        </View>
                      )}
                    </View>
                    {staticPlan?.savings ? (
                      <Text variant="labelSmall" style={styles.savingsText}>
                        {staticPlan.savings}
                      </Text>
                    ) : null}
                    {showPlanTrial ? (
                      <Text variant="labelSmall" style={styles.trialLine}>
                        3-day free trial
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.planRowRight}>
                    <Text variant="titleMedium" style={styles.planPrice}>
                      {packageInfo.price}
                    </Text>
                    <Text variant="bodySmall" style={styles.planPeriod}>
                      {staticPlan?.period || ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isCurrent = isCurrentStaticPlan(plan.id);
              const showPlanTrial =
                trialEnabled && !isCramPlanId(plan.id);
              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan(plan.id)}
                  style={[
                    styles.planRow,
                    isSelected && styles.planRowSelected,
                    isCurrent && styles.planRowCurrent,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.planRowLeft}>
                    <View style={styles.planTitleRow}>
                      <Text
                        variant="titleMedium"
                        style={styles.planName}
                        numberOfLines={1}
                      >
                        {plan.name}
                      </Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}
                      {!isCurrent && plan.popular && (
                        <View style={styles.popularInlineBadge}>
                          <Text style={styles.popularInlineBadgeText}>
                            POPULAR
                          </Text>
                        </View>
                      )}
                    </View>
                    {plan.savings ? (
                      <Text variant="labelSmall" style={styles.savingsText}>
                        {plan.savings}
                      </Text>
                    ) : null}
                    {showPlanTrial ? (
                      <Text variant="labelSmall" style={styles.trialLine}>
                        3-day free trial
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.planRowRight}>
                    <Text variant="titleMedium" style={styles.planPrice}>
                      {plan.price}
                    </Text>
                    <Text variant="bodySmall" style={styles.planPeriod}>
                      {plan.period}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.featuresCard}>
          {sharedFeatures.map((feature) => (
            <View key={feature} style={styles.featureItem}>
              <Icon name="check-circle" size={18} color={colors.success} />
              <Text variant="bodyMedium" style={styles.featureText}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Free Trial Option — not shown for Cram Time */}
        {showTrialForSelection && (
          <Card style={styles.trialCard}>
            <Card.Content>
              <View style={styles.trialContent}>
                <Icon name="gift" size={24} color={colors.primary} />
                <View style={styles.trialText}>
                  <Text variant="titleMedium" style={styles.trialTitle}>
                    3-Day Free Trial
                  </Text>
                  <Text variant="bodySmall" style={styles.trialDescription}>
                    Try Premium free for 3 days. Cancel anytime before the trial ends and you won’t be charged. After that, {selectedPlanPriceLabel}.
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Terms Checkbox — clear bordered box + whole row tappable */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setAcceptTerms(!acceptTerms)}
          style={[
            styles.termsContainer,
            acceptTerms && styles.termsContainerChecked,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptTerms }}
        >
          <View
            style={[
              styles.checkboxBox,
              acceptTerms && styles.checkboxBoxChecked,
            ]}
          >
            {acceptTerms ? (
              <Icon name="check" size={16} color={colors.white} />
            ) : null}
          </View>
          <View style={styles.termsTextWrap}>
            <Text variant="labelLarge" style={styles.termsTitle}>
              I agree to the Terms
            </Text>
            <Text variant="bodySmall" style={styles.termsText}>
              <Text
                style={styles.legalLink}
                onPress={() => openExternalUrl(termsOfUseUrl())}
              >
                Terms of Use
              </Text>
              {' and '}
              <Text
                style={styles.legalLink}
                onPress={() => openExternalUrl(privacyPolicyUrl())}
              >
                Privacy Policy
              </Text>
              {showTrialForSelection
                ? '. Includes a 3-day free trial; then auto-renews unless cancelled at least 24 hours before the period ends. Cancel anytime in App Store settings.'
                : '. Subscription auto-renews unless cancelled at least 24 hours before the period ends. Cancel anytime in App Store settings.'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* CTA — one spinner only; current plan cannot be purchased again */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={
              selectedIsCurrent
                ? undefined
                : showTrialForSelection
                  ? handleStartFreeTrial
                  : () => handleSubscribe(selectedPlan)
            }
            disabled={isPurchasing || selectedIsCurrent}
            style={[
              styles.subscribeButton,
              selectedIsCurrent && styles.subscribeButtonCurrent,
              !acceptTerms && !selectedIsCurrent && styles.subscribeButtonNeedsTerms,
              isPurchasing && styles.subscribeButtonBusy,
            ]}
            accessibilityRole="button"
            accessibilityState={{
              busy: isPurchasing,
              disabled: selectedIsCurrent,
            }}
          >
            {isPurchasing ? (
              <View style={styles.subscribeButtonInner}>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={styles.buttonLabel}>Processing...</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.buttonLabel,
                  selectedIsCurrent && styles.buttonLabelCurrent,
                ]}
              >
                {ctaLabel}
              </Text>
            )}
          </TouchableOpacity>
          <Text variant="bodySmall" style={styles.ctaHint}>
            {selectedIsCurrent
              ? 'Select another plan to upgrade or downgrade'
              : showTrialForSelection
                ? 'No charge today · Cancel anytime · Auto-renews after trial'
                : isSubscriber
                  ? 'Changes are handled by the App Store · Cancel anytime'
                  : selectedIsCram
                    ? 'Billed weekly · Cancel anytime'
                    : 'Billed after selection · Cancel anytime'}
          </Text>
          <Button
            mode="text"
            onPress={handleRestorePurchases}
            style={styles.restoreButton}
            disabled={isPurchasing}
          >
            Restore Purchases
          </Button>
          <View style={styles.legalLinksRow}>
            <Text
              variant="bodySmall"
              style={styles.legalLink}
              onPress={() => openExternalUrl(termsOfUseUrl())}
            >
              Terms of Use
            </Text>
            <Text variant="bodySmall" style={styles.legalSeparator}>·</Text>
            <Text
              variant="bodySmall"
              style={styles.legalLink}
              onPress={() => openExternalUrl(privacyPolicyUrl())}
            >
              Privacy Policy
            </Text>
            <Text variant="bodySmall" style={styles.legalSeparator}>·</Text>
            <Text
              variant="bodySmall"
              style={styles.legalLink}
              onPress={() => openExternalUrl(APPLE_EULA_URL)}
            >
              EULA
            </Text>
          </View>
          <Button
            mode="text"
            onPress={onClose || (() => navigation.goBack())}
            style={styles.cancelButton}
            disabled={isPurchasing}
          >
            Maybe Later
          </Button>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustIndicators}>
          {showTrialForSelection ? (
            <View style={styles.trustItem}>
              <Icon name="gift" size={20} color={colors.success} />
              <Text variant="bodySmall" style={styles.trustText}>
                3-Day Free Trial
              </Text>
            </View>
          ) : (
            <View style={styles.trustItem}>
              <Icon name="lightning-bolt" size={20} color={colors.success} />
              <Text variant="bodySmall" style={styles.trustText}>
                Instant Access
              </Text>
            </View>
          )}
          <View style={styles.trustItem}>
            <Icon name="cancel" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.trustText}>
              Cancel Anytime
            </Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="shield-check" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.trustText}>
              Secure Payment
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  trialBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  trialBadgeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  ctaHint: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: -spacing.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: spacing.sm,
  },
  crownIcon: {
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  socialProofCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  socialProofRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  currentPlanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: `${colors.primary}12`,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  currentPlanBannerText: {
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  plansContainer: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    minHeight: 72,
  },
  planRowSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: `${colors.primary}08`,
  },
  planRowCurrent: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}14`,
  },
  planRowLeft: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  planName: {
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  planRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: 88,
  },
  planPrice: {
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  planPeriod: {
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
  savingsText: {
    color: colors.success,
    fontWeight: '600',
  },
  trialLine: {
    color: colors.primary,
    fontWeight: '600',
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  currentBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  popularInlineBadge: {
    backgroundColor: colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  popularInlineBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  featuresCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    flex: 1,
    color: colors.text,
  },
  subscribeButtonCurrent: {
    backgroundColor: colors.gray200,
  },
  buttonLabelCurrent: {
    color: colors.textSecondary,
  },
  trialCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  trialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trialText: {
    flex: 1,
  },
  trialTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  trialDescription: {
    color: colors.textSecondary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  termsContainerChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.gray50,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray500,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: colors.white,
  },
  checkboxBoxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  termsTextWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  termsTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  termsText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  trialButton: {
    backgroundColor: colors.success,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  subscribeButtonNeedsTerms: {
    opacity: 0.85,
  },
  subscribeButtonBusy: {
    opacity: 0.9,
  },
  subscribeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  restoreButton: {
    marginTop: spacing.xs,
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legalLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  legalSeparator: {
    color: colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trustText: {
    color: colors.textSecondary,
  },
});
