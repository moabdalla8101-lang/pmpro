import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { List, Divider, Avatar, Switch, Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { ActionButton, SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

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
          <Divider />
          <List.Item
            title="Daily Goal"
            description="Questions to complete per day"
            left={(props) => <List.Icon {...props} icon="target" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => {}}
          />
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
  logoutContainer: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
});
