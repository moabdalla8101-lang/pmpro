import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  dailyQuestionsGoal: number;
  dailyMinutesGoal: number;
  isLoading: boolean;
}

const DEFAULT_QUESTIONS_GOAL = 50;
const DEFAULT_MINUTES_GOAL = 30;

const initialState: SettingsState = {
  dailyQuestionsGoal: DEFAULT_QUESTIONS_GOAL,
  dailyMinutesGoal: DEFAULT_MINUTES_GOAL,
  isLoading: false,
};

// Load settings from AsyncStorage
export const loadSettings = createAsyncThunk('settings/load', async () => {
  try {
    const questionsGoal = await AsyncStorage.getItem('dailyQuestionsGoal');
    const minutesGoal = await AsyncStorage.getItem('dailyMinutesGoal');
    
    return {
      dailyQuestionsGoal: questionsGoal ? parseInt(questionsGoal, 10) : DEFAULT_QUESTIONS_GOAL,
      dailyMinutesGoal: minutesGoal ? parseInt(minutesGoal, 10) : DEFAULT_MINUTES_GOAL,
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      dailyQuestionsGoal: DEFAULT_QUESTIONS_GOAL,
      dailyMinutesGoal: DEFAULT_MINUTES_GOAL,
    };
  }
});

// Save settings to AsyncStorage
export const saveSettings = createAsyncThunk(
  'settings/save',
  async (settings: { dailyQuestionsGoal: number; dailyMinutesGoal: number }) => {
    try {
      await AsyncStorage.setItem('dailyQuestionsGoal', settings.dailyQuestionsGoal.toString());
      await AsyncStorage.setItem('dailyMinutesGoal', settings.dailyMinutesGoal.toString());
      return settings;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDailyQuestionsGoal: (state, action) => {
      state.dailyQuestionsGoal = action.payload;
    },
    setDailyMinutesGoal: (state, action) => {
      state.dailyMinutesGoal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyQuestionsGoal = action.payload.dailyQuestionsGoal;
        state.dailyMinutesGoal = action.payload.dailyMinutesGoal;
      })
      .addCase(loadSettings.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.dailyQuestionsGoal = action.payload.dailyQuestionsGoal;
        state.dailyMinutesGoal = action.payload.dailyMinutesGoal;
      });
  },
});

export const { setDailyQuestionsGoal, setDailyMinutesGoal } = settingsSlice.actions;
export default settingsSlice.reducer;

