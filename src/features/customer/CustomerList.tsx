import { Typography, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import StickyHeadTable, { Column } from "../../common/Table/DataTable";
import SearchBar from "../../common/SearchBar";
import CustomTablePagination from "../../common/Table/CustomTablePagination";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import customerApi from "../../api/customerApi";
import { transformCustomerListData } from "../../utils/customerUtils";
import authApi from "../../api/authApi";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 120 },
    { id: 'name', label: 'Họ, tên', minWidth: 170 },
    {
        id: 'email',
        label: 'Email',
        minWidth: 200,
    },
    {
        id: 'username',
        label: 'Tên tài khoản',
        minWidth: 150,
    },
    {
        id: 'status',
        label: 'Trạng thái tài khoản',
        minWidth: 150,
    },
    {
        id: 'detail',
        label: 'Chi tiết',
        minWidth: 120,
        align: 'right',
    },
    {
        id: 'actions',
        label: 'Hành động',
        minWidth: 120,
        align: 'right',
    },
];

export default function CustomerList() {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [selectedId, setSelectedId] = useState<number>();

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
    } = useQuery(['customers', page, rowsPerPage, searchText], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            // Use offset so page start at 0
            return await customerApi.getAllCustomers(
                signal,
                currentUser.jwt,
                page,
                rowsPerPage,
                searchText
            );
        }
    }, {
        enabled: true,
        keepPreviousData: true,
        select: (res: any) => { 
            return res;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const {
        isLoading: isChangingBlockStatus,
        mutate: changeBlockStatus
    } = useMutation(
        async () => {
            if (currentUser && selectedId) {
                const blockStatus = data.data.filter((ele: any) => ele.id === selectedId).map((ele: any) => ele.blocked);
                return await authApi.updateUserBlockStatus(currentUser.jwt, selectedId, blockStatus[0]);
            }
        },
        {
            onSuccess: (res) => {
                setSelectedId(undefined);
                toast.success('Thao tác thành công');
            },
            onError: (err: any) => {
                console.log(err);
                toast.error('Lỗi');
            },
            onSettled: () => {
                queryClient.invalidateQueries('customers')
            }
        }
    );

    const handleChangeStatus = () => {
        if (selectedId) {
            changeBlockStatus();
        }
    }

    return (
        <Root>
            <Typography variant="h6" fontWeight="600">Khách hàng</Typography>
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
                    data={isSuccess && transformCustomerListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="customer"
                    action="block"
                    onDeleteClick={(id: number) => setSelectedId(id)}
                    isDeleting={isChangingBlockStatus}
                    handleDelete={handleChangeStatus}
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