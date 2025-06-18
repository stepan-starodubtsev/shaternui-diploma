import React, {useEffect} from 'react';
import {Box, useTheme, CircularProgress, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import dayjs from 'dayjs';
import trainingSessionStore from "../../stores/trainingSessionStore";
import userStore from "../../stores/userStore.js";
import unitStore from "../../stores/unitStore.js";
import locationStore from "../../stores/locationStore";
import useError from "../../utils/useError.js";
import {SessionTypes} from "../../utils/constants.js";

const TrainingSessionListPage = () => {
    const theme = useTheme();

    const columns = [
        {field: 'session_id', headerName: 'ID', width: 90},
        {
            field: 'session_type',
            headerName: 'Тип заняття',
            flex: 1,
            type: 'singleSelect',
            valueGetter: (value) => {
                const type = SessionTypes.find(st => st.value === value);
                return type ? type.label : value.session_type;
            }
        },
        {
            field: 'start_datetime',
            headerName: 'Час початку',
            flex: 1.5,
            type: 'dateTime',
            valueGetter: (value) => value ? new Date(value) : null,
            renderCell: (params) => params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : '',
        },
        {
            field: 'location_id',
            headerName: 'Локація',
            flex: 1,
            renderCell: (params) => {
                const location = locationStore.locations.find(loc => loc.location_id === params.value);
                return location ? location.name : `ID: ${params.value}`;
            }
        },
        {
            field: 'conducted_by_user_id',
            headerName: 'Проводить',
            flex: 1.5,
            renderCell: (params) => {
                const user = userStore.users.find(u => u.user_id === params.value);
                return user ? `${user.last_name} ${user.first_name}` : `User ID: ${params.value}`;
            }
        },
        {
            field: 'unit_id',
            headerName: 'Підрозділ',
            flex: 1.5,
            renderCell: (params) => {
                if (!params.value) return 'N/A';
                const unit = unitStore.units.find(u => u.unit_id === params.value);
                return unit ? unit.unit_name : `Unit ID: ${params.value}`;
            }
        },
        {
            field: 'exercises',
            headerName: 'Вправи',
            flex: 2,
            sortable: false,
            renderCell: (params) => {
                const exercises = params.row.exercises || [];
                const exerciseNames = exercises.map(ex => ex.exercise_name || `ID: ${ex.exercise_id}`).join(', ');
                return (
                    <Typography variant="body2" noWrap title={exerciseNames}>
                        {exerciseNames || 'Немає вправ'}
                    </Typography>
                );
            }
        }
    ];

    useEffect(() => {
        if (trainingSessionStore.sessions.length === 0 && !trainingSessionStore.loading) {
            trainingSessionStore.loadSessions();
        }
    }, []);

    useError(trainingSessionStore);
    useError(userStore);
    useError(unitStore);
    useError(locationStore);

    const isLoading = trainingSessionStore.loading || userStore.loading || unitStore.loading || locationStore.loading;

    if (isLoading && trainingSessionStore.sessions.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження занять...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header title={"Тренувальні Заняття"} subtitle={"Керування плановими та фактичними заняттями"}/>
            }/>
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={trainingSessionStore.sessions}
                    loading={isLoading}
                    addEntityUrl={"/training-sessions/create"}
                    editEntityUrl={"/training-sessions/edit"}
                    deleteHandler={trainingSessionStore.removeSession.bind(trainingSessionStore)}
                    getRowId={(row) => row.session_id}
                />
            </Box>
        </Box>
    );
}

export default observer(TrainingSessionListPage);