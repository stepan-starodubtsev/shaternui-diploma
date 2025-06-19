import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const CadetListPage = () => {
    const { cadetStore } = useStore();
    const { cadets, isLoading, fetchAll, deleteItem } = cadetStore;

    useEffect(() => {
        if (cadets.length === 0) {
            fetchAll();
        }
    }, [fetchAll, cadets.length]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'ПІБ', flex: 2, cellClassName: 'name-column--cell' },
        { field: 'rank', headerName: 'Звання', flex: 1 },
        { field: 'position', headerName: 'Посада', flex: 1 },
        {
            field: 'educationalGroup',
            headerName: 'Навчальна група',
            flex: 1,
            renderCell: (params) => {
                return params.row.educationalGroup?.name || 'Не призначено';
            },
        },
    ];

    return (
        <Box m="20px">
            <Header title="КУРСАНТИ" subtitle="Керування даними курсантів" />
            <Box>
                <CustomDataGrid
                    rows={cadets}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/cadets/new"
                    editEntityUrl="/cadets/edit"
                    deleteHandler={deleteItem.bind(cadetStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(CadetListPage);