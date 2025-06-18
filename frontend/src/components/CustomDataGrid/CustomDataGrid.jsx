import {ukUA} from "@mui/x-data-grid/locales";
import CustomToolbar from "./CustomToolbox.jsx";
import {DataGrid} from "@mui/x-data-grid";
import * as React from "react";
import {useState} from "react";
import {useTheme} from "@mui/material";
import {tokens} from "../../theme.js";
import {useNavigate} from "react-router-dom";
import AlertDialog from "../AlertDialog.jsx";
import {autoWidthColumns} from "../../utils/autoWidthColumns.js";

const CustomDataGrid = ({
                            rows,
                            columns,
                            addEntityUrl,
                            editEntityUrl,
                            deleteHandler,
                            getRowId
                        }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selectedRowId, setSelectedRowId] = useState();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleCancelDelete = () => {
        setOpen(false);
    };

    const handleConfirmDelete = () => {
        setOpen(false);
        deleteHandler(selectedRowId[0]);
        setSelectedRowId(undefined);
    };


    const handleCancel = () => {
        setOpen(false);
    }

    const handleAddButtonClick = () => {
        navigate(addEntityUrl);
    };
    const handleEditButtonClick = () => {
        if (selectedRowId) {
            navigate(`${editEntityUrl}/` + selectedRowId);
            setSelectedRowId(undefined);
        }
    };
    const handleDeleteButtonClick = () => {
        if (selectedRowId) {
            setOpen(true);
        }
    };

    const handleRowSelection = (newSelection) => {
        setSelectedRowId(newSelection);
    };

    return (
        <>
            <DataGrid
                sx={{
                    // ВИПРАВЛЕНО: Додано повний блок стилів для адаптації DataGrid до теми
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .name-column--cell': {
                        color: colors.purpleAccent[300],
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.primary[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: theme.palette.background.default,
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                        backgroundColor: colors.primary[700],
                    },
                    '& .MuiCheckbox-root': {
                        color: `${colors.purpleAccent[200]} !important`,
                    },
                    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                        // Це виправить колір тексту на кнопках тулбару (Фільтри, Стовпці і т.д.)
                        color: `${theme.palette.text.primary} !important`,
                    },
                    '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': {
                        // Це виправить колір іконок на кнопках тулбару
                        color: `${theme.palette.text.primary} !important`,
                    }
                }}

                key={rows.length}
                rows={rows}
                columns={autoWidthColumns(columns)}
                localeText={ukUA.components.MuiDataGrid.defaultProps.localeText}
                rowSelectionModel={selectedRowId}
                onRowSelectionModelChange={handleRowSelection}
                slots={{
                    toolbar: () =>
                        (<CustomToolbar handleAddButtonClick={handleAddButtonClick}
                                        handleEditButtonClick={handleEditButtonClick}
                                        handleDeleteButtonClick={handleDeleteButtonClick}
                                        withoutEdit={!editEntityUrl}/>)
                }}
                getRowId={getRowId}
            />
            <AlertDialog dialogText={`Видалити №${selectedRowId}?`} isOpen={open} onClose={handleCancelDelete}
                         handleOk={handleConfirmDelete} handleCancel={handleCancel}/>
        </>
    );
};

export default CustomDataGrid;