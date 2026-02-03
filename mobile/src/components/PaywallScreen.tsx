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
import { Card, Text, Button, Divider, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import Purchases from 'react-native-purchases';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';
import { getSubscriptionDisplayName } from '../utils/subscriptionUtils';
import { fetchOfferings, purchaseSubscription, restoreSubscription } from '../store/slices/subscriptionSlice';
import { loadUser } from '../store/slices/authSlice';

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
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: '$12.49',
    period: 'per month',
    features: [
      'Unlimited practice questions',
      'Unlimited mock exams',
      'Bookmarked questions',
      'Missed questions review',
      'Advanced analytics',
      'Priority support',
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
      'Everything in Monthly',
      'Lowest price per month',
      'Cancel anytime',
    ],
  },
  {
    id: 'cram_time',
    name: 'Cram Time',
    price: '$9.99',
    period: 'per week',
    features: [
      'Perfect for last-minute prep',
      'Full premium access',
      '7-day access',
    ],
  },
];

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
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { offerings, isPurchasing, isLoading, error } = useSelector((state: RootState) => state.subscription);
  
  const [selectedPlan, setSelectedPlan] = useState<string>('premium_semi_annual');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [packages, setPackages] = useState<Purchases.Package[]>([]);

  // Fetch offerings on mount
  useEffect(() => {
    dispatch(fetchOfferings());
  }, [dispatch]);

  // Map RevenueCat packages to plans when offerings are loaded
  useEffect(() => {
    if (offerings?.current) {
      const availablePackages = offerings.current.availablePackages;
      setPackages(availablePackages);
      
      // Set default selected plan to the first available package or most popular
      if (availablePackages.length > 0) {
        const semiAnnualPackage = availablePackages.find(pkg => 
          pkg.identifier.includes('semi_annual') || pkg.identifier.includes('6months')
        );
        if (semiAnnualPackage) {
          setSelectedPlan(semiAnnualPackage.identifier);
        } else {
          setSelectedPlan(availablePackages[0].identifier);
        }
      }
    }
  }, [offerings]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleSubscribe = async (planId: string) => {
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions to continue.');
      return;
    }

    try {
      // Find the package by identifier
      const packageToPurchase = packages.find(pkg => 
        pkg.identifier === planId || 
        pkg.storeProduct.identifier === planId ||
        pkg.storeProduct.productIdentifier === planId
      );

      if (!packageToPurchase) {
        Alert.alert('Error', 'Selected plan not available. Please try again.');
        return;
      }

      // Purchase the package
      await dispatch(purchaseSubscription(packageToPurchase)).unwrap();
      
      // Refresh user data to get updated subscription
      await dispatch(loadUser());
      
      Alert.alert(
        'Success!',
        'Your subscription has been activated. Enjoy premium features!',
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
      Alert.alert('Purchase Failed', error.message || 'Failed to complete purchase. Please try again.');
    }
  };

  const handleStartFreeTrial = async () => {
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions to continue.');
      return;
    }

    // Free trial is handled through RevenueCat offerings
    // If a package has a free trial, it will be shown automatically
    // Just purchase the selected plan - RevenueCat will handle the trial
    await handleSubscribe(selectedPlan);
  };

  const handleRestorePurchases = async () => {
    try {
      await dispatch(restoreSubscription()).unwrap();
      await dispatch(loadUser());
      Alert.alert('Success', 'Your purchases have been restored.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to restore purchases.');
    }
  };

  // Get display info for a package
  const getPackageInfo = (pkg: Purchases.Package) => {
    const product = pkg.storeProduct;
    const price = product.priceString || product.localizedPrice || '$0.00';
    const title = product.title || product.localizedTitle || 'Premium';
    const description = product.description || product.localizedDescription || '';
    
    return { price, title, description };
  };

  const getFeatureMessage = () => {
    if (!feature) return 'Unlock Premium Features';
    
    const messages: Record<string, string> = {
      'mock_exams': 'Unlock Unlimited Mock Exams',
      'unlimited_questions': 'Unlock Unlimited Practice Questions',
      'bookmarks': 'Unlock Bookmark Feature',
      'missed_questions': 'Unlock Missed Questions Review',
      'advanced_analytics': 'Unlock Advanced Analytics',
    };
    
    return messages[feature] || 'Unlock Premium Features';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <Icon name="crown" size={48} color={colors.primary} style={styles.crownIcon} />
          <Text variant="headlineMedium" style={styles.title}>
            {getFeatureMessage()}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join thousands of PMP candidates who are acing their exams
          </Text>
        </View>

        {/* Social Proof */}
        <Card style={styles.socialProofCard}>
          <Card.Content>
            <View style={styles.socialProofRow}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>10,000+</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Active Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>85%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Pass Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>4.8★</Text>
                <Text variant="bodySmall" style={styles.statLabel}>App Rating</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Subscription Plans */}
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
              const isPopular = pkg.identifier.includes('semi_annual') || pkg.identifier.includes('6months');
              
              // Map to static plan features if available, otherwise use package info
              const staticPlan = PLANS.find(p => 
                p.id === pkg.identifier || 
                pkg.identifier.includes(p.id.replace('_', ''))
              );
              const features = staticPlan?.features || [
                'Unlimited practice questions',
                'Unlimited mock exams',
                'All premium features',
              ];
              
              return (
                <Card
                  key={pkg.identifier}
                  style={[
                    styles.planCard,
                    isPopular && styles.popularPlanCard,
                  ]}
                >
                  {isPopular && (
                    <View style={styles.popularBadge}>
                      <Text variant="labelSmall" style={styles.popularBadgeText}>
                        MOST POPULAR
                      </Text>
                    </View>
                  )}
                  <Card.Content>
                    <View style={styles.planHeader}>
                      <View>
                        <Text variant="titleLarge" style={styles.planName}>
                          {staticPlan?.name || packageInfo.title}
                        </Text>
                        <View style={styles.priceRow}>
                          <Text variant="headlineMedium" style={styles.planPrice}>
                            {packageInfo.price}
                          </Text>
                          {staticPlan?.period && (
                            <Text variant="bodyMedium" style={styles.planPeriod}>
                              {staticPlan.period}
                            </Text>
                          )}
                        </View>
                        {staticPlan?.savings && (
                          <Text variant="labelSmall" style={styles.savingsText}>
                            {staticPlan.savings}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => setSelectedPlan(pkg.identifier)}
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.featuresList}>
                      {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Icon name="check-circle" size={20} color={colors.success} />
                          <Text variant="bodyMedium" style={styles.featureText}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            // Fallback to static plans if RevenueCat packages not available
            PLANS.map((plan) => (
              <Card
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.popular && styles.popularPlanCard,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text variant="labelSmall" style={styles.popularBadgeText}>
                      MOST POPULAR
                    </Text>
                  </View>
                )}
                <Card.Content>
                  <View style={styles.planHeader}>
                    <View>
                      <Text variant="titleLarge" style={styles.planName}>
                        {plan.name}
                      </Text>
                      <View style={styles.priceRow}>
                        <Text variant="headlineMedium" style={styles.planPrice}>
                          {plan.price}
                        </Text>
                        <Text variant="bodyMedium" style={styles.planPeriod}>
                          {plan.period}
                        </Text>
                      </View>
                      {plan.savings && (
                        <Text variant="labelSmall" style={styles.savingsText}>
                          {plan.savings}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedPlan(plan.id)}
                      style={[
                        styles.radioButton,
                        selectedPlan === plan.id && styles.radioButtonSelected,
                      ]}
                    >
                      {selectedPlan === plan.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Divider style={styles.divider} />
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Icon name="check-circle" size={20} color={colors.success} />
                        <Text variant="bodyMedium" style={styles.featureText}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Free Trial Option */}
        {showFreeTrial && (
          <Card style={styles.trialCard}>
            <Card.Content>
              <View style={styles.trialContent}>
                <Icon name="gift" size={24} color={colors.primary} />
                <View style={styles.trialText}>
                  <Text variant="titleMedium" style={styles.trialTitle}>
                    Start 7-Day Free Trial
                  </Text>
                  <Text variant="bodySmall" style={styles.trialDescription}>
                    Try Premium free for 7 days, then {PLANS.find(p => p.id === selectedPlan)?.price}/{PLANS.find(p => p.id === selectedPlan)?.period}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Terms Checkbox */}
        <View style={styles.termsContainer}>
          <Checkbox
            status={acceptTerms ? 'checked' : 'unchecked'}
            onPress={() => setAcceptTerms(!acceptTerms)}
          />
          <Text variant="bodySmall" style={styles.termsText}>
            I agree to the Terms of Service and Privacy Policy. Subscription auto-renews unless cancelled.
          </Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          {showFreeTrial && (
            <Button
              mode="contained"
              onPress={handleStartFreeTrial}
              disabled={!acceptTerms}
              style={styles.trialButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Start Free Trial
            </Button>
          )}
          <Button
            mode="contained"
            onPress={() => handleSubscribe(selectedPlan)}
            disabled={!acceptTerms || isPurchasing}
            loading={isPurchasing}
            style={styles.subscribeButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {isPurchasing ? 'Processing...' : 'Subscribe Now'}
          </Button>
          <Button
            mode="text"
            onPress={handleRestorePurchases}
            style={styles.restoreButton}
            disabled={isPurchasing}
          >
            Restore Purchases
          </Button>
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
          <View style={styles.trustItem}>
            <Icon name="shield-check" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.trustText}>
              Secure Payment
            </Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="cancel" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.trustText}>
              Cancel Anytime
            </Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="refresh" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.trustText}>
              Money-Back Guarantee
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
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
    ...shadows.small,
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
  plansContainer: {
    marginBottom: spacing.lg,
  },
  planCard: {
    marginBottom: spacing.md,
    ...shadows.small,
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    zIndex: 1,
  },
  popularBadgeText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  planName: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: spacing.xs,
  },
  planPeriod: {
    color: colors.textSecondary,
  },
  savingsText: {
    color: colors.success,
    fontWeight: '600',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  divider: {
    marginVertical: spacing.md,
  },
  featuresList: {
    gap: spacing.sm,
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
  trialCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    ...shadows.small,
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
    gap: spacing.sm,
  },
  termsText: {
    flex: 1,
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
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  restoreButton: {
    marginTop: spacing.xs,
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
