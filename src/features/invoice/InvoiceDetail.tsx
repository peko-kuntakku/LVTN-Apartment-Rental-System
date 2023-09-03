import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Divider, useTheme, useMediaQuery, Chip, Stack } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Center from "../../common/StyledComponents/Center";
import { Color } from "../../styles/GlobalStyles";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import BackButton from "../../common/StyledComponents/BackButton";
import BuildingDetailItem from "../building/Components/BuildingDetailItem"
import { currencyFormatter } from "../../utils/utils";
import LoadingIndicator from "../../common/Indicators/LoadingIndicator";
import { CustomButton } from "../../common/Inputs/CustomButton";
import ConfirmationDialogRaw from "../../common/Dialogs/ConfirmationDialog";
import invoiceApi from "../../api/invoiceApi";
import { getInvoiceGroup, getInvoiceStatusText, getInvoiceStatusTextColor, getInvoiceType, transformInvoiceDetailResponseData } from "../../utils/invoiceUtils";

interface UpdateInvoice {
    status: number,
}

export default function InvoiceDetail() {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const [action, setAction] = useState('');
    const [declinedText, setDeclinedText] = useState('');

    const handleClose = () => {
        setDeclinedText('');
        setOpenDialog(false);
    };

    const { data: detail, isLoading, isError, isSuccess, refetch: refetchData } = useQuery(['invoiceDetail', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await invoiceApi.getInvoiceDetail(currentUser.jwt, parseInt(id), signal);
        }
    }, {
        enabled: true,
        select: (res: any) => {
            return transformInvoiceDetailResponseData(res.data);
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
    });

    const handleExecute = () => {
        if (action) {
            const status = action === 'confirm' ? 2 : (action === 'delete' ? 3 : undefined);
            if (status) {
                mutate({ status });
            }
        }
    }

    const { isLoading: isMutating, mutate: mutate } = useMutation(
        async ({ status }: UpdateInvoice) => {
            if (currentUser?.jwt && detail?.id) {
                return await invoiceApi.updateInvoiceStatus(
                    currentUser.jwt,
                    detail.id,
                    status
                );
            }
        },
        {
            onSuccess: (res) => {
                setAction('');
                setDeclinedText('');
                handleClose();
                refetchData();
            },
            onError: (err: any) => {
                setAction('');
                setDeclinedText('');
                handleClose();
                toast.error(err.response.data.error.message);
                console.log(err);
            },
            onSettled: () => {
                queryClient.invalidateQueries('invoices')
            }
        }
    );

    return (
        <Root style={{ width: '60%', minWidth: 800 }}>
            <BackButton />
            <Typography variant="h6" fontWeight="600">Chi tiết hóa đơn</Typography>
            {
                isError &&
                <Center mt={3}>
                    <Typography color={Color.extraText}>Lấy dữ liệu thất bại</Typography>
                </Center>
            }
            {
                isLoading &&
                <LoadingIndicator />
            }
            {
                isSuccess && detail &&
                <ContainerRoot mb={6}>
                    <Box sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}>
                        <Chip
                            label={getInvoiceStatusText(detail.status)}
                            sx={{
                                backgroundColor: getInvoiceStatusTextColor(detail.status),
                                color: Color.secondary,
                                fontWeight: 600,
                                width: 'fit-content',
                                marginBottom: 2,
                            }}
                        />
                        {
                            detail.apartmentId &&
                            <Box mb={5}>
                                <Typography fontWeight={600} >Thông tin căn hộ</Typography>
                                <BuildingDetailItem
                                    leftText='Tên căn hộ'
                                    rightText={detail.apartmentName}
                                    rightTextColor={Color.warning}
                                />
                            </Box>
                        }
                        <Divider sx={{ marginBottom: 5 }} />
                        <Typography fontWeight={600}>Chi tiết hóa đơn</Typography>
                        <Grid2 container columns={13}>
                            <Grid2 xs={13} sm={6}>
                                <Box mb={5}>
                                    <BuildingDetailItem
                                        leftText='Loại hóa đơn'
                                        rightText={getInvoiceType(detail.billType)}
                                        rightTextColor={Color.warning}
                                        left={5}
                                        right={7}
                                    />
                                    <BuildingDetailItem
                                        leftText='Nhóm'
                                        rightText={getInvoiceGroup(detail.type)}
                                        left={5}
                                        right={7}
                                    />
                                    <BuildingDetailItem
                                        leftText='Tổng thu'
                                        rightText={`${currencyFormatter.format(detail.total)} đồng`}
                                        left={5}
                                        right={7}
                                    />

                                </Box>
                            </Grid2>
                            <Grid2 xs={13} sm={1} display='flex' justifyContent='center' alignItems='center'>
                                <Divider sx={{ marginBottom: 5 }}
                                    orientation={matches ? "horizontal" : "vertical"}
                                    flexItem={true}
                                />
                            </Grid2>
                            <Grid2 xs={13} sm={6}>
                                <Box mb={5}>
                                    <BuildingDetailItem
                                        leftText='Ngày bắt đầu nhận thanh toán'
                                        rightText={detail.startDate}
                                        left={8}
                                        right={4}
                                    />
                                    <BuildingDetailItem
                                        leftText='Ngày kết thúc nhận thanh toán'
                                        rightText={detail.dueDate}
                                        left={8}
                                        right={4}
                                    />
                                </Box>
                            </Grid2>
                        </Grid2>
                        <Divider sx={{ marginBottom: 5 }} />
                        <Stack direction='row' spacing={5}>
                            {
                                detail.status === 1 &&
                                <CustomButton fullWidth={false}
                                    buttonName='Xác nhận'
                                    onClick={() => {
                                        setAction('confirm');
                                        setOpenDialog(true);
                                    }}
                                />
                            }
                            {
                                detail.status !== 3 &&
                                <CustomButton fullWidth={false}
                                    buttonName='Hủy hóa đơn'
                                    variant='outlined'
                                    color='error'
                                    onClick={() => {
                                        setAction('delete');
                                        setOpenDialog(true);
                                    }}
                                />
                            }
                        </Stack>
                    </Box>
                </ContainerRoot>
            }
            <ConfirmationDialogRaw
                id="contract-action-dialog"
                keepMounted
                open={openDialog}
                dialogTitle={'Thông báo'}
                dialogMessage={`Bạn có chắc muốn ${action === 'confirm' ? 'xác nhận đã thu tiền' : 'hủy'
                    } hợp đồng?`}
                onClose={handleClose}
                isLoading={isMutating}
                onExecute={handleExecute}
            />
        </Root>
    );
}