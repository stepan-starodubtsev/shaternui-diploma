import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Typography, useTheme, Grid, Stack, MenuItem, CircularProgress} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import {LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import standardAssessmentStore from "../../stores/standardAssessmentStore";
import trainingSessionStore from "../../stores/trainingSessionStore";
import militaryPersonnelStore from "../../stores/militaryPersonnelStore";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";
import {ScoreTypes} from "../../utils/constants.js";

const StandardAssessmentFormPage = () => {
    const theme = useTheme();
    const {assessmentId} = useParams();
    const navigate = useNavigate();
    dayjs.locale('uk');

    const [assessment, setAssessment] = useState({
        session_id: '',
        military_person_id: '',
        exercise_id: '',
        score: '',
        assessment_datetime: dayjs(),
        notes: '',
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const areRelatedStoresLoading = trainingSessionStore.loading || militaryPersonnelStore.loading || exerciseStore.loading;

    useEffect(() => {
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) {
            trainingSessionStore.loadSessions({session_type: 'STANDARDS_ASSESSMENT'});
        }
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel();
        }
        if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) {
            exerciseStore.loadExercises();
        }

        if (assessmentId) {
            setIsLoading(true);
            standardAssessmentStore.loadAssessmentById(parseInt(assessmentId)).then((data) => {
                if (data) {
                    setAssessment({
                        ...data,
                        assessment_datetime: data.assessment_datetime ? dayjs(data.assessment_datetime) : dayjs()
                    });
                } else {
                    setFormError("Не вдалося завантажити дані оцінки.");
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        } else {
            setAssessment({
                session_id: '',
                military_person_id: '',
                exercise_id: '',
                score: '',
                assessment_datetime: dayjs(),
                notes: ''
            });
            standardAssessmentStore.clearSelectedAssessment();
        }
        setFormError('');
    }, [assessmentId]);

    useError(standardAssessmentStore);
    useError(trainingSessionStore);
    useError(militaryPersonnelStore);
    useError(exerciseStore);


    const handleChange = (e) => {
        setAssessment({...assessment, [e.target.name]: e.target.value});
    };

    const handleDateTimeChange = (newDateTime) => {
        setAssessment({...assessment, assessment_datetime: newDateTime});
    };

    const validateForm = () => {
        if (!assessment.session_id || !assessment.military_person_id || !assessment.exercise_id || !assessment.score || !assessment.assessment_datetime) {
            setFormError("Заняття, військовослужбовець, вправа, оцінка та дата/час є обов'язковими.");
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
        const dataToSubmit = {
            ...assessment,
            assessment_datetime: assessment.assessment_datetime ? assessment.assessment_datetime.toISOString() : null,
        };

        try {
            if (assessmentId) {
                await standardAssessmentStore.updateAssessment(assessmentId, dataToSubmit);
            } else {
                await standardAssessmentStore.addAssessment(dataToSubmit);
            }
            navigate('/standard-assessments');
        } catch (error) {
            setFormError(standardAssessmentStore.error || "Помилка збереження оцінки");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && assessmentId) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних оцінки...</Typography>
            </Box>
        );
    }


    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={assessmentId ? `Редагувати Оцінку №${assessmentId}` : "Додати Нову Оцінку"}
                    subtitle={assessmentId ? "Оновлення даних про оцінку за норматив" : "Введення даних нової оцінки"}
                />
            }/>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{mt: 2}}>
                        <Grid container spacing={2}>
                            <Grid item size={4}>
                                <TextField
                                    label="Заняття (Здача нормативів)"
                                    name="session_id"
                                    value={assessment.session_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading || areRelatedStoresLoading}
                                >
                                    <MenuItem value=""><em>Оберіть заняття</em></MenuItem>
                                    {trainingSessionStore.sessions
                                        .filter(s => s.session_type === 'STANDARDS_ASSESSMENT')
                                        .map((session) => (
                                            <MenuItem key={session.session_id} value={session.session_id}>
                                                {`ID: ${session.session_id} (${dayjs(session.start_datetime).format('DD.MM.YY HH:mm')})`}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Військовослужбовець"
                                    name="military_person_id"
                                    value={assessment.military_person_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading || areRelatedStoresLoading}
                                >
                                    <MenuItem value=""><em>Оберіть військовослужбовця</em></MenuItem>
                                    {militaryPersonnelStore.personnelList.map((person) => (
                                        <MenuItem key={person.military_person_id} value={person.military_person_id}>
                                            {`${person.last_name} ${person.first_name} (${person.rank || ''})`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Вправа"
                                    name="exercise_id"
                                    value={assessment.exercise_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading || areRelatedStoresLoading}
                                >
                                    <MenuItem value=""><em>Оберіть вправу</em></MenuItem>
                                    {exerciseStore.exercises.map((exercise) => (
                                        <MenuItem key={exercise.exercise_id} value={exercise.exercise_id}>
                                            {exercise.exercise_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Оцінка"
                                    name="score"
                                    value={assessment.score || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading}
                                >
                                    <MenuItem value=""><em>Оберіть оцінку</em></MenuItem>
                                    {ScoreTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <DateTimePicker
                                    label="Дата та час оцінки"
                                    value={assessment.assessment_datetime}
                                    onChange={handleDateTimeChange}
                                    slotProps={{textField: {fullWidth: true, required: true, disabled: isLoading}}}
                                    format="DD.MM.YYYY HH:mm"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Примітки (опціонально)"
                                    name="notes"
                                    value={assessment.notes || ''}
                                    onChange={handleChange}
                                    fullWidth

                                    rows={3}
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                        {formError && <Typography color="error" sx={{mt: 1}}>{formError}</Typography>}
                        {standardAssessmentStore.error &&
                            <Typography color="error" sx={{mt: 1}}>{standardAssessmentStore.error}</Typography>}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit" variant="contained" color="secondary"
                                    disabled={isLoading || standardAssessmentStore.loading || areRelatedStoresLoading}>
                                {isLoading || standardAssessmentStore.loading ?
                                    <CircularProgress size={24}/> : (assessmentId ? "Зберегти Зміни" : "Додати Оцінку")}
                            </Button>
                        </Box>
                    </Stack>
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default observer(StandardAssessmentFormPage);