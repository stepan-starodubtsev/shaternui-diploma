import React, {useEffect} from 'react';
import {Box, useTheme, CircularProgress, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import standardAssessmentStore from "../../stores/standardAssessmentStore";
import trainingSessionStore from "../../stores/trainingSessionStore";
import militaryPersonnelStore from "../../stores/militaryPersonnelStore";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";
import {ScoreTypes} from "../../utils/constants.js";
import dayjs from 'dayjs';

const StandardAssessmentListPage = () => {
    const theme = useTheme();

    const columns = [
        {field: 'assessment_id', headerName: 'ID', width: 90},
        {
            field: 'session_id',
            headerName: 'ID Заняття',
            width: 120,
            renderCell: (params) => {
                const session = trainingSessionStore.sessions.find(s => s.session_id === params.value);
                return session ? `Заняття №${session.session_id} (${dayjs(session.start_datetime).format('DD.MM.YY')})` : params.value;
            }
        },
        {
            field: 'military_person_id',
            headerName: 'Військовослужбовець',
            flex: 1.5,
            renderCell: (params) => {
                const person = militaryPersonnelStore.personnelList.find(p => p.military_person_id === params.value);
                return person ? `${person.last_name} ${person.first_name}` : `ID: ${params.value}`;
            }
        },
        {
            field: 'exercise_id',
            headerName: 'Вправа',
            flex: 1,
            renderCell: (params) => {
                const exercise = exerciseStore.exercises.find(ex => ex.exercise_id === params.value);
                return exercise ? exercise.exercise_name : `ID: ${params.value}`;
            }
        },
        {
            field: 'score',
            headerName: 'Оцінка',
            flex: 0.7,
            type: 'singleSelect',
            valueOptions: ScoreTypes,
            valueGetter: (value) => {
                const scoreType = ScoreTypes.find(st => st.value === value);
                return scoreType ? scoreType.label : value;
            }
        },
        {
            field: 'assessment_datetime',
            headerName: 'Дата оцінки',
            flex: 1,
            type: 'dateTime',
            valueGetter: (value) => value ? new Date(value) : null,
            renderCell: (params) => params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : '',
        },
        {field: 'notes', headerName: 'Примітки', flex: 1},
    ];

    useEffect(() => {
        if (standardAssessmentStore.assessments.length === 0 && !standardAssessmentStore.loading) {
            standardAssessmentStore.loadAssessments();
        }
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) trainingSessionStore.loadSessions();
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) militaryPersonnelStore.loadPersonnel();
        if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) exerciseStore.loadExercises();
    }, []);

    useError(standardAssessmentStore);
    useError(trainingSessionStore);
    useError(militaryPersonnelStore);
    useError(exerciseStore);


    if (standardAssessmentStore.loading && standardAssessmentStore.assessments.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження оцінок...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header title={"Оцінки за нормативи"} subtitle={"Перегляд та керування оцінками"}/>
            }/>
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={standardAssessmentStore.assessments.slice()}
                    loading={standardAssessmentStore.loading || trainingSessionStore.loading || militaryPersonnelStore.loading || exerciseStore.loading}
                    addEntityUrl={"/standard-assessments/create"}
                    editEntityUrl={"/standard-assessments/edit"}
                    deleteHandler={standardAssessmentStore.removeAssessment.bind(standardAssessmentStore)}
                    getRowId={(row) => row.assessment_id}
                />
            </Box>
        </Box>
    );
}

export default observer(StandardAssessmentListPage);