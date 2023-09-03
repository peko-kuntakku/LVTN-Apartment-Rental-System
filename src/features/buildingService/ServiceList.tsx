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
import serviceApi from "../../api/serviceApi";
import { transformServiceListData } from "../../utils/serviceUtils";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 100 },
    { id: 'name', label: 'Tên dịch vụ', minWidth: 170 },
    {
        id: 'buildingName',
        label: 'Tòa nhà',
        minWidth: 150,
    },
    {
        id: 'isCharged',
        label: 'Tính phí',
        minWidth: 120,
        align: 'right',
    },
    {
        id: 'type',
        label: 'Loại dịch vụ',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'detail',
        label: 'Chi tiết',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'actions',
        label: 'Hành động',
        minWidth: 170,
        align: 'right',
    },
];

export default function ServiceList() {
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
        mutate: deleteService
    } = useMutation(
            async () => {
                if (currentUser && selectedId) {
                    return await serviceApi.delete(currentUser.jwt, selectedId);
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
                    queryClient.invalidateQueries('services')
                }
            }
        );

    const handleDelete = () => {
        if (selectedId) {
            deleteService();
        }
    }

    const {
        isSuccess,
        isLoading,
        data
    } = useQuery(['services', page, rowsPerPage, searchText], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await serviceApi.getAllServices(
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
            <Typography variant="h6" fontWeight="600">Dịch vụ</Typography>
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
                    <CustomButton buttonName="Thêm dịch vụ" sx={{ width: 200 }}
                        onClick={() => navigate('add-service')}
                    />
                </Stack>
                <StickyHeadTable
                    columns={columns}
                    data={isSuccess && transformServiceListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="apartment"
                    onDeleteClick={(id: number) => setSelectedId(id)}
                    onEditClick={(id: number) => navigate(`edit-service/${id}`)}
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