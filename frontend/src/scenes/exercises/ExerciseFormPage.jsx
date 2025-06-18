import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Typography, useTheme, Grid, Stack, CircularProgress} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";

const ExerciseFormPage = () => {
    const theme = useTheme();
    const {exerciseId} = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState({
        exercise_name: '',
        description: '',
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (exerciseId) {
            setIsLoading(true);
            exerciseStore.loadExerciseById(parseInt(exerciseId)).then((data) => {
                if (data) {
                    setExercise(data);
                } else {
                    setFormError("Не вдалося завантажити дані вправи.");
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        } else {
            setExercise({exercise_name: '', description: ''});
            exerciseStore.clearSelectedExercise();
        }
        setFormError('');
    }, [exerciseId]);

    useError(exerciseStore);

    const handleChange = (e) => {
        setExercise({...exercise, [e.target.name]: e.target.value});
    };

    const validateForm = () => {
        if (!exercise.exercise_name.trim()) {
            setFormError("Назва вправи є обов'язковою.");
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setFormError('');
        try {
            if (exerciseId) {
                await exerciseStore.updateExercise(exerciseId, exercise);
            } else {
                await exerciseStore.addExercise(exercise);
            }
            navigate('/exercises');
        } catch (error) {
            setFormError(exerciseStore.error || "Помилка збереження вправи");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && exerciseId) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних вправи...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={exerciseId ? `Редагувати Вправу №${exercise.exercise_name || exerciseId}` : "Створити Нову Вправу"}
                    subtitle={exerciseId ? "Оновлення даних про фізичну вправу" : "Введення даних для нової фізичної вправи"}
                />
            }/>
            <Box>
                <Stack component="form" onSubmit={handleSubmit} spacing={3} sx={{mt: 2}}>
                    <TextField
                        label="Назва вправи"
                        name="exercise_name"
                        value={exercise.exercise_name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formError && formError.includes("Назва")}
                        helperText={formError && formError.includes("Назва") ? formError : ''}
                        disabled={isLoading}
                    />
                    <TextField
                        label="Опис вправи"
                        name="description"
                        value={exercise.description || ''}
                        onChange={handleChange}
                        fullWidth

                        rows={4}
                        disabled={isLoading}
                    />
                    {formError && !formError.includes("Назва") && <Typography color="error">{formError}</Typography>}
                    {exerciseStore.error && <Typography color="error" sx={{mt: 1}}>{exerciseStore.error}</Typography>}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="secondary"
                                disabled={isLoading || exerciseStore.loading}>
                            {isLoading || exerciseStore.loading ?
                                <CircularProgress size={24}/> : (exerciseId ? "Зберегти Зміни" : "Створити Вправу")}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default observer(ExerciseFormPage);