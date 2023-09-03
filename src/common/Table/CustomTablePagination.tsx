import { TablePagination } from "@mui/material";
import { transformMetaData } from "../../utils/utils";

interface Props {
    isSuccess: boolean,
    meta: any,
    rowsPerPage: number,
    page: number,
    onPageChange: (event: unknown, newPage: number) => void,
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function CustomTablePagination({ 
    isSuccess, 
    meta, 
    rowsPerPage, 
    page, 
    onPageChange, 
    onRowsPerPageChange 
}: Props) {
    return (
        <TablePagination
            rowsPerPageOptions={[1, 5, 10, 25, 100]}
            component="div"
            count={isSuccess ? transformMetaData(meta) : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Hiển thị:"
        />
    );
}