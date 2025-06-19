import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const EducationalGroupListPage = () => {
    const { educationalGroupStore } = useStore();
    const { groups, isLoading, fetchAll, deleteItem } = educationalGroupStore;

    useEffect(() => {
        if (groups.length === 0) {
            fetchAll();
        }
    }, [fetchAll, groups.length]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Назва групи', flex: 1, cellClassName: 'name-column--cell' },
        {
            field: 'cadetCount',
            headerName: 'К-сть курсантів',
            flex: 1,
            // ВИПРАВЛЕНО: Замінюємо valueGetter на renderCell для надійності
            renderCell: (params) => {
                // params.row завжди буде доступний в renderCell
                return params.row.cadets?.length || 0;
            },
        },
    ];

    return (
        <Box m="20px">
            <Header title="НАВЧАЛЬНІ ГРУПИ" subtitle="Керування навчальними групами" />
            <Box>
                <CustomDataGrid
                    rows={groups}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/educational-groups/new"
                    editEntityUrl="/educational-groups/edit"
                    deleteHandler={deleteItem.bind(educationalGroupStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(EducationalGroupListPage);