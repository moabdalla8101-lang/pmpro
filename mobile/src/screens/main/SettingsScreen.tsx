import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { List, Divider, Avatar, Switch, Card, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { loadSettings, saveSettings, setDailyQuestionsGoal, setDailyMinutesGoal } from '../../store/slices/settingsSlice';
import { ActionButton, SectionHeader } from '../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dailyQuestionsGoal, dailyMinutesGoal } = useSelector((state: RootState) => state.settings);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [questionsInput, setQuestionsInput] = useState(dailyQuestionsGoal.toString());
  const [minutesInput, setMinutesInput] = useState(dailyMinutesGoal.toString());
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    dispatch(loadSettings() as any);
  }, [dispatch]);

  useEffect(() => {
    setQuestionsInput(dailyQuestionsGoal.toString());
    setMinutesInput(dailyMinutesGoal.toString());
  }, [dailyQuestionsGoal, dailyMinutesGoal]);

  const handleSaveGoals = async () => {
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
      Alert.alert('Error', 'Failed to save daily goals');
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

  const getSubscriptionColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'premium':
        return colors.primary;
      case 'pro':
        return colors.warning;
      default:
        return colors.gray500;
    }
  };

  const subscriptionTier = user?.subscriptionTier || 'Free';

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
                <View style={[styles.subscriptionDot, { backgroundColor: getSubscriptionColor(subscriptionTier) }]} />
                <Text variant="labelMedium" style={[styles.subscriptionText, { color: getSubscriptionColor(subscriptionTier) }]}>
                  {subscriptionTier}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" icon="tune" />
        <Card style={styles.card}>
          <List.Item
            title="Notifications"
            description="Receive push notifications for daily quizzes and updates"
            left={(props) => <List.Icon {...props} icon="bell" color={colors.primary} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={colors.primary}
              />
            )}
            style={styles.listItem}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />}
            right={() => (
              <Switch
                value={false}
                onValueChange={() => {}}
                color={colors.primary}
              />
            )}
            style={styles.listItem}
          />
        </Card>

        {/* Study Settings */}
        <SectionHeader title="Study Settings" icon="book-open-variant" />
        <Card style={styles.card}>
          <List.Item
            title="Difficulty Level"
            description="Default difficulty for practice questions"
            left={(props) => <List.Icon {...props} icon="gauge" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => {}}
          />
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

            {isEditingGoals ? (
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
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Contact Support"
            description="Get help from our team"
            left={(props) => <List.Icon {...props} icon="email" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => {}}
          />
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <ActionButton
            label="Sign Out"
            onPress={handleLogout}
            icon="logout"
            variant="outlined"
            size="medium"
            fullWidth
          />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
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
    marginBottom: spacing.xl,
  },
});
