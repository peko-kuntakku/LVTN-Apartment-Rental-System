import { Typography, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import StickyHeadTable, { Column } from "../../common/Table/DataTable";
import { CustomButton } from "../../common/Inputs/CustomButton";
import SearchBar from "../../common/SearchBar";
import CustomTablePagination from "../../common/Table/CustomTablePagination";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import voucherApi from "../../api/voucherApi";
import { transformVoucherListData } from "../../utils/voucherUtils";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 80 },
    { id: 'name', label: 'Tên mã giảm giá', minWidth: 170 },
    {
        id: 'startAt',
        label: 'Có hiệu lực',
        minWidth: 200,
        align: 'center',
    },
    {
        id: 'expiredAt',
        label: 'Hết hiệu lực',
        minWidth: 200,
        align: 'center',
    },
    {
        id: 'amount',
        label: 'Số lượng (mã)',
        minWidth: 140,
        align: 'right',
    },
    {
        id: 'remained',
        label: 'Còn lại (mã)',
        minWidth: 120,
        align: 'right',
    },
    {
        id: 'detail',
        label: 'Chi tiết',
        minWidth: 150,
        align: 'right',
    },
    {
        id: 'actions',
        label: 'Hành động',
        minWidth: 150,
        align: 'right',
    },
];

export default function VoucherList() {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient()
    const navigate = useNavigate();
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
        isLoading: isDeleting,
        mutate: deleteVoucher
    } = useMutation(
            async () => {
                if (currentUser && selectedId) {
                    return await voucherApi.delete(currentUser.jwt, selectedId);
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
                    queryClient.invalidateQueries('vouchers')
                }
            }
        );

    const handleDelete = () => {
        if (selectedId) {
            deleteVoucher();
        }
    }

    const {
        isSuccess,
        isLoading,
        data
    } = useQuery(['vouchers', page, rowsPerPage, searchText], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await voucherApi.getAllVouchers(
                signal, 
                currentUser.jwt,
                page + 1,
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

    return (
        <Root>
            <Typography variant="h6" fontWeight="600">Mã giảm giá</Typography>
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
                    <CustomButton buttonName="Thêm mã giảm" sx={{ width: 200 }}
                        onClick={() => navigate('add-voucher')}
                    />
                </Stack>
                <StickyHeadTable
                    columns={columns}
                    data={isSuccess && transformVoucherListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="apartment"
                    onDeleteClick={(id: number) => setSelectedId(id)}
                    onEditClick={(id: number) => navigate(`edit-voucher/${id}`)}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
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