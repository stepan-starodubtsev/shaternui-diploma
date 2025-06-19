import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const LessonListPage = () => {
    const { lessonStore } = useStore();
    const { lessons, isLoading, fetchAll, deleteItem } = lessonStore;

    useEffect(() => {
        if (lessons.length === 0) {
            fetchAll();
        }
    }, [fetchAll, lessons.length]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Назва заняття', flex: 1.5, cellClassName: 'name-column--cell' },
        {
            field: 'academicDiscipline',
            headerName: 'Дисципліна',
            flex: 1.5,
            renderCell: (params) => params.row.academicDiscipline?.name || '—',
        },
        {
            field: 'instructor',
            headerName: 'Викладач',
            flex: 1.5,
            renderCell: (params) => params.row.instructor?.fullName || '—',
        },
        {
            field: 'educationalGroup',
            headerName: 'Група',
            flex: 1,
            renderCell: (params) => params.row.educationalGroup?.name || '—',
        },
        {
            field: 'startTime',
            headerName: 'Час початку',
            flex: 1,
            renderCell: (params) => format(new Date(params.row.startTime), 'dd.MM.yyyy HH:mm'),
        },
        {
            field: 'endTime',
            headerName: 'Час кінця',
            flex: 1,
            renderCell: (params) => format(new Date(params.row.endTime), 'dd.MM.yyyy HH:mm'),
        },
    ];

    return (
        <Box m="20px">
            <Header title="ЗАНЯТТЯ" subtitle="Керування розкладом занять" />
            <Box>
                <CustomDataGrid
                    rows={lessons}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/lessons/new"
                    editEntityUrl="/lessons/edit"
                    deleteHandler={deleteItem.bind(lessonStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(LessonListPage);