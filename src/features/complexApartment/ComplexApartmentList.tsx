import { Typography, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import StickyHeadTable, { Column } from "../../common/Table/DataTable";
import { CustomButton } from "../../common/Inputs/CustomButton";
import SearchBar from "../../common/SearchBar";
import CustomTablePagination from "../../common/Table/CustomTablePagination";
import apartmentApi from "../../api/apartmentApi";
import { transformComplexApartmentListData } from "../../utils/apartmentUtils";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";

const columns: readonly Column[] = [
    { id: 'index', label: 'Stt', minWidth: 100 },
    { id: 'name', label: 'Tên căn hộ', minWidth: 120 },
    {
        id: 'totalSingleApartments',
        label: 'Số căn hộ đơn',
        minWidth: 120,
        align: 'right',
    },
    {
        id: 'status',
        label: 'Trạng thái',
        minWidth: 150,
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

interface ListProps {
    buildingId?: number | undefined,
    isApartmentList?: boolean,
    tableName?: string,
}

export default function ComplexApartmentList({
    buildingId,
    isApartmentList,
    tableName,
}: ListProps) {
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isApartmentList ? 10 : 5);
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
        mutate: deleteApartment
    } = useMutation(
        async () => {
            if (currentUser && selectedId) {
                return await apartmentApi.delete(currentUser.jwt, selectedId);
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
                queryClient.invalidateQueries('complex-apartments')
            }
        }
    );

    const handleDelete = () => {
        if (selectedId) {
            deleteApartment();
        }
    }

    const {
        isSuccess,
        isLoading,
        data
    } = useQuery(['complex-apartments', page, rowsPerPage, searchText, buildingId], async ({ signal }) => {
        return await apartmentApi.getAllApartmentByType(
            signal,
            false,
            page + 1,
            rowsPerPage,
            searchText,
            buildingId,
        );
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
    });

    return (
        <Root>
            {isApartmentList && <Typography variant="h6" fontWeight="600">Căn hộ phức hợp</Typography>}
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
                    {!isApartmentList && <Typography variant="h6" fontWeight="600">{tableName}</Typography>}
                    <SearchBar
                        onChange={handleChangeSearchText}
                    />
                    {isApartmentList &&
                        <CustomButton buttonName="Thêm căn hộ" sx={{ width: 200 }}
                            onClick={() => navigate('add-apartment')}
                        />}
                </Stack>
                <StickyHeadTable
                    columns={columns}
                    data={isSuccess && transformComplexApartmentListData(data.data)}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    tableKey="apartment"
                    onDeleteClick={(id: number) => setSelectedId(id)}
                    onEditClick={(id: number) => navigate(`edit-apartment/${id}`)}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                    onDetailClick={!isApartmentList ? 'apartments' : undefined}
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