import React, { useEffect } from 'react';
import { Box, useTheme, CircularProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import unitStore from "../../stores/unitStore.js";
import userStore from "../../stores/userStore.js";
import useError from "../../utils/useError.js";

const UnitListPage = () => {
    const theme = useTheme();

    const columns = [
        { field: 'unit_id', headerName: 'ID', width: 90 },
        { field: 'unit_name', headerName: 'Назва підрозділу', flex: 1, cellClassName: "name-column--cell" },
        {
            field: 'commander_id',
            headerName: 'Командир',
            flex: 1,
            renderCell: (params) => {
                if (!params.row.unit_id) return 'N/A';
                const commander = userStore.users.find(user => user.unit_id === params.row.unit_id);
                return commander ? `${commander.last_name} ${commander.first_name}` : 'N/A';
            }
        }
    ];

    useEffect(() => {
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }

        if (userStore.users.length === 0 && !userStore.loading) {
            userStore.loadUsers();
        }
    }, []);

    useError(unitStore);
    useError(userStore);

    const isLoading = unitStore.loading || userStore.loading;


    if (isLoading && unitStore.units.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Завантаження підрозділів...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ m: "20px" }}>
            <TopBar headerBox={
                <Header title={"Підрозділи"} subtitle={"Керування підрозділами для обліку фізичної підготовки"} />
            } />
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={unitStore.units.slice()}
                    loading={isLoading}
                    addEntityUrl={"/units/create"}
                    editEntityUrl={"/units/edit"}
                    deleteHandler={unitStore.removeUnit.bind(unitStore)}
                    getRowId={(row) => row.unit_id}
                />
            </Box>
        </Box>
    );
}

export default observer(UnitListPage);