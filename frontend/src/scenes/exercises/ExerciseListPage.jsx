import React, {useEffect} from 'react';
import {Box, CircularProgress, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import exerciseStore from "../../stores/exerciseStore";
import useError from "../../utils/useError.js";

const ExerciseListPage = () => {
    const theme = useTheme();

    const columns = [
        {field: 'exercise_id', headerName: 'ID', width: 90},
        {field: 'exercise_name', headerName: 'Назва вправи', flex: 1, cellClassName: "name-column--cell"},
        {field: 'description', headerName: 'Опис', flex: 2},
    ];

    useEffect(() => {
        if (exerciseStore.exercises.length === 0 && !exerciseStore.loading) {
            exerciseStore.loadExercises();
        }
    }, []);

    useError(exerciseStore);

    if (exerciseStore.loading && exerciseStore.exercises.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження вправ...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header title={"Вправи"} subtitle={"Керування довідником фізичних вправ"}/>
            }/>
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={exerciseStore.exercises.slice()}
                    loading={exerciseStore.loading}
                    addEntityUrl={"/exercises/create"}
                    editEntityUrl={"/exercises/edit"}
                    deleteHandler={exerciseStore.removeExercise.bind(exerciseStore)}
                    getRowId={(row) => row.exercise_id}
                />
            </Box>
        </Box>
    );
}

export default observer(ExerciseListPage);