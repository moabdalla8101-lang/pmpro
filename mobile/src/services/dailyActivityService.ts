import AsyncStorage from '@react-native-async-storage/async-storage';

const TODAY_KEY = 'dailyActivityToday';
const SESSION_START_KEY = 'sessionStartTime';

interface DailyActivity {
  date: string; // YYYY-MM-DD
  questionsAnswered: number;
  practiceMinutes: number;
}

export const dailyActivityService = {
  // Get today's date as YYYY-MM-DD
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },

  // Get today's activity
  async getTodayActivity(): Promise<DailyActivity> {
    try {
      const today = this.getTodayDate();
      const stored = await AsyncStorage.getItem(TODAY_KEY);
      
      if (stored) {
        const activity: DailyActivity = JSON.parse(stored);
        // If stored date is not today, reset
        if (activity.date !== today) {
          const newActivity: DailyActivity = {
            date: today,
            questionsAnswered: 0,
            practiceMinutes: 0,
          };
          await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(newActivity));
          return newActivity;
        }
        return activity;
      }
      
      // No stored activity, return default
      return {
        date: today,
        questionsAnswered: 0,
        practiceMinutes: 0,
      };
    } catch (error) {
      console.error('Failed to get today activity:', error);
      return {
        date: this.getTodayDate(),
        questionsAnswered: 0,
        practiceMinutes: 0,
      };
    }
  },

  // Increment questions answered today
  async incrementQuestions(count: number = 1): Promise<void> {
    try {
      const activity = await this.getTodayActivity();
      activity.questionsAnswered += count;
      await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(activity));
    } catch (error) {
      console.error('Failed to increment questions:', error);
    }
  },

  // Start a practice session (track start time)
  async startSession(): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_START_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  },

  // End a practice session (calculate duration and add to today's total)
  async endSession(): Promise<number> {
    try {
      const startTimeStr = await AsyncStorage.getItem(SESSION_START_KEY);
      if (!startTimeStr) {
        return 0;
      }

      const startTime = parseInt(startTimeStr, 10);
      const endTime = Date.now();
      const durationMinutes = Math.floor((endTime - startTime) / 60000);

      // Add to today's activity
      const activity = await this.getTodayActivity();
      activity.practiceMinutes += durationMinutes;
      await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(activity));

      // Clear session start time
      await AsyncStorage.removeItem(SESSION_START_KEY);

      return durationMinutes;
    } catch (error) {
      console.error('Failed to end session:', error);
      return 0;
    }
  },

  // Add practice minutes directly (for manual tracking)
  async addPracticeMinutes(minutes: number): Promise<void> {
    try {
      const activity = await this.getTodayActivity();
      activity.practiceMinutes += minutes;
      await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(activity));
    } catch (error) {
      console.error('Failed to add practice minutes:', error);
    }
  },

  // Reset today's activity (for testing or manual reset)
  async resetToday(): Promise<void> {
    try {
      const today = this.getTodayDate();
      const newActivity: DailyActivity = {
        date: today,
        questionsAnswered: 0,
        practiceMinutes: 0,
      };
      await AsyncStorage.setItem(TODAY_KEY, JSON.stringify(newActivity));
    } catch (error) {
      console.error('Failed to reset today activity:', error);
    }
  },
};

