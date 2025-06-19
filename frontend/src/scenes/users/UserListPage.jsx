import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import CustomDataGrid from '../../components/CustomDataGrid/CustomDataGrid';

const UserListPage = () => {
    const { userStore } = useStore();
    const { users, isLoading, fetchAll, deleteItem } = userStore;

    useEffect(() => {
        if (users.length === 0) {
            fetchAll();
        }
    }, [fetchAll, users.length]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Логін', flex: 1, cellClassName: 'name-column--cell' },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { field: 'role', headerName: 'Роль', flex: 1 },
        {
            field: 'instructorProfile',
            headerName: 'Прив\'язаний викладач',
            flex: 2,
            renderCell: (params) => {
                return params.row.instructorProfile?.fullName || '—';
            },
        },
    ];

    return (
        <Box m="20px">
            <Header title="КОРИСТУВАЧІ" subtitle="Керування акаунтами користувачів системи" />
            <Box>
                <CustomDataGrid
                    rows={users}
                    columns={columns}
                    loading={isLoading}
                    addEntityUrl="/users/new"
                    editEntityUrl="/users/edit"
                    deleteHandler={deleteItem.bind(userStore)}
                    getRowId={(row) => row.id}
                />
            </Box>
        </Box>
    );
};

export default observer(UserListPage);