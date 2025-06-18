import React, {useEffect} from 'react';
import {Box, CircularProgress, Typography, useTheme} from "@mui/material";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import CustomDataGrid from "../../components/CustomDataGrid/CustomDataGrid.jsx";
import TopBar from "../global/TopBar.jsx";
import militaryPersonnelStore from "../../stores/militaryPersonnelStore";
import unitStore from "../../stores/unitStore.js";
import useError from "../../utils/useError.js";
import dayjs from 'dayjs';

const MilitaryPersonnelListPage = () => {
    const theme = useTheme();

    const columns = [
        { field: 'military_person_id', headerName: 'ID', width: 90 },
        { field: 'last_name', headerName: 'Прізвище', flex: 1, cellClassName: "name-column--cell" },
        { field: 'first_name', headerName: "Ім'я", flex: 1 },
        { field: 'rank', headerName: 'Звання', flex: 0.7 },
        {
            field: 'date_of_birth',
            headerName: 'Дата народження',
            flex: 1,
            type: 'date',
            valueGetter: (value) => value ? new Date(value) : null,
            renderCell: (params) => params.value ? dayjs(params.value).format('DD.MM.YYYY') : '',
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
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel();
        }
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
    }, []);

    useError(militaryPersonnelStore);
    useError(unitStore);

    if (militaryPersonnelStore.loading && militaryPersonnelStore.personnelList.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Завантаження особового складу...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ m: "20px" }}>
            <TopBar headerBox={
                <Header title={"Військовослужбовці"} subtitle={"Керування особовим складом для обліку фіз. підготовки"} />
            } />
            <Box>
                <CustomDataGrid
                    columns={columns}
                    rows={militaryPersonnelStore.personnelList.slice()}
                    loading={militaryPersonnelStore.loading}
                    addEntityUrl={"/military-personnel/create"}
                    editEntityUrl={"/military-personnel/edit"}
                    deleteHandler={militaryPersonnelStore.removePersonnel.bind(militaryPersonnelStore)}
                    getRowId={(row) => row.military_person_id}
                />
            </Box>
        </Box>
    );
}

export default observer(MilitaryPersonnelListPage);