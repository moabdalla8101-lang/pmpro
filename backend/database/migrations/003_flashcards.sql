-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  front_face TEXT NOT NULL,
  back_face TEXT NOT NULL,
  knowledge_area VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User flashcard progress table
CREATE TABLE IF NOT EXISTS user_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  is_marked BOOLEAN NOT NULL DEFAULT false,
  times_reviewed INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_incorrect INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_flashcards_knowledge_area ON flashcards(knowledge_area);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user ON user_flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_marked ON user_flashcard_progress(user_id, is_marked) WHERE is_marked = true;

