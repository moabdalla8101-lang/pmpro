import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/main/DashboardScreen';
import PracticeScreen from '../screens/main/PracticeScreen';
import ExamScreen from '../screens/main/ExamScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import QuestionDetailScreen from '../screens/main/QuestionDetailScreen';
import ExamStartScreen from '../screens/main/ExamStartScreen';
import ExamReviewScreen from '../screens/main/ExamReviewScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PracticeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PracticeList" component={PracticeScreen} options={{ title: 'Practice Questions' }} />
      <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} options={{ title: 'Question' }} />
    </Stack.Navigator>
  );
}

function ExamStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ExamList" component={ExamScreen} options={{ title: 'Mock Exams' }} />
      <Stack.Screen name="ExamStart" component={ExamStartScreen} options={{ title: 'Start Exam' }} />
      <Stack.Screen name="ExamReview" component={ExamReviewScreen} options={{ title: 'Exam Review' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Practice') {
            iconName = focused ? 'book-open-variant' : 'book-open-variant-outline';
          } else if (route.name === 'Exam') {
            iconName = focused ? 'file-document-edit' : 'file-document-edit-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'chart-line' : 'chart-line-variant';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else {
            iconName = 'help-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Practice" component={PracticeStack} />
      <Tab.Screen name="Exam" component={ExamStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}


