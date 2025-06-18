import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Grid,
    Stack,
    MenuItem,
    IconButton,
    Paper,
    CircularProgress
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import {LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import RateReviewIcon from '@mui/icons-material/RateReview';

import trainingSessionStore from "../../stores/trainingSessionStore";
import userStore from "../../stores/userStore.js";
import unitStore from "../../stores/unitStore.js";
import locationStore from "../../stores/locationStore";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";
import { SessionTypes, ROLES } from "../../utils/constants.js";
import authStore from "../../stores/authStore.js";

const TrainingSessionFormPage =() => {
    const theme = useTheme();
    const {sessionId} = useParams();
    const navigate = useNavigate();
    dayjs.locale('uk');

    const [session, setSession] = useState({
        session_type: '',
        start_datetime: dayjs(),
        end_datetime: dayjs().add(1, 'hour'),
        location_id: '',
        conducted_by_user_id: '',
        unit_id: '',
        exercises: [],
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const areRelatedStoresLoading = locationStore.loading || userStore.loading || unitStore.loading || exerciseStore.loading;

    useEffect(() => {
        const fetchData = async () => {
            if (locationStore.locations.length === 0 && !locationStore.loading) await locationStore.loadLocations();
            if (userStore.users.length === 0 && !userStore.loading) await userStore.loadUsers();
            if (unitStore.units.length === 0 && !unitStore.loading) await unitStore.loadUnits();
            if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) await exerciseStore.loadExercises();

            if (sessionId) {
                setIsLoading(true);
                const data = await trainingSessionStore.loadSessionById(parseInt(sessionId));
                if (data) {
                    setSession({
                        ...data,
                        start_datetime: data.start_datetime ? dayjs(data.start_datetime) : dayjs(),
                        end_datetime: data.end_datetime ? dayjs(data.end_datetime) : dayjs().add(1, 'hour'),
                        exercises: data.exercises ? data.exercises.map(ex => ({
                            exercise_id: ex.exercise_id,
                            exercise_name: ex.exercise_name || (exerciseStore.exercises.find(e => e.exercise_id === ex.exercise_id)?.exercise_name || `Вправа ID ${ex.exercise_id}`),
                            order_in_session: ex.SessionExercise?.order_in_session || ex.order_in_session || 0
                        })) : [],
                        unit_id: data.unit_id || (data.unit ? data.unit.unit_id : ''),
                    });
                } else {
                    setFormError("Не вдалося завантажити дані заняття.");
                }
                setIsLoading(false);
            } else {
                setSession({
                    session_type: '',
                    start_datetime: dayjs(),
                    end_datetime: dayjs().add(1, 'hour'),
                    location_id: '',
                    conducted_by_user_id: '',
                    unit_id: '',
                    exercises: []
                });
                trainingSessionStore.clearSelectedSession();
            }
            setFormError('');
        };
        fetchData();
    }, [sessionId]);

    useError(trainingSessionStore);
    useError(locationStore);
    useError(userStore);
    useError(unitStore);
    useError(exerciseStore);

    const handleChange = (e) => {
        setSession({...session, [e.target.name]: e.target.value});
    };

    const handleDateTimeChange = (name, newDateTime) => {
        setSession({...session, [name]: newDateTime});
    };

    const handleAddExercise = () => {
        setSession(prev => ({
            ...prev,
            exercises: [...prev.exercises, {exercise_id: '', exercise_name: '', order_in_session: prev.exercises.length + 1}]
        }));
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...session.exercises];
        if (field === 'exercise_id') {
            const selectedEx = exerciseStore.exercises.find(ex => ex.exercise_id === parseInt(value));
            newExercises[index] = {
                ...newExercises[index],
                exercise_id: value,
                exercise_name: selectedEx ? selectedEx.exercise_name : ''
            };
        } else {
            newExercises[index] = {...newExercises[index], [field]: value};
        }
        newExercises.forEach((ex, i) => ex.order_in_session = i + 1);
        setSession(prev => ({...prev, exercises: newExercises}));
    };

    const handleRemoveExercise = (index) => {
        const newExercises = session.exercises.filter((_, i) => i !== index);
        newExercises.forEach((ex, i) => ex.order_in_session = i + 1);
        setSession(prev => ({...prev, exercises: newExercises}));
    };

    const validateForm = () => {
        if (!session.session_type || !session.start_datetime || !session.end_datetime || !session.location_id || !session.conducted_by_user_id) {
            setFormError("Тип, час початку/кінця, локація та відповідальний є обов'язковими.");
            return false;
        }
        if (dayjs(session.end_datetime).isBefore(dayjs(session.start_datetime))) {
            setFormError("Час закінчення не може бути раніше часу початку.");
            return false;
        }
        if (session.exercises.some(ex => !ex.exercise_id)) {
            setFormError("Для кожної доданої вправи необхідно обрати саму вправу.");
            return false;
        }
        if (session.session_type === 'STANDARDS_ASSESSMENT' && !session.unit_id) {
            setFormError("Для здачі нормативів необхідно вказати підрозділ.");
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
            session_type: session.session_type,
            start_datetime: session.start_datetime ? session.start_datetime.toISOString() : null,
            end_datetime: session.end_datetime ? session.end_datetime.toISOString() : null,
            location_id: session.location_id ? parseInt(session.location_id) : null,
            conducted_by_user_id: session.conducted_by_user_id ? parseInt(session.conducted_by_user_id) : null,
            unit_id: session.unit_id ? parseInt(session.unit_id) : null,
            exercises: session.exercises.map(ex => ({
                exercise_id: parseInt(ex.exercise_id),
                order_in_session: ex.order_in_session
            })),
        };
        if (dataToSubmit.unit_id === null) delete dataToSubmit.unit_id;


        try {
            if (sessionId) {
                await trainingSessionStore.updateSession(sessionId, dataToSubmit);
            } else {
                const newSession = await trainingSessionStore.addSession(dataToSubmit);
                if (newSession && newSession.session_id && newSession.session_type === 'STANDARDS_ASSESSMENT' && newSession.unit_id) {
                    navigate(`/training-sessions/${newSession.session_id}/unit/${newSession.unit_id}/assessments`);
                    return;
                }
            }
            navigate('/training-sessions');
        } catch (error) {
            setFormError(trainingSessionStore.error || "Помилка збереження заняття");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToAssessments = () => {
        if (session.session_id && session.unit_id && session.exercises && session.exercises.length > 0) {
            navigate(`/training-sessions/${session.session_id}/unit/${session.unit_id}/assessments`);
        } else {
            setFormError("Спочатку збережіть заняття з вправами та вкажіть підрозділ для виставлення оцінок.");
        }
    };

    const canShowAssessmentsButton =
        sessionId &&
        session.session_type === SessionTypes.find(st => st.value === 'STANDARDS_ASSESSMENT')?.value &&
        session.exercises && session.exercises.length > 0 &&
        session.unit_id &&
        (authStore.userRole === ROLES.INSTRUCTOR || authStore.userRole === ROLES.COMMANDER || authStore.userRole === ROLES.ADMIN || authStore.userRole === ROLES.DEPARTMENT_EMPLOYEE);


    if (isLoading && sessionId && !trainingSessionStore.selectedSession) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних заняття...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={sessionId ? `Редагувати Заняття №${session.session_id || sessionId}` : "Створити Нове Заняття"}
                    subtitle={sessionId ? "Оновлення даних про тренувальне заняття" : "Планування нового заняття"}
                />
            }/>
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{mt: 2}}>
                        <Grid container spacing={2}>
                            <Grid item size={4}>
                                <TextField label="Тип заняття" name="session_type" value={session.session_type || ''}
                                           onChange={handleChange} fullWidth select required
                                           disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть тип</em></MenuItem>
                                    {SessionTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField label="Локація" name="location_id" value={session.location_id || ''}
                                           onChange={handleChange} fullWidth select required
                                           disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть локацію</em></MenuItem>
                                    {locationStore.locations.map((loc) => (
                                        <MenuItem key={loc.location_id} value={loc.location_id}>{loc.name}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField label="Проводить" name="conducted_by_user_id"
                                           value={session.conducted_by_user_id || ''} onChange={handleChange} fullWidth
                                           select required disabled={isLoading || areRelatedStoresLoading}>
                                    <MenuItem value=""><em>Оберіть відповідального</em></MenuItem>
                                    {userStore.users.filter(u => u.role === ROLES.INSTRUCTOR || u.role === ROLES.COMMANDER || u.role === ROLES.ADMIN).map((user) => (
                                        <MenuItem key={user.user_id}
                                                  value={user.user_id}>{`${user.last_name} ${user.first_name}`}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Підрозділ"
                                    name="unit_id"
                                    value={session.unit_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required={session.session_type === 'STANDARDS_ASSESSMENT' || session.session_type === 'UNIT_TRAINING'}
                                    disabled={isLoading || areRelatedStoresLoading}
                                >
                                    <MenuItem value=""><em>{session.session_type === 'TRAINING' ? 'Не обрано (загальне)' : 'Оберіть підрозділ'}</em></MenuItem>
                                    {unitStore.units.map((unit) => (
                                        <MenuItem key={unit.unit_id} value={unit.unit_id}>{unit.unit_name}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <DateTimePicker label="Час початку" value={dayjs(session.start_datetime)}
                                                onChange={(newVal) => handleDateTimeChange('start_datetime', newVal)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        disabled: isLoading
                                                    }
                                                }} format="DD.MM.YYYY HH:mm"/>
                            </Grid>
                            <Grid item size={4}>
                                <DateTimePicker label="Час закінчення" value={dayjs(session.end_datetime)}
                                                onChange={(newVal) => handleDateTimeChange('end_datetime', newVal)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        disabled: isLoading
                                                    }
                                                }} format="DD.MM.YYYY HH:mm"/>
                            </Grid>
                        </Grid>

                        <Typography variant="h5" sx={{mt: 3, mb: 1}}>Вправи на занятті</Typography>
                        <Paper variant="outlined" sx={{p: 2}}>
                            {session.exercises.map((sessionEx, index) => (
                                <Grid container spacing={1} key={index} alignItems="center" sx={{mb: 1}}>
                                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                                        <Typography>{index + 1}.</Typography>
                                    </Grid>
                                    <Grid item xs={10} sm={10}>
                                        <TextField
                                            label="Вправа"
                                            name="exercise_id"
                                            value={sessionEx.exercise_id || ''}
                                            onChange={(e) => handleExerciseChange(index, 'exercise_id', e.target.value)}
                                            fullWidth
                                            select
                                            size="small"
                                            disabled={isLoading || areRelatedStoresLoading}
                                        >
                                            <MenuItem value=""><em>Обрати вправу</em></MenuItem>
                                            {exerciseStore.exercises.map((ex) => (
                                                <MenuItem key={ex.exercise_id} value={ex.exercise_id}>
                                                    {ex.exercise_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={1} sm={1} sx={{textAlign: 'right'}}>
                                        <IconButton onClick={() => handleRemoveExercise(index)} color="error"
                                                    disabled={isLoading}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={handleAddExercise}
                                variant="outlined"
                                size="small"
                                sx={{mt: 1}}
                                disabled={isLoading || areRelatedStoresLoading}
                            >
                                Додати Вправу
                            </Button>
                        </Paper>

                        {formError && <Typography color="error" sx={{mt: 2}}>{formError}</Typography>}
                        {trainingSessionStore.error &&
                            <Typography color="error" sx={{mt: 1}}>{trainingSessionStore.error}</Typography>}

                        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                            {canShowAssessmentsButton && (
                                <Button
                                    variant="outlined"
                                    color="info"
                                    startIcon={<RateReviewIcon />}
                                    onClick={handleNavigateToAssessments}
                                    disabled={isLoading || trainingSessionStore.loading}
                                >
                                    Оцінки
                                </Button>
                            )}
                            <Button type="submit" variant="contained" color="secondary"
                                    disabled={isLoading || trainingSessionStore.loading || areRelatedStoresLoading}>
                                {isLoading || trainingSessionStore.loading ?
                                    <CircularProgress size={24}/> : (sessionId ? "Зберегти Зміни" : "Створити Заняття")}
                            </Button>
                        </Stack>
                    </Stack>
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default observer(TrainingSessionFormPage);