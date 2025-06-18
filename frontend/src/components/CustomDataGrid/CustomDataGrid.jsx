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
                    '& .MuiDataGrid-toolbarContainer': {
                        '& .MuiButton-root': {
                            color: colors.grey[100],
                        },
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        overflowX: 'auto',
                    },
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    '& .MuiDataGrid-cell.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    '& .MuiDataGrid-cell:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
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