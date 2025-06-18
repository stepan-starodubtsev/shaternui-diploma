import React, {useState, useEffect, useMemo} from 'react';
import {
    Box, List, ListItem, ListItemText, Typography, useTheme, Paper, CircularProgress, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from "@mui/material";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import ukLocale from '@fullcalendar/core/locales/uk';
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import CloseIcon from '@mui/icons-material/Close';

import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import trainingSessionStore from "../../stores/trainingSessionStore";
import userStore from "../../stores/userStore.js";
import unitStore from "../../stores/unitStore.js";
import locationStore from "../../stores/locationStore";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";
import {SessionTypes, ROLES} from "../../utils/constants.js";
import authStore from '../../stores/authStore.js';
import {tokens} from "../../theme.js";

const CalendarPage = observer(() => {
    const theme = useTheme();
    const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
    const navigate = useNavigate();
    dayjs.locale('uk');

    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([
                (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) ? trainingSessionStore.loadSessions() : Promise.resolve(),
                (userStore.users.length === 0 && !userStore.loading) ? userStore.loadUsers() : Promise.resolve(),
                (unitStore.units.length === 0 && !unitStore.loading) ? unitStore.loadUnits() : Promise.resolve(),
                (locationStore.locations.length === 0 && !locationStore.loading) ? locationStore.loadLocations() : Promise.resolve(),
                (exerciseStore.exercises.length === 0 && !exerciseStore.loading) ? exerciseStore.loadExercises() : Promise.resolve()
            ]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useError(trainingSessionStore);
    useError(userStore);
    useError(unitStore);
    useError(locationStore);
    useError(exerciseStore);

    const formattedEvents = useMemo(() => {
        return trainingSessionStore.sessions.map(session => {
            const sessionType = SessionTypes.find(st => st.value === session.session_type);
            const sessionTypeLabel = sessionType ? sessionType.label : session.session_type;

            const unit = unitStore.units.find(u => u.unit_id === session.unit_id);
            const unitName = unit ? unit.unit_name : (session.unit_id ? `Підрозділ ID: ${session.unit_id}` : 'Загальне');

            const conductor = userStore.users.find(u => u.user_id === session.conducted_by_user_id);
            const conductorName = conductor ? `${conductor.last_name} ${conductor.first_name}` : (session.conducted_by_user_id ? `User ID: ${session.conducted_by_user_id}` : 'N/A');

            const location = locationStore.locations.find(l => l.location_id === session.location_id);
            const locationName = location ? location.name : (session.location_id ? `Локація ID: ${session.location_id}` : 'N/A');

            let backgroundColor = colors.primary[500];
            let textColor = theme.palette.getContrastText(backgroundColor);

            if (session.session_type === 'STANDARDS_ASSESSMENT') {
                backgroundColor = colors.blueAccent[500] || theme.palette.info.main;
                textColor = theme.palette.getContrastText(backgroundColor);
            } else if (session.session_type === 'UNIT_TRAINING') {
                backgroundColor = colors.greenAccent[500] || theme.palette.success.main;
                textColor = theme.palette.getContrastText(backgroundColor);
            }


            const eventExercises = session.exercises && Array.isArray(session.exercises) ? session.exercises.map(exSession => {
                const fullEx = exerciseStore.exercises.find(e => e.exercise_id === exSession.exercise_id);
                return {
                    exercise_id: exSession.exercise_id,
                    exercise_name: fullEx?.exercise_name || `Вправа ID ${exSession.exercise_id}`,
                    order_in_session: exSession.SessionExercise?.order_in_session || exSession.order_in_session
                };
            }).sort((a, b) => a.order_in_session - b.order_in_session) : [];

            return {
                id: String(session.session_id),
                title: `${sessionTypeLabel} (${unitName})`,
                start: session.start_datetime,
                end: session.end_datetime,
                allDay: dayjs(session.end_datetime).diff(dayjs(session.start_datetime), 'hour') >= 23,
                extendedProps: {
                    ...session,
                    sessionTypeLabel,
                    unitName,
                    conductorName,
                    locationName,
                    exercisesDetails: eventExercises,
                },
                backgroundColor,
                borderColor: backgroundColor,
                textColor: textColor
            };
        });
    }, [trainingSessionStore.sessions, userStore.users, unitStore.units, locationStore.locations, exerciseStore.exercises, colors, theme.palette]);

    const handleDateClick = (selectInfo) => {
        if (authStore.userRole === ROLES.ADMIN || authStore.userRole === ROLES.DEPARTMENT_EMPLOYEE || authStore.userRole === ROLES.COMMANDER) {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect();


            let endDate = dayjs(selectInfo.endStr);
            if (selectInfo.allDay && dayjs(selectInfo.endStr).isAfter(dayjs(selectInfo.startStr))) {
                endDate = endDate.subtract(1, 'day');
            }

            navigate("/training-sessions/create", {
                state: {
                    startDate: dayjs(selectInfo.startStr).toISOString(),
                    endDate: endDate.hour(dayjs(selectInfo.startStr).hour() + 1).minute(dayjs(selectInfo.startStr).minute()).toISOString(),
                    allDay: selectInfo.allDay
                }
            });
        } else {
            alert("У вас недостатньо прав для створення нового заняття.");
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleEditEvent = () => {
        if (selectedEvent) {
            navigate(`/training-sessions/edit/${selectedEvent.id}`);
        }
        handleModalClose();
    };

    const handleDeleteEvent = async () => {
        if (selectedEvent && window.confirm(`Ви впевнені, що хочете видалити заняття: ${selectedEvent.title}?`)) {
            setIsLoading(true);
            await trainingSessionStore.removeSession(selectedEvent.id);
            setIsLoading(false);
            handleModalClose();
        }
    };

    const canManageEvents = authStore.userRole === ROLES.ADMIN ||
        authStore.userRole === ROLES.DEPARTMENT_EMPLOYEE ||
        authStore.userRole === ROLES.COMMANDER ||
        authStore.userRole === ROLES.INSTRUCTOR;


    if (isLoading && trainingSessionStore.sessions.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/> <Typography sx={{ml: 2}}>Завантаження календаря...</Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <TopBar headerBox={
                <Header title="Календар Занять" subtitle="Візуальне представлення розкладу"/>
            }/>
            <Paper elevation={3} sx={{p: {xs: 1, sm: 2}, mt: 2}}>
                <FullCalendar
                    locale={ukLocale}
                    height="auto"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    initialView="dayGridMonth"
                    editable={false}
                    selectable={canManageEvents}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                    events={formattedEvents}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false,
                        hour12: false
                    }}
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false,
                        hour12: false
                    }}
                    nowIndicator={true}
                    firstDay={1}
                />
            </Paper>

            {selectedEvent && (
                <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth scroll="paper">
                    <DialogTitle sx={{
                        backgroundColor: selectedEvent.backgroundColor || theme.palette.primary.main,
                        color: selectedEvent.textColor || theme.palette.getContrastText(selectedEvent.backgroundColor || theme.palette.primary.main),
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {selectedEvent.title}
                        <IconButton onClick={handleModalClose} size="small" sx={{color: 'inherit'}}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1"
                                    gutterBottom><strong>Тип:</strong> {selectedEvent.extendedProps.sessionTypeLabel}
                        </Typography>
                        <Typography variant="body1"
                                    gutterBottom><strong>Час:</strong> {dayjs(selectedEvent.start).format('DD.MM.YYYY HH:mm')} - {selectedEvent.end ? dayjs(selectedEvent.end).format('HH:mm') : 'N/A'}
                        </Typography>
                        <Typography variant="body1"
                                    gutterBottom><strong>Локація:</strong> {selectedEvent.extendedProps.locationName}
                        </Typography>
                        <Typography variant="body1"
                                    gutterBottom><strong>Проводить:</strong> {selectedEvent.extendedProps.conductorName}
                        </Typography>
                        <Typography variant="body1"
                                    gutterBottom><strong>Підрозділ:</strong> {selectedEvent.extendedProps.unitName}
                        </Typography>

                        {selectedEvent.extendedProps.exercisesDetails && selectedEvent.extendedProps.exercisesDetails.length > 0 && (
                            <Box mt={2}>
                                <Typography variant="h6" gutterBottom><strong>Заплановані вправи:</strong></Typography>
                                <List dense disablePadding>
                                    {selectedEvent.extendedProps.exercisesDetails.map((ex, index) => (
                                        <ListItem key={ex.exercise_id || index} sx={{pl: 2}}>
                                            <ListItemText
                                                primary={`${ex.order_in_session}. ${ex.exercise_name || 'Невідома вправа'}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        {selectedEvent.extendedProps.session_type === 'STANDARDS_ASSESSMENT' && selectedEvent.extendedProps.unit_id && (
                            <Box mt={2} textAlign="center">
                                <Button
                                    variant="outlined"
                                    color="info"
                                    onClick={() => {
                                        navigate(`/training-sessions/${selectedEvent.id}/unit/${selectedEvent.extendedProps.unit_id}/assessments`);
                                        handleModalClose();
                                    }}
                                >
                                    Перейти до оцінювання
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {canManageEvents && (
                            <>
                                <Button onClick={handleEditEvent} color="primary">Редагувати</Button>
                                <Button onClick={handleDeleteEvent} color="error" disabled={isLoading}>Видалити</Button>
                            </>
                        )}
                        <Button onClick={handleModalClose}>Закрити</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
});

export default CalendarPage;