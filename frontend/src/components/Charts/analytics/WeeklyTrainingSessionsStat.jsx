import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, useTheme } from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import EventIcon from '@mui/icons-material/Event';
import trainingSessionStore from '../../../stores/trainingSessionStore';
import { tokens } from "../../../theme.js";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const WeeklyTrainingSessionsStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) {
            trainingSessionStore.loadSessions();
        }
    }, []);

    if (trainingSessionStore.loading && trainingSessionStore.sessions.length === 0) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const today = dayjs();
    const startOfWeek = today.startOf('week');
    const endOfWeek = today.endOf('week');

    const sessionsThisWeek = trainingSessionStore.sessions.filter(session =>
        dayjs(session.start_datetime).isBetween(startOfWeek, endOfWeek, null, '[]')
    ).length;

    return (
        <StatBox
            title="Занять цього тижня"
            value={sessionsThisWeek}
            icon={<EventIcon sx={{ color: colors.blueAccent[500], fontSize: "26px" }} />}
        />
    );
});

export default WeeklyTrainingSessionsStat;