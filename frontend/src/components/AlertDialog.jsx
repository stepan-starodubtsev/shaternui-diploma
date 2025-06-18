import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({dialogText, isOpen, handleClose, handleOk, handleCancel}) => {
    return (
        <>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogText}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCancel}>Ні</Button>
                    <Button onClick={handleOk} autoFocus>
                        Так
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialog;