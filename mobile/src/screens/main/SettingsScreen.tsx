import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title={user?.email}
          description="Email"
          left={(props) => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title={user?.subscriptionTier || 'Free'}
          description="Subscription"
          left={(props) => <List.Icon {...props} icon="credit-card" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Manage notification settings"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Support</List.Subheader>
        <List.Item
          title="Help & FAQ"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Contact Support"
          left={(props) => <List.Icon {...props} icon="email" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <View style={styles.logoutContainer}>
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
});


