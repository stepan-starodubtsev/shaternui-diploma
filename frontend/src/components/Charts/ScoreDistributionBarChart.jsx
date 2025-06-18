import React, {useEffect, useState, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell} from 'recharts';
import {
    Paper,
    Typography,
    useTheme,
    CircularProgress,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {tokens} from "../../theme.js";
import standardAssessmentStore from '../../stores/standardAssessmentStore';
import militaryPersonnelStore from '../../stores/militaryPersonnelStore';
import unitStore from '../../stores/unitStore';
import {ScoreTypes} from '../../utils/constants.js';
import {aggregateScoresForBarChart} from '../../utils/chartsUtils.js';

const ScoreDistributionBarChart = observer(() => {
    const theme = useTheme();
    const chartColors = tokens(theme.palette.mode);
    const [selectedUnitId, setSelectedUnitId] = useState('all');

    useEffect(() => {
        if (standardAssessmentStore.assessments.length === 0 && !standardAssessmentStore.loading) {
            standardAssessmentStore.loadAssessments();
        }
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel();
        }
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
    }, []);

    const isLoading = standardAssessmentStore.loading || militaryPersonnelStore.loading || unitStore.loading;

    const chartData = useMemo(() => {
        if (isLoading || !ScoreTypes || ScoreTypes.length === 0 || standardAssessmentStore.assessments.length === 0 || militaryPersonnelStore.personnelList.length === 0 || (selectedUnitId !== 'all' && unitStore.units.length === 0)) {
            return [];
        }
        return aggregateScoresForBarChart(
            standardAssessmentStore.assessments,
            ScoreTypes,
            unitStore.units,
            militaryPersonnelStore.personnelList,
            selectedUnitId
        );
    }, [standardAssessmentStore.assessments, unitStore.units, militaryPersonnelStore.personnelList, selectedUnitId, isLoading]);

    const handleUnitChange = (event) => {
        setSelectedUnitId(event.target.value);
    };

    const getBarFillColor = (scoreValue) => {
        switch (scoreValue) {
            case 'EXCELLENT':
                return chartColors.greenAccent[500];
            case 'GOOD':
                return chartColors.blueAccent[500];
            case 'SATISFACTORY':
                return chartColors.primary[400] || '#f2f0f0';
            case 'PASSED':
                return chartColors.greenAccent[300];
            case 'FAILED':
                return chartColors.redAccent[500];
            default:
                return chartColors.grey[500];
        }
    };

    if (isLoading && chartData.length === 0 && selectedUnitId === 'all') {
        return (
            <Paper elevation={3}
                   sx={{p: 2, height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних для діаграми оцінок...</Typography>
            </Paper>
        );
    }

    const selectedUnitName = selectedUnitId !== 'all'
        ? unitStore.units.find(u => u.unit_id === parseInt(selectedUnitId))?.unit_name
        : null;

    return (
        <Paper elevation={3} sx={{p: 2, height: '450px', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h6" gutterBottom component="div">
                    Розподіл Оцінок {selectedUnitName ? `(Підрозділ: ${selectedUnitName})` : '(Загалом)'}
                </Typography>
                <FormControl size="small" sx={{minWidth: 200}} disabled={unitStore.loading}>
                    <InputLabel id="unit-select-label">Підрозділ</InputLabel>
                    <Select
                        labelId="unit-select-label"
                        id="unit-select"
                        value={selectedUnitId}
                        label="Підрозділ"
                        onChange={handleUnitChange}
                    >
                        <MenuItem value="all"><em>Всі підрозділи</em></MenuItem>
                        {unitStore.units.map((unit) => (
                            <MenuItem key={unit.unit_id} value={unit.unit_id}>
                                {unit.unit_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{top: 5, right: 30, left: 0, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis allowDecimals={false}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="count" name="Кількість">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarFillColor(entry.value)}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Typography variant="subtitle1">
                        {isLoading ? 'Завантаження даних...' : 'Немає даних для відображення для обраного фільтру.'}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
});

export default ScoreDistributionBarChart;