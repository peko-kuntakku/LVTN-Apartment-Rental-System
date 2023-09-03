import { getContractStatus, getContractStatusTextColor } from '../../utils/contractUtils';
import { getUserBlockStatusText, getUserBlockStatusTextColor } from '../../utils/customerUtils';
import { getStatusTextColor, getApartmentStatus } from '../../utils/apartmentUtils';
import { Typography } from '@mui/material';
import { getInvoiceStatusText, getInvoiceStatusTextColor } from '../../utils/invoiceUtils';
import { getRequestStatusText, getRequestStatusTextColor } from '../../utils/requestUtils';
import { Color } from '../../styles/GlobalStyles';
import { getAttendanceResultStatusText } from '../../utils/attendanceUtils';

interface StatusCellProps {
    tableKey: string | undefined,
    value: any,
}

const StatusCell = ({ tableKey, value }: StatusCellProps) => {
    switch (tableKey) {
        case 'apartment':
            return (
                <Typography
                    color={getStatusTextColor(value)}
                    variant="body2"
                >
                    {getApartmentStatus(value)}
                </Typography>
            );
        case 'contract':
            return (
                <Typography
                    color={getContractStatusTextColor(value)}
                    variant="body2"
                >
                    {getContractStatus(value)}
                </Typography>
            );
        case 'invoice':
            return (
                <Typography
                    color={getInvoiceStatusTextColor(value)}
                    variant="body2"
                >
                    {getInvoiceStatusText(value)}
                </Typography>
            );
        case 'customer':
            return (
                <Typography
                    color={getUserBlockStatusTextColor(value)}
                    variant="body2"
                >
                    {getUserBlockStatusText(value)}
                </Typography>
            );
        case 'employee':
            return (
                <Typography
                    color={getUserBlockStatusTextColor(value)}
                    variant="body2"
                >
                    {getUserBlockStatusText(value)}
                </Typography>
            );
        case 'request':
            return (
                <Typography
                    color={getRequestStatusTextColor(value)}
                    variant="body2"
                >
                    {getRequestStatusText(value)}
                </Typography>
            );
        case 'attendance':
            return (
                <Typography
                    color={Color.warning}
                    variant="body2"
                >
                    {getAttendanceResultStatusText(value)}
                </Typography>
            );
        default:
            return (
                <Typography variant="body2">
                    {value}
                </Typography>
            );
    }
}

export default StatusCell;