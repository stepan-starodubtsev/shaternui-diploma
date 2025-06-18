import React, { useEffect } from 'react';
import { Box, useTheme, CircularProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import locationStore from "../../stores/locationStore";
import useError from "../../utils/useError.js";

const LocationListPage = () => {
    const theme = useTheme();

    const columns = [
        { field: 'location_id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Назва локації', flex: 1, cellClassName: "name-column--cell" },
        { field: 'description', headerName: 'Опис', flex: 2 },
    ];

    useEffect(() => {
        if (locationStore.locations.length === 0 && !locationStore.loading) {
            locationStore.loadLocations();
        }
    }, []);

    useError(locationStore);

    if (locationStore.loading && locationStore.locations.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Завантаження локацій...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ m: "20px" }}>
            <TopBar headerBox={
                <Header title={"Локації"} subtitle={"Керування місцями проведення занять"} />
            } />
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={locationStore.locations.slice()}
                    loading={locationStore.loading}
                    addEntityUrl={"/locations/create"}
                    editEntityUrl={"/locations/edit"}
                    deleteHandler={locationStore.removeLocation.bind(locationStore)}
                    getRowId={(row) => row.location_id}
                />
            </Box>
        </Box>
    );
}

export default observer(LocationListPage);