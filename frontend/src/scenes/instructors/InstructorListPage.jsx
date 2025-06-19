import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const InstructorListPage = () => {
    const { instructorStore } = useStore();
    const { instructors, isLoading, fetchAll, deleteItem } = instructorStore;

    useEffect(() => {
        if (instructors.length === 0) {
            fetchAll();
        }
    }, [fetchAll, instructors.length]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'ПІБ', flex: 2, cellClassName: 'name-column--cell' },
        {
            field: 'rank',
            headerName: 'Звання',
            flex: 1,
            // ВИПРАВЛЕНО: Використовуємо renderCell замість valueGetter
            renderCell: (params) => params.row.rank || '—',
        },
        {
            field: 'academicDegree',
            headerName: 'Науковий ступінь',
            flex: 1.5,
            // ВИПРАВЛЕНО: Використовуємо renderCell замість valueGetter
            renderCell: (params) => params.row.academicDegree || '—',
        },
        { field: 'position', headerName: 'Посада', flex: 1.5 },
    ];

    return (
        <Box m="20px">
            <Header title="ВИКЛАДАЧІ" subtitle="Керування даними викладачів" />
            <Box>
                <CustomDataGrid
                    rows={instructors}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/instructors/new"
                    editEntityUrl="/instructors/edit"
                    deleteHandler={deleteItem.bind(instructorStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(InstructorListPage);