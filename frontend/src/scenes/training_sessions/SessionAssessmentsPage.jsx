import React, {useEffect, useState, useMemo} from 'react';
import {
    Box, Typography, Button, Paper, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Alert, Tooltip, useTheme
} from '@mui/material';
import {useParams, useNavigate, Link as RouterLink} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import dayjs from 'dayjs';

import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import trainingSessionStore from "../../stores/trainingSessionStore";
import militaryPersonnelStore from "../../stores/militaryPersonnelStore";
import standardAssessmentStore from "../../stores/standardAssessmentStore";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";
import {ScoreTypes, SessionTypes} from "../../utils/constants.js";

const SessionAssessmentsPage = observer(() => {
    const {sessionId, unitId} = useParams();
    const theme = useTheme();
    const navigate = useNavigate();

    const [sessionDetails, setSessionDetails] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [assessments, setAssessments] = useState({});
    const [existingAssessmentsMap, setExistingAssessmentsMap] = useState({});
    const [notes, setNotes] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const sessionExercises = useMemo(() => {
        if (!sessionDetails || !sessionDetails.exercises) return [];
        return sessionDetails.exercises.map(ex => {
            const fullExercise = exerciseStore.exercises.find(e => e.exercise_id === ex.exercise_id);
            return {
                ...ex,
                exercise_name: fullExercise?.exercise_name || `Вправа ID ${ex.exercise_id}`
            };
        }).sort((a, b) => a.order_in_session - b.order_in_session);
    }, [sessionDetails, exerciseStore.exercises]);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setPageError('');
            try {
                const exercisesPromise = exerciseStore.exercises.length === 0 ? exerciseStore.loadExercises() : Promise.resolve();
                const personnelPromise = militaryPersonnelStore.personnelList.length === 0 ||
                !militaryPersonnelStore.personnelList.some(p => p.unit_id === unitId)
                    ? militaryPersonnelStore.loadPersonnel({unit_id: unitId})
                    : Promise.resolve();

                await Promise.all([exercisesPromise, personnelPromise]);

                const personnelData = militaryPersonnelStore.personnelList.filter(p => p.unit_id === unitId);
                setPersonnel(personnelData || []);


                const sessionData = await trainingSessionStore.loadSessionById(parseInt(sessionId));
                if (!sessionData || !sessionData.exercises || sessionData.exercises.length === 0) {
                    setPageError("Заняття не знайдено, в ньому немає вправ або вказано невірний підрозділ для оцінювання.");
                    setIsLoading(false);
                    setSessionDetails(sessionData);
                    return;
                }
                if (sessionData.unit_id !== unitId) {
                    setPageError(`Це заняття призначене для іншого підрозділу (ID: ${sessionData.unit_id}). Ви переглядаєте оцінки для підрозділу ID: ${unitId}.`);
                }
                setSessionDetails(sessionData);


                if (standardAssessmentStore.assessments.length === 0) {
                    await standardAssessmentStore.loadAssessments({session_id: parseInt(sessionId)});
                }
                const existingAssessmentRecords = standardAssessmentStore.assessments;
                const initialAssessments = {};
                const initialExistingMap = {};
                const initialNotes = {};

                if (existingAssessmentRecords) {
                    existingAssessmentRecords.forEach(asm => {
                        const key = `${asm.military_person_id}_${asm.exercise_id}`;
                        initialAssessments[key] = asm.score;
                        initialNotes[key] = asm.notes || '';
                        initialExistingMap[key] = {
                            assessment_id: asm.assessment_id,
                            score: asm.score,
                            notes: asm.notes || ''
                        };
                    });
                }
                setAssessments(initialAssessments);
                setExistingAssessmentsMap(initialExistingMap);
                setNotes(initialNotes);

            } catch (err) {
                setPageError("Помилка завантаження даних: " + (err.message || "Невідома помилка"));
            } finally {
                setIsLoading(false);
            }
        };
        if (sessionId && unitId) {
            fetchData();
        } else {
            setPageError("Не вказано ID заняття або підрозділу.");
            setIsLoading(false);
        }
    }, [sessionId, unitId]);

    useError(trainingSessionStore);
    useError(militaryPersonnelStore);
    useError(standardAssessmentStore);
    useError(exerciseStore);

    const handleScoreChange = (personId, exerciseId, newScore) => {
        setAssessments(prev => ({
            ...prev,
            [`${personId}_${exerciseId}`]: newScore,
        }));
    };

    const handleNotesChange = (personId, exerciseId, newNotes) => {
        setNotes(prev => ({
            ...prev,
            [`${personId}_${exerciseId}`]: newNotes,
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        setPageError('');
        try {
            const promises = [];
            if (!personnel || !sessionDetails || !sessionDetails.exercises) {
                throw new Error("Дані для збереження неповні.");
            }

            for (const person of personnel) {
                for (const exercise of sessionExercises) {
                    const key = `${person.military_person_id}_${exercise.exercise_id}`;
                    const newScore = assessments[key];
                    const newNoteValue = notes[key] !== undefined ? notes[key] : '';
                    const existing = existingAssessmentsMap[key];

                    if (newScore !== undefined || (existing && newNoteValue !== existing.notes)) {
                        if (existing) {
                            if (newScore && (existing.score !== newScore || existing.notes !== newNoteValue)) {
                                promises.push(standardAssessmentStore.updateAssessment(existing.assessment_id, {
                                    session_id: parseInt(sessionId),
                                    military_person_id: person.military_person_id,
                                    exercise_id: exercise.exercise_id,
                                    score: newScore,
                                    notes: newNoteValue,
                                    assessment_datetime: dayjs().toISOString(),
                                }));
                            }
                        } else if (newScore) {
                            promises.push(standardAssessmentStore.addAssessment({
                                session_id: parseInt(sessionId),
                                military_person_id: person.military_person_id,
                                exercise_id: exercise.exercise_id,
                                score: newScore,
                                notes: newNoteValue,
                                assessment_datetime: dayjs().toISOString(),
                            }));
                        }
                    }
                }
            }
            await Promise.all(promises);
            alert("Оцінки успішно збережено!");
            const updatedExistingAssessments = await standardAssessmentStore.loadAssessments({session_id: parseInt(sessionId)});
            const newExistingMap = {};
            if (updatedExistingAssessments) {
                updatedExistingAssessments.forEach(asm => {
                    newExistingMap[`${asm.military_person_id}_${asm.exercise_id}`] = {
                        assessment_id: asm.assessment_id,
                        score: asm.score,
                        notes: asm.notes || ''
                    };
                });
            }
            setExistingAssessmentsMap(newExistingMap);

        } catch (err) {
            setPageError("Помилка збереження оцінок: " + (standardAssessmentStore.error || err.message || "Невідома помилка"));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/><Typography sx={{ml: 2}}>Завантаження...</Typography>
            </Box>
        );
    }

    if (pageError && (!sessionDetails || sessionDetails.exercises.length === 0)) {
        return (<Box m="20px"><TopBar/><Alert severity="error">{pageError}</Alert></Box>);
    }

    if (!sessionDetails) {
        return (<Box m="20px"><TopBar/><Alert severity="warning">Не вдалося завантажити деталі заняття.</Alert></Box>);
    }


    return (
        <Box m="20px">
            <TopBar headerBox={
                <Header
                    title={`Оцінювання: ${sessionDetails.unit?.unit_name || `Підрозділ ID ${unitId}`}`}
                    subtitle={`Заняття №${sessionId} (${sessionDetails.session_type ? SessionTypes.find(st => st.value === sessionDetails.session_type)?.label : ''}) від ${dayjs(sessionDetails.start_datetime).format('DD.MM.YYYY HH:mm')}`}
                />
            }/>
            {pageError && <Alert severity="warning" sx={{mb: 2}}>{pageError}</Alert>}
            <Paper elevation={3} sx={{p: 2, mt: 2}}>
                <Typography variant="h6" gutterBottom>
                    Вправи: {sessionExercises.map(ex => ex.exercise_name).join(', ')}
                </Typography>

                {personnel.length === 0 ? (
                    <Typography>Немає військовослужбовців у цьому підрозділі для оцінювання або дані ще
                        завантажуються.</Typography>
                ) : (
                    <TableContainer sx={{maxHeight: '60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        minWidth: 200,
                                        zIndex: 10,
                                        position: 'sticky',
                                        left: 0,
                                        backgroundColor: theme.palette.background.paper
                                    }}>
                                        Військовослужбовець
                                    </TableCell>
                                    {sessionExercises.map(ex => (
                                        <TableCell key={ex.exercise_id} align="center"
                                                   sx={{fontWeight: 'bold', minWidth: 220}}>
                                            <Tooltip title={ex.exercise_name}>
                                                <Typography noWrap>{ex.exercise_name}</Typography>
                                            </Tooltip>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {personnel.map((person) => (
                                    <TableRow hover key={person.military_person_id}>
                                        <TableCell component="th" scope="row" sx={{
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: theme.palette.background.paper,
                                            zIndex: 5
                                        }}>
                                            {person.last_name} {person.first_name} ({person.rank})
                                        </TableCell>
                                        {sessionExercises.map(exercise => {
                                            const key = `${person.military_person_id}_${exercise.exercise_id}`;
                                            return (
                                                <TableCell key={exercise.exercise_id} align="center">
                                                    <Grid container spacing={1} direction="column"
                                                          sx={{minWidth: '200px'}}>
                                                        <Grid item>
                                                            <FormControl fullWidth size="small" margin="none">
                                                                <InputLabel
                                                                    id={`score-label-${key}`}>Оцінка</InputLabel>
                                                                <Select
                                                                    labelId={`score-label-${key}`}
                                                                    value={assessments[key] || ''}
                                                                    label="Оцінка"
                                                                    onChange={(e) => handleScoreChange(person.military_person_id, exercise.exercise_id, e.target.value)}
                                                                >
                                                                    <MenuItem value=""><em>(Немає)</em></MenuItem>
                                                                    {ScoreTypes.map(type => (
                                                                        <MenuItem key={type.value}
                                                                                  value={type.value}>{type.label}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item>
                                                            <TextField
                                                                label="Примітка"
                                                                size="small"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={notes[key] || ''}
                                                                onChange={(e) => handleNotesChange(person.military_person_id, exercise.exercise_id, e.target.value)}

                                                                minRows={1}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {personnel.length > 0 &&
                    <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant="outlined" onClick={() => navigate(`/training-sessions/edit/${sessionId}`)}
                                sx={{mr: 2}} disabled={isSaving}>
                            До Заняття
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <CircularProgress size={24}/> : "Зберегти Оцінки"}
                        </Button>
                    </Box>
                }
            </Paper>
        </Box>
    );
});

export default SessionAssessmentsPage;