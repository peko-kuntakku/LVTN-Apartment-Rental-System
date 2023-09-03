import { Typography, Stack } from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import buildingApi from "../../api/buildingApi";
import StickyHeadTable, { Column } from "../../common/Table/DataTable";
import { CustomButton } from "../../common/Inputs/CustomButton";
import SearchBar from "../../common/SearchBar";
import CustomTablePagination from "../../common/Table/CustomTablePagination";
import { transformBuidlingListData } from "../../utils/buildingUtils";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 100 },
    { id: 'name', label: 'Tên tòa nhà', minWidth: 120 },
    {
        id: 'numOfFloors',
        label: 'Số tầng',
        minWidth: 80,
        align: 'right',
    },
    {
        id: 'province',
        label: 'Địa chỉ',
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

export default function BuildingList() {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [selectedId, setSelectedId] = useState<number>();
    // const [page1, setPage1] = useState(0);
    // const [rowsPerPage1, setRowsPerPage1] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const handleChangePage1 = useCallback((event: unknown, newPage: number) => {
    //     setPage1(newPage);
    // }, [page1, rowsPerPage1]);

    // const handleChangeRowsPerPage1 = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRowsPerPage1(+event.target.value);
    //     setPage1(0);
    // }, [page1, rowsPerPage1]);

    const handleChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const {
        isSuccess,
        isLoading,
        data
    } = useQuery(['buildings', page, rowsPerPage, searchText], async ({ signal }) => {
        return await buildingApi.getAll(signal, page + 1, rowsPerPage, searchText);
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
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const {
        isLoading: isDeleting,
        mutate: deleteBuilding
    } = useMutation(
        async () => {
            if (currentUser && selectedId) {
                return await buildingApi.delete(currentUser.jwt, selectedId);
            }
        },
        {
            onSuccess: (res) => {
                setSelectedId(undefined);
                toast.success('Thao tác thành công');
            },
            onError: (err: any) => {
                console.log(err);
                if (err.response.data.error.message === "Contains apartments") {
                    toast.error('Thao tác thất bại. Tòa nhà đã chọn có chứa căn hộ.');
                }
                else {
                    toast.error('Lỗi');
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries('buildings')
           }
        }
    );

    const handleDelete = () => {
        if (selectedId) {
            deleteBuilding();
        }
    }

    return (
        <Root>
            <Typography variant="h6" fontWeight="600">Toà nhà</Typography>
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
                    <CustomButton buttonName="Thêm tòa nhà" sx={{ width: 200 }} 
                        onClick={() => navigate('add-building')}
                    />
                </Stack>
                <StickyHeadTable
                    columns={columns}
                    data={isSuccess && transformBuidlingListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="building"
                    onDeleteClick={(id: number) => setSelectedId(id)}
                    onEditClick={(id: number) => navigate(`edit-building/${id}`)}
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