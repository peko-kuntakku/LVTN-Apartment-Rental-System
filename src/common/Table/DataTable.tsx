import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Color } from '../../styles/GlobalStyles';
import { CustomButton } from '../Inputs/CustomButton';
import { Edit, Delete, HorizontalRule, LockPerson } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import ConfirmationDialogRaw from "../../common/Dialogs/ConfirmationDialog";
import NoDataIndicator from '../Indicators/NoDataIndicator';
import LoadingIndicator from '../Indicators/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import StatusCell from './StatusCell';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
  format?: (value: number) => string;
}

interface DataTableProps {
  columns: readonly Column[],
  isSuccess: boolean,
  data: any,
  isLoading: boolean,
  children?: React.ReactNode,
  tableKey?: string,
  onDetailClick?: string, // use when navigate to nested
  onDeleteClick?: (id: number) => void,
  onEditClick?: (id: number) => void,
  isDeleting?: boolean,
  handleDelete?: () => void,
  action?: string,
}

export default function StickyHeadTable({
  columns,
  isSuccess,
  data,
  isLoading,
  children,
  tableKey,
  onDeleteClick,
  onDetailClick,
  onEditClick,
  isDeleting,
  handleDelete,
  action
}: DataTableProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleClickItem = (id: number) => {
    if (onDeleteClick) {
      setOpenDialog(true);
      onDeleteClick(id);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleExecute = () => {
    handleDelete && handleDelete();
    /*
      mutation change status to success or error
    */
    if (!isDeleting) {
      setOpenDialog(false);
    }
  }

  return (
    <Paper sx={{
      boxShadow: 'none',
      marginTop: 5,
      marginLeft: 3, marginRight: 3,
      // overflowX: 'auto',
      // width: '100%',
      // overflow: 'hidden',
      maxWidth: '100%',
    }}>
      <TableContainer sx={{ maxHeight: 462 }}>
        <Table stickyHeader aria-label="sticky table"
          // sx={{ tableLayout: 'fixed' }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: Color.bgColor,
                    fontWeight: 600,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {
            (isSuccess && data.length > 0) &&
            <TableBody>
              {data
                .map((row: any) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[`${column.id}`];
                        return (value !== undefined &&
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'status'
                              ?
                              <StatusCell tableKey={tableKey} value={value} />
                              : value
                            }
                          </TableCell>
                        );
                      })}
                      <TableCell align='right'>
                        <CustomButton
                          buttonName="Xem chi tiết"
                          variant='text'
                          fullWidth={false}
                          onClick={() => {
                            if (onDetailClick) {
                              navigate(`/${onDetailClick}/${row.id}`, { replace: true });
                            } else {
                              navigate(`${row.id}`);
                            }
                          }}
                        />
                      </TableCell>
                      {
                        ((onEditClick || onDeleteClick) && !onDetailClick) &&
                        <TableCell align='right'>
                          {
                            onEditClick &&
                            <IconButton
                              size="large"
                              aria-label="edit icon button"
                              sx={{ color: Color.warning }}
                              onClick={() => onEditClick(row.id)}
                            >
                              <Edit />
                            </IconButton>
                          }
                          {
                            onDeleteClick &&
                            <IconButton
                              size="large"
                              aria-label="delete icon button"
                              sx={{ color: Color.error }}
                              onClick={() => handleClickItem(row.id)}
                            >
                              {
                                (action === 'block')
                                  ? <LockPerson />
                                  : <Delete />
                              }
                            </IconButton>
                          }
                        </TableCell>
                      }
                      {
                        onDetailClick &&
                        <TableCell align='right'>
                          <Tooltip title="Không có hành động">
                            <IconButton
                              size="large"
                              aria-label="no action icon button"
                            >
                              <HorizontalRule />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      }
                    </TableRow>
                  );
                })}
            </TableBody>
          }
        </Table>
      </TableContainer>
      {
        data.length === 0 &&
        <NoDataIndicator />
      }
      {
        isLoading &&
        <LoadingIndicator />
      }
      <ConfirmationDialogRaw
        id="delete-building-confirmation"
        keepMounted
        open={openDialog}
        dialogTitle={action === 'block' ? 'Tài khoản' : 'Xóa'}
        dialogMessage={
          action === 'block'
            ? `Bạn có chắc muốn thay đổi trạng thái tài khoản?`
            : `Bạn có chắc muốn xóa dữ liệu đã chọn? Dữ liệu sẽ không thể khôi phục.`
        }
        onClose={handleClose}
        isLoading={isDeleting}
        onExecute={handleExecute}
      />
      {children}
    </Paper >
  );
}