import React, { useEffect, useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import { localizer } from '../../utils/calendarLocalizer'; // Імпортуємо наш локалайзер
import { tokens } from '../../theme';

const LessonsCalendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { lessonStore } = useStore();
    const { lessons, fetchAll } = lessonStore;

    useEffect(() => {
        if (lessons.length === 0) {
            fetchAll();
        }
    }, [fetchAll, lessons.length]);

    // Трансформуємо наші заняття у формат подій, зрозумілий для календаря
    const events = useMemo(() =>
            lessons.map(lesson => ({
                id: lesson.id,
                title: `${lesson.name} (${lesson.educationalGroup.name})`,
                start: new Date(lesson.startTime),
                end: new Date(lesson.endTime),
                allDay: false,
                resource: lesson, // Зберігаємо оригінальний об'єкт для доступу
            })),
        [lessons]
    );

    // Обробник кліку на подію в календарі
    const handleSelectEvent = (event) => {
        // Переходимо на сторінку редагування відповідного заняття
        navigate(`/lessons/edit/${event.id}`);
    };

    // Стилізація подій в календарі
    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: colors.purpleAccent[600],
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <Box m="20px">
            <Header title="КАЛЕНДАР" subtitle="Календар занять" />
            <Box
                height="75vh"
                sx={{
                    "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view": {
                        backgroundColor: theme.palette.background.default,
                    },
                    "& .rbc-header": {
                        backgroundColor: colors.primary[600],
                    }
                }}
            >
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    messages={{
                        next: "Наступний",
                        previous: "Попередній",
                        today: "Сьогодні",
                        month: "Місяць",
                        week: "Тиждень",
                        day: "День",
                        agenda: "Розклад",
                        date: "Дата",
                        time: "Час",
                        event: "Подія",
                    }}
                />
            </Box>
        </Box>
    );
};

export default observer(LessonsCalendar);