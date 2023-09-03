import { Typography, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import StickyHeadTable, { Column } from "../../common/Table/DataTable";
import SearchBar from "../../common/SearchBar";
import CustomTablePagination from "../../common/Table/CustomTablePagination";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import attendanceApi from "../../api/attendanceApi";
import { transformAttendanceListData } from "../../utils/attendanceUtils";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 100 },
    { id: 'day', label: 'Ngày điểm danh', minWidth: 100 },
    {      
        id: 'name',
        label: 'Họ, tên',
        minWidth: 120,
    },
    {
        id: 'status',
        label: 'Kết quả điểm danh',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'detail',
        label: 'Chi tiết',
        minWidth: 170,
        align: 'right',
    },
];

export default function AttendanceList() {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    // const [selectedId, setSelectedId] = useState<number>();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // useCallback ????
    const handleChangeSearchText = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }, [searchText]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const {
        isSuccess,
        isLoading,
        data
    } = useQuery(['attendances', page, rowsPerPage, searchText], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await attendanceApi.getAll(signal, currentUser.jwt, page + 1, rowsPerPage);
        }
    }, {
        enabled: true,
        keepPreviousData: true,
        select: (res: any) => {
            console.log(res.data);
            return res;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
    });

    return (
        <Root>
            <Typography variant="h6" fontWeight="600">Kết quả điểm danh</Typography>
            <ContainerRoot>
                <Stack
                    direction='row'
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        marginTop: 3,
                        marginLeft: 3, marginRight: 3,
                    }}
                >
                    <SearchBar
                        onChange={handleChangeSearchText}
                    />
                </Stack>
                <StickyHeadTable
                    columns={columns}
                    data={isSuccess && transformAttendanceListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="attendance"
                >
                    <CustomTablePagination
                        isSuccess={isSuccess}
                        meta={isSuccess && data.meta}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </StickyHeadTable>
            </ContainerRoot>
        </Root>
    );
}