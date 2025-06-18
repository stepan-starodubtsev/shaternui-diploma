import React, {useEffect} from 'react';
import {Box, useTheme, CircularProgress, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import userStore from "../../stores/userStore.js";
import unitStore from "../../stores/unitStore.js";
import useError from "../../utils/useError.js";
import {UserRolesDisplay} from "../../utils/constants.js";

const UserListPage = () => {
    const theme = useTheme();

    const columns = [
        {field: 'user_id', headerName: 'ID', width: 90},
        {field: 'last_name', headerName: 'Прізвище', flex: 1, cellClassName: "name-column--cell"},
        {field: 'first_name', headerName: "Ім'я", flex: 1},
        {field: 'email', headerName: 'Email', flex: 1,},
        {
            field: 'role',
            headerName: 'Роль',
            flex: 1,
            type: 'singleSelect',
            valueGetter: (value) => {
                const role = UserRolesDisplay.find(r => r.value === value);
                return role ? role.label : value;
            }
        },
        {
            field: 'unit_id',
            headerName: 'Підрозділ',
            flex: 1.5,
            renderCell: (params) => {
                if (!params.value) return 'N/A';
                const unit = unitStore.units.find(u => u.unit_id === params.value);
                return unit ? unit.unit_name : `ID: ${params.value}`;
            }
        },
    ];

    useEffect(() => {
        if (userStore.users.length === 0 && !userStore.loading) {
            userStore.loadUsers();
        }
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
    }, []);

    useError(userStore);
    useError(unitStore);

    const isLoading = userStore.loading || unitStore.loading;

    if (isLoading && userStore.users.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження користувачів...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header title={"Користувачі Системи"}
                        subtitle={"Керування обліковими записами користувачів модуля фіз. підготовки"}/>
            }/>
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={userStore.users.slice()}
                    loading={isLoading}
                    addEntityUrl={"/users/create"}
                    editEntityUrl={"/users/edit"}
                    deleteHandler={userStore.removeUser.bind(userStore)}
                    getRowId={(row) => row.user_id}
                />
            </Box>
        </Box>
    );
}

export default observer(UserListPage);