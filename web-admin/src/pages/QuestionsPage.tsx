import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { questionService } from '../services/api/questionService';

export default function QuestionsPage() {
  const [open, setOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [formData, setFormData] = useState({
    questionText: '',
    explanation: '',
    difficulty: 'medium',
    certificationId: '550e8400-e29b-41d4-a716-446655440000',
    knowledgeAreaId: '',
    answers: [{ answerText: '', isCorrect: false }],
    questionImages: null as any,
    explanationImages: null as any,
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionService.getQuestions(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => questionService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      handleClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      questionService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      handleClose();
    },
  });

  const handleOpen = (question?: any) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        questionText: question.questionText || question.question_text || '',
        explanation: question.explanation || '',
        difficulty: question.difficulty || 'medium',
        certificationId: question.certificationId || question.certification_id || '',
        knowledgeAreaId: question.knowledgeAreaId || question.knowledge_area_id || '',
        answers: question.answers || [{ answerText: '', isCorrect: false }],
        questionImages: question.questionImages || question.question_images || null,
        explanationImages: question.explanationImages || question.explanation_images || null,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        questionText: '',
        explanation: '',
        difficulty: 'medium',
        certificationId: '550e8400-e29b-41d4-a716-446655440000',
        knowledgeAreaId: '',
        answers: [{ answerText: '', isCorrect: false }],
        questionImages: null,
        explanationImages: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = () => {
    if (editingQuestion) {
      updateMutation.mutate({
        id: editingQuestion.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleAddAnswer = () => {
    setFormData({
      ...formData,
      answers: [...formData.answers, { answerText: '', isCorrect: false }],
    });
  };

  const handleRemoveAnswer = (index: number) => {
    setFormData({
      ...formData,
      answers: formData.answers.filter((_, i) => i !== index),
    });
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Questions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Question
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question Text</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Knowledge Area</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.questions && data.questions.length > 0 ? (
                data.questions.map((question: any) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.questionText || question.question_text || '-'}</TableCell>
                    <TableCell>{question.difficulty || '-'}</TableCell>
                    <TableCell>{question.knowledgeAreaName || question.knowledge_area_name || '-'}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(question)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">No questions found</Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Text"
            multiline
            rows={4}
            value={formData.questionText}
            onChange={(e) =>
              setFormData({ ...formData, questionText: e.target.value })
            }
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Knowledge Area ID"
            value={formData.knowledgeAreaId}
            onChange={(e) =>
              setFormData({ ...formData, knowledgeAreaId: e.target.value })
            }
            margin="normal"
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Answers
          </Typography>
          {formData.answers.map((answer, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <TextField
                fullWidth
                label={`Answer ${index + 1}`}
                value={answer.answerText}
                onChange={(e) =>
                  handleAnswerChange(index, 'answerText', e.target.value)
                }
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Is Correct</InputLabel>
                <Select
                  value={answer.isCorrect ? 'true' : 'false'}
                  onChange={(e) =>
                    handleAnswerChange(index, 'isCorrect', e.target.value === 'true')
                  }
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
              {formData.answers.length > 1 && (
                <Button
                  onClick={() => handleRemoveAnswer(index)}
                  color="error"
                  size="small"
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button onClick={handleAddAnswer} variant="outlined" sx={{ mt: 1 }}>
            Add Answer
          </Button>

          <TextField
            fullWidth
            label="Explanation"
            multiline
            rows={3}
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
            margin="normal"
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Question Images (JSON)
          </Typography>
          <TextField
            fullWidth
            label="Question Images (JSON array of image URLs)"
            multiline
            rows={3}
            value={formData.questionImages ? JSON.stringify(formData.questionImages, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                setFormData({ ...formData, questionImages: parsed });
              } catch (err) {
                // Invalid JSON, keep as string for now
                setFormData({ ...formData, questionImages: e.target.value || null });
              }
            }}
            margin="normal"
            placeholder='["https://example.com/image1.png", "https://example.com/image2.png"]'
            helperText="Enter a JSON array of image URLs"
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Explanation Images (JSON)
          </Typography>
          <TextField
            fullWidth
            label="Explanation Images (JSON array of image URLs)"
            multiline
            rows={3}
            value={formData.explanationImages ? JSON.stringify(formData.explanationImages, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                setFormData({ ...formData, explanationImages: parsed });
              } catch (err) {
                // Invalid JSON, keep as string for now
                setFormData({ ...formData, explanationImages: e.target.value || null });
              }
            }}
            margin="normal"
            placeholder='["https://example.com/image1.png", "https://example.com/image2.png"]'
            helperText="Enter a JSON array of image URLs"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.questionText ||
              formData.answers.length < 2 ||
              !formData.answers.some((a) => a.isCorrect)
            }
          >
            {editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
