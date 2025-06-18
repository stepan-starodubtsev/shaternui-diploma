import {GridToolbar} from "@mui/x-data-grid";
import {IconButton, Toolbar, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from "react";
import {authStore} from "../../stores/authStore.js";
import {ROLES} from "../../utils/constants.js";

const CustomToolbar = ({handleAddButtonClick, handleEditButtonClick, handleDeleteButtonClick, withoutEdit}) => {
    return (
        <Toolbar>
            <GridToolbar/>
            {authStore.user.role !== ROLES.COMMANDER ?
                (<div style={{marginLeft: 'auto'}}>
                    <Tooltip title={'Додати'}>
                        <IconButton
                            onClick={handleAddButtonClick}
                            sx={{mr: 2}}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                    {!withoutEdit &&
                        (<Tooltip title={'Редагувати'}>
                            <IconButton
                                onClick={handleEditButtonClick}
                                sx={{mr: 2}}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>)}
                    <Tooltip title={'Видалити'}>
                        <IconButton
                            onClick={handleDeleteButtonClick}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </div>) : null}
        </Toolbar>
    );
};

export default CustomToolbar;