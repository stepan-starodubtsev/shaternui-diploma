import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import GenericPieChart from './GenericPieChart.jsx';
import militaryPersonnelStore from '../../stores/militaryPersonnelStore';
import unitStore from '../../stores/unitStore.js';
import {aggregateDataForPieChart} from '../../utils/chartsUtils.js';
import {Typography} from '@mui/material';

const PersonnelByUnitPieChart = observer(() => {
    useEffect(() => {
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel();
        }
        if (unitStore.units.length === 0 && !unitStore.loading && militaryPersonnelStore.personnelList.length > 0) {
            unitStore.loadUnits();
        }
    }, []);

    if ((militaryPersonnelStore.loading && militaryPersonnelStore.personnelList.length === 0) || (unitStore.loading && unitStore.units.length === 0)) {
        return <Typography>Завантаження розподілу особового складу...</Typography>;
    }

    const unitConstants = unitStore.units.map(unit => ({
        value: unit.unit_id,
        label: unit.unit_name
    }));

    const chartData = aggregateDataForPieChart(
        militaryPersonnelStore.personnelList,
        'unit_id',
        unitConstants
    );

    return <GenericPieChart title="Особовий склад за підрозділами" data={chartData}/>;
});

export default PersonnelByUnitPieChart;