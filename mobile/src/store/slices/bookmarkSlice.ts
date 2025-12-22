import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookmarkService } from '../../services/api/bookmarkService';

interface Bookmark {
  id: string;
  userId: string;
  questionId: string;
  createdAt: string;
  question?: any;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  bookmarkedQuestionIds: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  bookmarkedQuestionIds: [],
  isLoading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetch',
  async (knowledgeAreaId?: string) => {
    const response = await bookmarkService.getBookmarks(knowledgeAreaId);
    return response;
  }
);

export const addBookmark = createAsyncThunk(
  'bookmarks/add',
  async (questionId: string) => {
    await bookmarkService.addBookmark(questionId);
    return questionId;
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmarks/remove',
  async (questionId: string) => {
    await bookmarkService.removeBookmark(questionId);
    return questionId;
  }
);

export const checkBookmark = createAsyncThunk(
  'bookmarks/check',
  async (questionId: string) => {
    const response = await bookmarkService.checkBookmark(questionId);
    return { questionId, isBookmarked: response.isBookmarked };
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
      state.bookmarkedQuestionIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookmarks = action.payload.bookmarks || [];
        state.bookmarkedQuestionIds = state.bookmarks.map((b) => b.questionId);
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch bookmarks';
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        if (!state.bookmarkedQuestionIds.includes(action.payload)) {
          state.bookmarkedQuestionIds.push(action.payload);
        }
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarkedQuestionIds = state.bookmarkedQuestionIds.filter(
          (id) => id !== action.payload
        );
        state.bookmarks = state.bookmarks.filter(
          (b) => b.questionId !== action.payload
        );
      })
      .addCase(checkBookmark.fulfilled, (state, action) => {
        if (action.payload.isBookmarked) {
          if (!state.bookmarkedQuestionIds.includes(action.payload.questionId)) {
            state.bookmarkedQuestionIds.push(action.payload.questionId);
          }
        } else {
          state.bookmarkedQuestionIds = state.bookmarkedQuestionIds.filter(
            (id) => id !== action.payload.questionId
          );
        }
      });
  },
});

export const { clearBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;

