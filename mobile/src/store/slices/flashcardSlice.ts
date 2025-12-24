import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { flashcardService } from '../../services/api/flashcardService';

interface Flashcard {
  id: string;
  frontFace: string;
  backFace: string;
  knowledgeArea: string;
  isMarked: boolean;
  timesReviewed: number;
  timesCorrect: number;
  timesIncorrect: number;
}

interface FlashcardState {
  flashcards: Flashcard[];
  markedFlashcards: Flashcard[];
  knowledgeAreas: string[];
  currentCardIndex: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlashcardState = {
  flashcards: [],
  markedFlashcards: [],
  knowledgeAreas: [],
  currentCardIndex: 0,
  isLoading: false,
  error: null,
};

export const fetchFlashcards = createAsyncThunk(
  'flashcards/fetch',
  async ({ knowledgeAreaIds, random }: { knowledgeAreaIds?: string[]; random?: boolean }) => {
    const response = await flashcardService.getFlashcards(knowledgeAreaIds, random);
    return response;
  }
);

export const fetchKnowledgeAreas = createAsyncThunk(
  'flashcards/fetchKnowledgeAreas',
  async () => {
    const response = await flashcardService.getKnowledgeAreas();
    return response;
  }
);

export const fetchMarkedFlashcards = createAsyncThunk(
  'flashcards/fetchMarked',
  async (random?: boolean) => {
    const response = await flashcardService.getMarkedFlashcards(random);
    return response;
  }
);

export const fetchMarkedFlashcardsForStudy = createAsyncThunk(
  'flashcards/fetchMarkedForStudy',
  async (random?: boolean) => {
    const response = await flashcardService.getMarkedFlashcards(random);
    return response;
  }
);

export const toggleMarkFlashcard = createAsyncThunk(
  'flashcards/toggleMark',
  async ({ flashcardId, isMarked }: { flashcardId: string; isMarked: boolean }) => {
    await flashcardService.toggleMarkFlashcard(flashcardId, isMarked);
    return { flashcardId, isMarked };
  }
);

export const recordReview = createAsyncThunk(
  'flashcards/recordReview',
  async ({ flashcardId, isCorrect }: { flashcardId: string; isCorrect: boolean }) => {
    await flashcardService.recordReview(flashcardId, isCorrect);
    return { flashcardId, isCorrect };
  }
);

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    setCurrentCardIndex: (state, action) => {
      state.currentCardIndex = action.payload;
    },
    nextCard: (state) => {
      if (state.currentCardIndex < state.flashcards.length - 1) {
        state.currentCardIndex += 1;
      }
    },
    previousCard: (state) => {
      if (state.currentCardIndex > 0) {
        state.currentCardIndex -= 1;
      }
    },
    resetCardIndex: (state) => {
      state.currentCardIndex = 0;
    },
    clearFlashcards: (state) => {
      state.flashcards = [];
      state.currentCardIndex = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashcards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFlashcards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flashcards = action.payload.flashcards || [];
        state.currentCardIndex = 0;
      })
      .addCase(fetchFlashcards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch flashcards';
      })
      .addCase(fetchKnowledgeAreas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeAreas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.knowledgeAreas = action.payload.knowledgeAreas || [];
      })
      .addCase(fetchKnowledgeAreas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch knowledge areas';
      })
      .addCase(fetchMarkedFlashcards.fulfilled, (state, action) => {
        state.markedFlashcards = action.payload.flashcards || [];
      })
      .addCase(fetchMarkedFlashcardsForStudy.fulfilled, (state, action) => {
        state.flashcards = action.payload.flashcards || [];
        state.currentCardIndex = 0;
      })
      .addCase(toggleMarkFlashcard.fulfilled, (state, action) => {
        const { flashcardId, isMarked } = action.payload;
        // Update in flashcards array
        const card = state.flashcards.find((c) => c.id === flashcardId);
        if (card) {
          card.isMarked = isMarked;
        }
        // Update in markedFlashcards array
        if (isMarked) {
          const cardToAdd = state.flashcards.find((c) => c.id === flashcardId);
          if (cardToAdd && !state.markedFlashcards.find((c) => c.id === flashcardId)) {
            state.markedFlashcards.push({ ...cardToAdd, isMarked: true });
          }
        } else {
          state.markedFlashcards = state.markedFlashcards.filter((c) => c.id !== flashcardId);
        }
      })
      .addCase(recordReview.fulfilled, (state, action) => {
        const { flashcardId, isCorrect } = action.payload;
        const card = state.flashcards.find((c) => c.id === flashcardId);
        if (card) {
          card.timesReviewed += 1;
          if (isCorrect) {
            card.timesCorrect += 1;
          } else {
            card.timesIncorrect += 1;
          }
        }
      });
  },
});

export const {
  setCurrentCardIndex,
  nextCard,
  previousCard,
  resetCardIndex,
  clearFlashcards,
} = flashcardSlice.actions;
export default flashcardSlice.reducer;

