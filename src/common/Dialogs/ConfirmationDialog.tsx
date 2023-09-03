import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { CustomButton } from '../Inputs/CustomButton';
import LoadingIndicator from '../Indicators/LoadingIndicator';
import { Color } from '../../styles/GlobalStyles';
import { ReactElement } from 'react';

export interface ConfirmationDialogRawProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: (value?: string) => void;
    onExecute?: () => void;
    isLoading?: boolean;
    dialogTitle: string,
    dialogMessage?: string,
    children?: ReactElement
}

export default function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
    const { onClose, open, dialogTitle, dialogMessage, onExecute, isLoading, children, ...other } = props;

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onExecute && onExecute();
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle fontWeight={600}>{dialogTitle}</DialogTitle>
            <DialogContent dividers sx={{ minHeight: 120 }}>
                {dialogMessage}
                { children }
                {
                    isLoading &&
                    <LoadingIndicator />
                }
            </DialogContent>
            <DialogActions>
                <CustomButton
                    fullWidth={false}
                    variant='text'
                    autoFocus
                    onClick={handleCancel}
                    buttonName="Hủy"
                />
                <CustomButton
                    fullWidth={false}
                    sx={{
                        backgroundColor: Color.error,
                        '&:hover': {
                            backgroundColor: Color.errorDarker,
                        },
                    }}
                    onClick={handleOk}
                    buttonName="Xác nhận"
                />
            </DialogActions>
        </Dialog>
    );
}