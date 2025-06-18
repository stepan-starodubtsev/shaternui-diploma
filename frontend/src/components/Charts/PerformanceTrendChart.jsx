import React, {useEffect, useState, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
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
import {aggregatePerformanceByMonth} from '../../utils/chartsUtils.js';
import dayjs from 'dayjs';

const PerformanceTrendChart = observer(() => {
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
        if (isLoading || standardAssessmentStore.assessments.length === 0) return [];
        return aggregatePerformanceByMonth(
            standardAssessmentStore.assessments,
            militaryPersonnelStore.personnelList,
            selectedUnitId
        );
    }, [standardAssessmentStore.assessments, militaryPersonnelStore.personnelList, selectedUnitId, unitStore.units, isLoading]);

    const handleUnitChange = (event) => {
        setSelectedUnitId(event.target.value);
    };

    const selectedUnitName = selectedUnitId !== 'all'
        ? unitStore.units.find(u => u.unit_id === parseInt(selectedUnitId))?.unit_name
        : null;

    if (isLoading && chartData.length === 0 && selectedUnitId === 'all') {
        return (
            <Paper elevation={3}
                   sx={{p: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних для графіка успішності...</Typography>
            </Paper>
        );
    }

    const XAxisTickFormatter = (tick) => {
        return dayjs(tick).format('MMM YY');
    };


    return (
        <Paper elevation={3} sx={{p: 2, height: '400px', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h6" gutterBottom component="div">
                    Динаміка Успішності (Позитивні оцінки, %) {selectedUnitName ? `(${selectedUnitName})` : '(Загалом)'}
                </Typography>
                <FormControl size="small" sx={{minWidth: 200}} disabled={unitStore.loading}>
                    <InputLabel id="perf-unit-select-label">Підрозділ</InputLabel>
                    <Select
                        labelId="perf-unit-select-label"
                        id="perf-unit-select"
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
                    <LineChart
                        data={chartData}
                        margin={{top: 5, right: 30, left: 0, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name" tickFormatter={XAxisTickFormatter}/> {/* name - це 'YYYY-MM' */}
                        <YAxis domain={[0, 100]}
                               label={{value: '% позитивних оцінок', angle: -90, position: 'insideLeft'}}
                               allowDecimals={false}/>
                        <Tooltip formatter={(value, name, props) => [`${value}%`, `Успішність`]}/>
                        <Legend/>
                        <Line type="monotone" dataKey="percentage" name="Успішність"
                              stroke={chartColors.primary[500] || theme.palette.primary.main} strokeWidth={2}
                              activeDot={{r: 8}}/>
                    </LineChart>
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

export default PerformanceTrendChart;