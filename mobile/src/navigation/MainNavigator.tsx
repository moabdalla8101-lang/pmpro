import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';

import DashboardScreen from '../screens/main/DashboardScreen';
import PracticeScreen from '../screens/main/PracticeScreen';
import ExamScreen from '../screens/main/ExamScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import QuestionDetailScreen from '../screens/main/QuestionDetailScreen';
import ExamStartScreen from '../screens/main/ExamStartScreen';
import ExamReviewScreen from '../screens/main/ExamReviewScreen';
import DailyQuizScreen from '../screens/main/DailyQuizScreen';
import PracticeTestScreen from '../screens/main/PracticeTestScreen';
import BookmarkedQuestionsScreen from '../screens/main/BookmarkedQuestionsScreen';
import MissedQuestionsScreen from '../screens/main/MissedQuestionsScreen';
import FlashcardFilterScreen from '../screens/main/FlashcardFilterScreen';
import FlashcardStudyScreen from '../screens/main/FlashcardStudyScreen';
import MarkedFlashcardsScreen from '../screens/main/MarkedFlashcardsScreen';
import LearnScreen from '../screens/main/LearnScreen';
import FormulasScreen from '../screens/main/FormulasScreen';
import KnowledgeAreaFilterScreen from '../screens/main/KnowledgeAreaFilterScreen';
import DomainFilterScreen from '../screens/main/DomainFilterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PracticeTabStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="PracticeDashboard"
        component={DashboardScreen}
        options={{ title: 'Practice', headerShown: false }}
      />
      <Stack.Screen
        name="PracticeList"
        component={PracticeScreen}
        options={{ title: 'Practice Questions', headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="QuestionDetail"
        component={QuestionDetailScreen}
        options={{
          title: 'Question',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="BookmarkedQuestions"
        component={BookmarkedQuestionsScreen}
        options={{
          title: 'Bookmarked Questions',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="MissedQuestions"
        component={MissedQuestionsScreen}
        options={{
          title: 'Missed Questions',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="KnowledgeAreaFilter"
        component={KnowledgeAreaFilterScreen}
        options={{
          title: 'Select Knowledge Area',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="DomainFilter"
        component={DomainFilterScreen}
        options={{
          title: 'Select Domain',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function LearnStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="LearnDashboard"
        component={LearnScreen}
        options={{ title: 'Learn', headerShown: false }}
      />
      <Stack.Screen
        name="FlashcardFilter"
        component={FlashcardFilterScreen}
        options={{
          title: 'Study Flashcards',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FlashcardStudy"
        component={FlashcardStudyScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MarkedFlashcards"
        component={MarkedFlashcardsScreen}
        options={{
          title: 'Marked Flashcards',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Formulas"
        component={FormulasScreen}
        options={{
          title: 'Formulas',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ExamStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="ExamList"
        component={ExamScreen}
        options={{ title: 'Mock Exams', headerShown: false }}
      />
      <Stack.Screen
        name="ExamStart"
        component={ExamStartScreen}
        options={{
          title: 'Start Exam',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ExamReview"
        component={ExamReviewScreen}
        options={{
          title: 'Exam Review',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="DailyQuiz"
        component={DailyQuizScreen}
        options={{
          title: "Today's Quiz",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Practice') {
            iconName = focused ? 'book-open-variant' : 'book-open-variant-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'school' : 'school-outline';
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
          height: 75,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Practice"
        component={PracticeTabStack}
        options={{
          tabBarLabel: 'Practice',
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen
        name="Exam"
        component={ExamStack}
        options={{
          tabBarLabel: 'Exam',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
