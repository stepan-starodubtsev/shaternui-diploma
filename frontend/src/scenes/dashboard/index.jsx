import React from 'react';
import {observer} from 'mobx-react-lite';
import Header from "../../components/Header.jsx";
import {Box, Grid, useTheme} from "@mui/material";

import TotalMilitaryPersonnelStat from "../../components/Charts/analytics/TotalMilitaryPersonnelStat.jsx";
import WeeklyTrainingSessionsStat from "../../components/Charts/analytics/WeeklyTrainingSessionsStat.jsx";
import CoveredUnitsStat from "../../components/Charts/analytics/CoveredUnitsStat.jsx";

import SessionTypePieChart from "../../components/Charts/SessionTypePieChart.jsx";
import PersonnelByUnitPieChart from "../../components/Charts/PersonnelByUnitPieChart.jsx";
import SessionsByLocationPieChart from "../../components/Charts/SessionsByLocationPieChart.jsx";
import ScoreDistributionBarChart from "../../components/Charts/ScoreDistributionBarChart.jsx";
import TopBar from "../global/TopBar.jsx";
import PerformanceTrendChart from "../../components/Charts/PerformanceTrendChart.jsx";

const Dashboard = observer(() => {
    const theme = useTheme();

    return (
        <Box m="20px">
            <TopBar headerBox={
                <Header title={"Головна панель"} subtitle={"Статистика"}/>
            }/>
            <Grid container spacing={2} mb={3}>
                <Grid item size={4}>
                    <TotalMilitaryPersonnelStat/>
                </Grid>
                <Grid item size={4}>
                    <WeeklyTrainingSessionsStat/>
                </Grid>
                <Grid item size={4}>
                    <CoveredUnitsStat/>
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={3}>
                <Grid item size={4}>
                    <SessionTypePieChart/>
                </Grid>
                <Grid item size={4}>
                    <PersonnelByUnitPieChart/>
                </Grid>
                <Grid item size={4}>
                    <SessionsByLocationPieChart/>
                </Grid>
                <Grid item size={6}>
                    <ScoreDistributionBarChart/>
                </Grid>
                <Grid item size={6}>
                    <PerformanceTrendChart/>
                </Grid>
            </Grid>
        </Box>
    );
});

export default Dashboard;