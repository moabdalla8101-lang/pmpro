# PMP Exam Prep Mobile App

React Native mobile application for PMP exam preparation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

3. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the mobile directory:
```
EXPO_PUBLIC_API_URL=http://localhost:3001
```

## Features

- User authentication (login, register, password reset)
- Onboarding flow
- Dashboard with progress overview
- Practice questions
- Mock exams
- Progress tracking and analytics
- Settings and profile management

## Project Structure

- `src/screens/` - Screen components
- `src/components/` - Reusable UI components
- `src/services/` - API services
- `src/store/` - Redux store and slices
- `src/navigation/` - Navigation configuration
- `src/theme/` - Theme configuration

## Running on Devices

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Building for Production

See Expo documentation for building production apps.


