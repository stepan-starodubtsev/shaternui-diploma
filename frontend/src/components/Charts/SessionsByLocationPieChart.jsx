import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GenericPieChart from './GenericPieChart.jsx';
import trainingSessionStore from '../../stores/trainingSessionStore';
import locationStore from '../../stores/locationStore';
import { aggregateDataForPieChart } from '../../utils/chartsUtils.js';
import { Typography } from '@mui/material';

const SessionsByLocationPieChart = observer(() => {
    useEffect(() => {
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) {
            trainingSessionStore.loadSessions();
        }
        if (locationStore.locations.length === 0 && !locationStore.loading && trainingSessionStore.sessions.length > 0) {
            locationStore.loadLocations();
        }
    }, []);

    if ((trainingSessionStore.loading && trainingSessionStore.sessions.length === 0) || (locationStore.loading && locationStore.locations.length === 0)) {
        return <Typography>Завантаження розподілу занять за локаціями...</Typography>;
    }

    const locationConstants = locationStore.locations.map(location => ({
        value: location.location_id,
        label: location.name
    }));

    const chartData = aggregateDataForPieChart(
        trainingSessionStore.sessions,
        'location_id',
        locationConstants
    );

    return <GenericPieChart title="Розподіл занять за локаціями" data={chartData} />;
});

export default SessionsByLocationPieChart;