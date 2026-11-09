import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { List, Divider, Avatar, Card, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Constants from 'expo-constants';
import { deleteAccount, logout, syncSubscription } from '../../store/slices/authSlice';
import { refreshCustomerInfo } from '../../store/slices/subscriptionSlice';
import { RootState, AppDispatch } from '../../store';
import { loadSettings, saveSettings, setDailyQuestionsGoal, setDailyMinutesGoal } from '../../store/slices/settingsSlice';
import { ActionButton, SectionHeader } from '../../components';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { getApiErrorMessage } from '../../utils/apiError';
import {
  formatSubscriptionEndDate,
  getSubscriptionDisplayName,
  planHasEnded,
  userHasActivePremium,
} from '../../utils/subscriptionUtils';
import { FLOATING_TAB_BAR_CONTENT_INSET } from '../../navigation/tabBarLayout';
import { formatDebugInfo } from '../../utils/debugInfo';
import { Sentry } from '../../services/sentry';
import {
  APPLE_EULA_URL,
  MANAGE_SUBSCRIPTIONS_URL,
  PMI_DISCLAIMER,
  emailSupport,
  openExternalUrl,
  privacyPolicyUrl,
  supportUrl,
  termsOfUseUrl,
} from '../../config/legal';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { dailyQuestionsGoal, dailyMinutesGoal } = useSelector((state: RootState) => state.settings);
  const [isDeleting, setIsDeleting] = useState(false);
  const [questionsInput, setQuestionsInput] = useState(dailyQuestionsGoal.toString());
  const [minutesInput, setMinutesInput] = useState(dailyMinutesGoal.toString());
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const aboutTapCount = useRef(0);
  const aboutTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadSettings() as any);
    }
  }, [dispatch, isAuthenticated]);

  // Refresh plan label after upgrades (e.g. monthly → annual).
  // Prefer backend (webhook uses new_product_id); RC may still show the old product mid-trial.
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;
      dispatch(refreshCustomerInfo()).catch(() => {});
      dispatch(syncSubscription()).catch(() => {});
    }, [dispatch, isAuthenticated])
  );

  useEffect(() => {
    setQuestionsInput(dailyQuestionsGoal.toString());
    setMinutesInput(dailyMinutesGoal.toString());
  }, [dailyQuestionsGoal, dailyMinutesGoal]);

  const handleSignIn = () => {
    (navigation as any).navigate('Auth', {
      screen: 'Login',
      params: { reason: 'settings', allowDismiss: true },
    });
  };

  const handleSaveGoals = async () => {
    if (!isAuthenticated) {
      handleSignIn();
      return;
    }

    const questions = parseInt(questionsInput, 10);
    const minutes = parseInt(minutesInput, 10);

    if (isNaN(questions) || questions < 10 || questions > 200) {
      Alert.alert('Invalid Input', 'Questions per day must be between 10 and 200');
      return;
    }

    if (isNaN(minutes) || minutes < 10 || minutes > 120) {
      Alert.alert('Invalid Input', 'Practice minutes per day must be between 10 and 120');
      return;
    }

    try {
      await dispatch(saveSettings({ dailyQuestionsGoal: questions, dailyMinutesGoal: minutes }) as any).unwrap();
      setIsEditingGoals(false);
      Alert.alert('Success', 'Daily goals updated successfully');
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to save daily goals'));
    }
  };

  const handleCancelEdit = () => {
    setQuestionsInput(dailyQuestionsGoal.toString());
    setMinutesInput(dailyMinutesGoal.toString());
    setIsEditingGoals(false);
  };

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  const performDeleteAccount = async (hadSubscription: boolean) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAccount()).unwrap();
      Alert.alert(
        'Account deleted',
        hadSubscription
          ? 'Your account and study data have been permanently deleted. Your App Store subscription is billed by Apple and was not cancelled — you can cancel it in your Apple ID settings.'
          : 'Your account and study data have been permanently deleted.',
        hadSubscription
          ? [
              { text: 'Done', style: 'cancel' },
              {
                text: 'Manage Subscription',
                onPress: () => openExternalUrl(MANAGE_SUBSCRIPTIONS_URL),
              },
            ]
          : undefined
      );
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Could not delete your account.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = () => {
    const hadSubscription = isPremium;
    Alert.alert(
      'Delete account?',
      `This permanently deletes your account, progress, exam history, bookmarks and flashcard progress. This cannot be undone.${
        hadSubscription
          ? '\n\nDeleting your account does not cancel your App Store subscription. Cancel it in your Apple ID settings to stop billing.'
          : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => performDeleteAccount(hadSubscription),
        },
      ]
    );
  };

  const handleAbout = () => {
    aboutTapCount.current += 1;
    if (aboutTapTimer.current) clearTimeout(aboutTapTimer.current);
    aboutTapTimer.current = setTimeout(() => {
      aboutTapCount.current = 0;
    }, 2000);

    if (aboutTapCount.current >= 7) {
      aboutTapCount.current = 0;
      setShowDebugPanel(true);
      return;
    }

    Alert.alert(`PMP Exam Prep ${APP_VERSION}`, PMI_DISCLAIMER);
  };

  const debugText = formatDebugInfo(user?.id);

  const handleShareDebug = async () => {
    try {
      await Share.share({ message: debugText });
    } catch {
      Alert.alert('Debug info', debugText);
    }
  };

  const handleTestSentry = () => {
    Sentry.captureMessage('Debug panel test event', 'info');
    Alert.alert('Sent', 'Test event queued for Sentry (production builds with DSN only).');
  };

  const subscriptionTier = user?.subscriptionTier || 'Free';
  const isPremium = userHasActivePremium(user);
  const ended = planHasEnded(subscriptionTier, user?.subscriptionExpiresAt);
  const endedOn = formatSubscriptionEndDate(user?.subscriptionExpiresAt);
  const planName = getSubscriptionDisplayName(subscriptionTier);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <SectionHeader title="Account" icon="account-circle" />
        <Card style={styles.card}>
          {isAuthenticated ? (
            <View>
              <Card.Content style={styles.accountContent}>
                <Avatar.Text
                  size={64}
                  label={user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  style={[styles.avatar, { backgroundColor: colors.primary }]}
                />
                <View style={styles.accountInfo}>
                  <Text variant="titleLarge" style={styles.accountName}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text variant="bodyMedium" style={styles.accountEmail}>
                    {user?.email}
                  </Text>
                  <View style={styles.subscriptionBadge}>
                    <View
                      style={[
                        styles.subscriptionDot,
                        { backgroundColor: ended ? colors.error : isPremium ? colors.primary : colors.gray500 },
                      ]}
                    />
                    <Text
                      variant="labelMedium"
                      style={[
                        styles.subscriptionText,
                        { color: ended ? colors.error : isPremium ? colors.primary : colors.gray500 },
                      ]}
                    >
                      {ended ? `${planName} ended` : isPremium ? planName : 'Free'}
                    </Text>
                  </View>
                  {ended ? (
                    <Text variant="bodySmall" style={styles.planEndedText}>
                      {endedOn
                        ? `Your plan ended on ${endedOn}. The full question bank is locked until you renew.`
                        : 'Your plan has ended. The full question bank is locked until you renew.'}
                    </Text>
                  ) : null}
                </View>
              </Card.Content>
              <Button
                mode={isPremium ? 'outlined' : 'contained'}
                icon={isPremium ? 'crown' : 'arrow-up-circle'}
                onPress={() => (navigation as any).navigate('Paywall')}
                style={styles.upgradeButton}
                buttonColor={isPremium ? undefined : colors.primary}
              >
                {isPremium ? 'View Subscription' : ended ? 'Renew plan' : 'Upgrade to Premium'}
              </Button>
            </View>
          ) : (
            <View>
              <Card.Content style={styles.accountContent}>
                <Avatar.Text
                  size={64}
                  label="G"
                  style={[styles.avatar, { backgroundColor: colors.gray400 }]}
                />
                <View style={styles.accountInfo}>
                  <Text variant="titleLarge" style={styles.accountName}>
                    Guest
                  </Text>
                  <Text variant="bodyMedium" style={styles.accountEmail}>
                    Browse freely. Sign in to save progress.
                  </Text>
                </View>
              </Card.Content>
              <Button
                mode="contained"
                icon="login"
                onPress={handleSignIn}
                style={styles.upgradeButton}
                buttonColor={colors.primary}
              >
                Sign In
              </Button>
            </View>
          )}
        </Card>

        {/* Daily Goals Settings */}
        <SectionHeader title="Daily Goals" icon="target" />
        <Card style={styles.card}>
          <Card.Content style={styles.goalsContent}>
            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Icon name="help-circle" size={24} color={colors.primary} style={styles.goalIcon} />
                <View style={styles.goalTextContainer}>
                  <Text variant="titleMedium" style={styles.goalTitle}>
                    Questions per day
                  </Text>
                  <Text variant="bodySmall" style={styles.goalDescription}>
                    Target number of questions to answer daily (10-200)
                  </Text>
                </View>
              </View>
              {isEditingGoals ? (
                <TextInput
                  style={styles.goalInput}
                  value={questionsInput}
                  onChangeText={setQuestionsInput}
                  keyboardType="numeric"
                  placeholder="50"
                />
              ) : (
                <View style={styles.goalValueContainer}>
                  <Text variant="headlineSmall" style={styles.goalValue}>
                    {dailyQuestionsGoal}
                  </Text>
                  <Text variant="bodySmall" style={styles.goalUnit}>questions</Text>
                </View>
              )}
            </View>

            <Divider style={styles.goalDivider} />

            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Icon name="clock-outline" size={24} color={colors.primary} style={styles.goalIcon} />
                <View style={styles.goalTextContainer}>
                  <Text variant="titleMedium" style={styles.goalTitle}>
                    Practice minutes per day
                  </Text>
                  <Text variant="bodySmall" style={styles.goalDescription}>
                    Target minutes of practice time daily (10-120)
                  </Text>
                </View>
              </View>
              {isEditingGoals ? (
                <TextInput
                  style={styles.goalInput}
                  value={minutesInput}
                  onChangeText={setMinutesInput}
                  keyboardType="numeric"
                  placeholder="30"
                />
              ) : (
                <View style={styles.goalValueContainer}>
                  <Text variant="headlineSmall" style={styles.goalValue}>
                    {dailyMinutesGoal}
                  </Text>
                  <Text variant="bodySmall" style={styles.goalUnit}>minutes</Text>
                </View>
              )}
            </View>

            {isAuthenticated ? (
              isEditingGoals ? (
                <View style={styles.goalActions}>
                  <Button
                    mode="outlined"
                    onPress={handleCancelEdit}
                    style={styles.goalButton}
                    textColor={colors.textSecondary}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSaveGoals}
                    style={[styles.goalButton, styles.goalButtonPrimary]}
                    buttonColor={colors.primary}
                  >
                    Save
                  </Button>
                </View>
              ) : (
                <Button
                  mode="outlined"
                  onPress={() => setIsEditingGoals(true)}
                  style={styles.editButton}
                  icon="pencil"
                  textColor={colors.primary}
                >
                  Edit Goals
                </Button>
              )
            ) : (
              <Button
                mode="outlined"
                onPress={handleSignIn}
                style={styles.editButton}
                icon="login"
                textColor={colors.primary}
              >
                Sign in to sync goals
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Support Section */}
        <SectionHeader title="Support" icon="help-circle" />
        <Card style={styles.card}>
          <List.Item
            title="Help & FAQ"
            description="Get answers to common questions"
            left={(props) => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => openExternalUrl(supportUrl())}
          />
          <Divider />
          <List.Item
            title="Contact Support"
            description="Email our team"
            left={(props) => <List.Icon {...props} icon="email" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={emailSupport}
          />
          <Divider />
          <List.Item
            title="About"
            description={`Version ${APP_VERSION}`}
            left={(props) => <List.Icon {...props} icon="information" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={handleAbout}
          />
        </Card>

        {showDebugPanel && (
          <>
            <SectionHeader title="Debug" icon="bug" />
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="bodySmall" style={styles.debugText}>
                  {debugText}
                </Text>
                <View style={styles.debugActions}>
                  <Button mode="outlined" onPress={handleShareDebug} icon="share-variant">
                    Share
                  </Button>
                  <Button mode="outlined" onPress={handleTestSentry} icon="send">
                    Test Sentry
                  </Button>
                  <Button mode="text" onPress={() => setShowDebugPanel(false)}>
                    Hide
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </>
        )}

        {/* Legal Section */}
        <SectionHeader title="Legal" icon="file-document-outline" />
        <Card style={styles.card}>
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            style={styles.listItem}
            onPress={() => openExternalUrl(privacyPolicyUrl())}
          />
          <Divider />
          <List.Item
            title="Terms of Use"
            left={(props) => <List.Icon {...props} icon="file-document" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            style={styles.listItem}
            onPress={() => openExternalUrl(termsOfUseUrl())}
          />
          <Divider />
          <List.Item
            title="License Agreement (EULA)"
            left={(props) => <List.Icon {...props} icon="scale-balance" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            style={styles.listItem}
            onPress={() => openExternalUrl(APPLE_EULA_URL)}
          />
        </Card>

        {isAuthenticated && (
          <View style={styles.logoutContainer}>
            <ActionButton
              label="Sign Out"
              onPress={handleLogout}
              icon="logout"
              variant="outlined"
              size="medium"
              fullWidth
            />
            <Button
              mode="text"
              icon="delete-outline"
              textColor={colors.error}
              onPress={handleDeleteAccount}
              loading={isDeleting}
              disabled={isDeleting}
              style={styles.deleteButton}
            >
              Delete Account
            </Button>
          </View>
        )}

        <Text variant="bodySmall" style={styles.disclaimer}>
          {PMI_DISCLAIMER}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: FLOATING_TAB_BAR_CONTENT_INSET,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  upgradeButton: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  avatar: {
    marginRight: spacing.base,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  accountEmail: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.pill,
  },
  subscriptionDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
  planEndedText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  subscriptionText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listItem: {
    paddingVertical: spacing.sm,
  },
  goalsContent: {
    padding: spacing.base,
  },
  goalItem: {
    marginBottom: spacing.base,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  goalIcon: {
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  goalDescription: {
    color: colors.textSecondary,
  },
  goalValueContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  goalValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  goalUnit: {
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  goalDivider: {
    marginVertical: spacing.base,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  goalButton: {
    flex: 1,
  },
  goalButtonPrimary: {
    marginLeft: spacing.sm,
  },
  editButton: {
    marginTop: spacing.base,
    borderColor: colors.primary,
  },
  logoutContainer: {
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  deleteButton: {
    marginTop: spacing.sm,
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  debugText: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  debugActions: {
    gap: spacing.sm,
  },
});
