import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader, ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DOMAINS = [
  { id: 'People', name: 'People', color: colors.domain.people, icon: 'account-group' },
  { id: 'Process', name: 'Process', color: colors.domain.process, icon: 'cog' },
  { id: 'Business', name: 'Business', color: colors.domain.business, icon: 'briefcase' },
];

export default function DomainFilterScreen() {
  const navigation = useNavigation();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomain(selectedDomain === domainId ? null : domainId);
  };

  const handleStartPractice = () => {
    if (selectedDomain) {
      (navigation as any).navigate('Practice', {
        screen: 'PracticeList',
        params: { domain: selectedDomain },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Select Domain"
          subtitle="Choose a PMP domain to practice"
          icon="view-grid"
        />

        <View style={styles.domainsContainer}>
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.id;

            return (
              <TouchableOpacity
                key={domain.id}
                onPress={() => handleSelectDomain(domain.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.domainCard,
                    isSelected && { borderColor: domain.color, borderWidth: 2 },
                  ]}
                >
                  <Card.Content style={styles.domainCardContent}>
                    <View style={styles.domainContent}>
                      <View style={styles.domainLeft}>
                        <View
                          style={[
                            styles.domainIconCircle,
                            { backgroundColor: isSelected ? domain.color : `${domain.color}20` },
                          ]}
                        >
                          <Icon
                            name={domain.icon}
                            size={24}
                            color={isSelected ? '#FFFFFF' : domain.color}
                          />
                        </View>
                        <View style={styles.domainTextContainer}>
                          <Text variant="titleLarge" style={styles.domainName}>
                            {domain.name}
                          </Text>
                          <Text variant="bodySmall" style={styles.domainSubtitle}>
                            PMP Domain
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Icon name="check-circle" size={28} color={domain.color} />
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <ActionButton
          label="Start Practice"
          onPress={handleStartPractice}
          disabled={!selectedDomain}
          variant="primary"
          size="large"
          fullWidth
          style={styles.startButton}
        />
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
  domainsContainer: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  domainCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  domainCardContent: {
    padding: spacing.base,
  },
  domainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  domainLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  domainIconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  domainTextContainer: {
    flex: 1,
  },
  domainName: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  domainSubtitle: {
    color: colors.textSecondary,
  },
  startButton: {
    marginTop: spacing.base,
  },
});



