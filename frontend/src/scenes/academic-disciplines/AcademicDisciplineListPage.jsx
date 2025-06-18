import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const AcademicDisciplineListPage = () => {
    const { academicDisciplineStore } = useStore();
    const { disciplines, isLoading, fetchAll, deleteItem } = academicDisciplineStore;

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Колонка "Дії" тепер не потрібна, CustomDataGrid додасть її автоматично
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Назва', flex: 1, cellClassName: 'name-column--cell' },
        { field: 'description', headerName: 'Опис', flex: 2 },
    ];

    return (
        <Box m="20px">
            <Header title="НАВЧАЛЬНІ ДИСЦИПЛІНИ" subtitle="Керування навчальними дисциплінами" />
            <Box>
                <CustomDataGrid
                    rows={disciplines}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/academic-disciplines/new"
                    editEntityUrl="/academic-disciplines/edit"
                    deleteHandler={deleteItem.bind(academicDisciplineStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(AcademicDisciplineListPage);