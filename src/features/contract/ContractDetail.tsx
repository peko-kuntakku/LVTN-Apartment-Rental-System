import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Divider, useTheme, useMediaQuery, Chip, Stack, TextField } from "@mui/material";
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
import contractApi from "../../api/contractApi";
import { getContractStatus, transformContractDetailResponseData, getContractStatusTextColor, getButtonActionName, compareDateWithMonent, getStatusFromAction } from "../../utils/contractUtils";
import LoadingIndicator from "../../common/Indicators/LoadingIndicator";
import { CustomButton } from "../../common/Inputs/CustomButton";
import ConfirmationDialogRaw from "../../common/Dialogs/ConfirmationDialog";

interface UpdateContract {
    status: number,
    declinedText: string,
}

export default function ContractDetail() {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const [action, setAction] = useState('');
    const [declinedText, setDeclinedText] = useState('');

    const handleClose = () => {
        setDeclinedText('');
        setOpenDialog(false);
    };

    const { data: contractDetail, isLoading, isError, isSuccess, refetch: refetchData } = useQuery(['contractDetail', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await contractApi.getContractDetail(currentUser.jwt, parseInt(id), signal);
        }
    }, {
        enabled: true,
        select: (res: any) => {
            return transformContractDetailResponseData(res.data);
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
            const status = getStatusFromAction(action);
            if (status) {
                mutate({ status, declinedText });
            }
        }
    }

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeclinedText(event.target.value);
    };

    const { isLoading: isMutating, mutate: mutate } = useMutation(
        async ({ status, declinedText }: UpdateContract) => {
            if (currentUser?.jwt && contractDetail?.contractId) {
                return await contractApi.updateContractStatus(
                    currentUser.jwt,
                    contractDetail.contractId,
                    status,
                    declinedText,
                    action,
                    contractDetail.apartmentId,
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
                queryClient.invalidateQueries('contracts')
            }
        }
    );

    return (
        <Root style={{ width: '60%', minWidth: 800 }}>
            <BackButton />
            <Typography variant="h6" fontWeight="600">Chi tiết hợp đồng</Typography>
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
                isSuccess && contractDetail &&
                <ContainerRoot mb={6}>
                    <Box sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}>
                        <Chip
                            label={getContractStatus(contractDetail.status)}
                            sx={{
                                backgroundColor: getContractStatusTextColor(contractDetail.status),
                                color: Color.secondary,
                                fontWeight: 600,
                                width: 'fit-content',
                                marginBottom: 2,
                            }}
                        />
                        <Box mb={5}>
                            <Typography fontWeight={600} >Thông tin căn hộ</Typography>
                            <BuildingDetailItem
                                leftText='Tên căn hộ'
                                rightText={contractDetail.apartmentName}
                                rightTextColor={Color.warning}
                            />
                            <BuildingDetailItem
                                leftText='Tiền thuê hàng tháng'
                                rightText={`${currencyFormatter.format(contractDetail.rentalFee)} đồng`}
                            />
                        </Box>
                        <Divider sx={{ marginBottom: 5 }} />
                        <Grid2 container columns={13}>
                            <Grid2 xs={13} sm={6}>
                                <Box mb={5} id='renter-info'>
                                    <Typography fontWeight={600} >Thông tin người thuê</Typography>
                                    <BuildingDetailItem
                                        leftText='Họ tên'
                                        rightText={`${contractDetail.customer.lastname} ${contractDetail.customer.firstname}`}
                                    />
                                    <BuildingDetailItem
                                        leftText='Email'
                                        rightText={contractDetail.customer.email}
                                    />
                                    <BuildingDetailItem
                                        leftText='Điện thoại'
                                        rightText={contractDetail.customer.phone}
                                    />
                                    <BuildingDetailItem
                                        leftText='Ngày sinh'
                                        rightText={contractDetail.customer.birthday}
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
                                <Box mb={5} id='tenant-info'>
                                    <Typography fontWeight={600} >Thông tin người cho thuê</Typography>
                                    <BuildingDetailItem
                                        leftText='Họ tên'
                                        rightText={`Huỳnh Quang Thái Huy`}
                                    />
                                    <BuildingDetailItem
                                        leftText='Email'
                                        rightText={`huy.huynh.hqth2903@hcmut.edu.vn`}
                                    />
                                    <BuildingDetailItem
                                        leftText='Điện thoại'
                                        rightText={`0936888172`}
                                    />
                                </Box>
                            </Grid2>
                        </Grid2>
                        <Divider sx={{ marginBottom: 5 }} />
                        <Typography fontWeight={600}>Chi tiết hợp đồng</Typography>
                        <Grid2 container columns={13}>
                            <Grid2 xs={13} sm={6}>
                                <Box mb={5}>
                                    <BuildingDetailItem
                                        leftText='Hiệu lực'
                                        rightText={`${new Date(contractDetail.startDate).toLocaleDateString('vi-VN')} đến ${new Date(contractDetail.expiredDate).toLocaleDateString('vi-VN')}`}
                                    />
                                    <BuildingDetailItem
                                        leftText='Tiền thuê hàng tháng'
                                        rightText={`${currencyFormatter.format(contractDetail.rentalFee)} đồng`}
                                        rightTextColor={Color.warning}
                                    />
                                    {
                                        contractDetail.voucher &&
                                        <>
                                            <Typography mt={2}>Mã giảm giá đã sử dụng</Typography>
                                            <BuildingDetailItem
                                                leftText='Tên mã'
                                                rightText={contractDetail.voucher.name}
                                                rightTextColor={Color.warning}
                                            />
                                            {
                                                contractDetail.voucher.percentage ?
                                                    <>
                                                        <BuildingDetailItem
                                                            leftText='Giảm'
                                                            rightText={`${contractDetail.voucher.percentage}%`}
                                                        />
                                                        <BuildingDetailItem
                                                            leftText='Tối đa'
                                                            rightText={`${currencyFormatter.format(contractDetail.voucher.maxDiscount)}đ`}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <BuildingDetailItem
                                                            leftText='Giảm'
                                                            rightText={`${currencyFormatter.format(contractDetail.voucher.maxDiscount)}đ`}
                                                        />
                                                    </>
                                            }
                                        </>
                                    }
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
                                        leftText='Tiền thuê tháng đầu'
                                        rightText={`${currencyFormatter.format(contractDetail.rentalFee)} đồng`}
                                        left={6} right={6}
                                    />
                                    {
                                        contractDetail.voucher ?
                                            <BuildingDetailItem
                                                leftText='Tiền thuê tháng đầu (sau khi áp mã)'
                                                rightText={contractDetail.firstMonthFee ? `${currencyFormatter.format(contractDetail.firstMonthFee)} đồng` : ''}
                                                left={6} right={6}
                                            /> :
                                            <BuildingDetailItem
                                                leftText='Tiền thuê tháng đầu (sau khi áp mã)'
                                                rightText={`${currencyFormatter.format(contractDetail.rentalFee)} đồng`}
                                                left={6} right={6}
                                            />
                                    }
                                    <Typography color={Color.extraText}>Tiền cọc (20% tiền thuê sau áp mả)</Typography>
                                </Box>
                            </Grid2>
                        </Grid2>
                        <Divider sx={{ marginBottom: 5 }} />
                        <Stack direction='row' spacing={5}>
                            {
                                compareDateWithMonent(contractDetail.startDate) ?
                                    <>
                                        {
                                            contractDetail.status === 0 &&
                                            <CustomButton fullWidth={false}
                                                buttonName={getButtonActionName(contractDetail.status)}
                                                onClick={() => {
                                                    setAction('xác nhận');
                                                    setOpenDialog(true);
                                                }}
                                            />
                                        }
                                        {
                                            contractDetail.status === 0 &&
                                            <CustomButton fullWidth={false}
                                                buttonName="Từ chối hợp đồng"
                                                variant='outlined'
                                                color='error'
                                                onClick={() => {
                                                    setAction('từ chối');
                                                    setOpenDialog(true);
                                                }}
                                            />
                                        }
                                        {
                                            contractDetail.status === 5 &&
                                            <CustomButton fullWidth={false}
                                                buttonName="Kích hoạt hợp đồng"
                                                onClick={() => {
                                                    setAction('kích hoạt');
                                                    setOpenDialog(true);
                                                }}
                                            />
                                        }
                                    </>
                                    :
                                    <>
                                        {(contractDetail.status !== 1 && contractDetail.status !== 4) &&
                                            <CustomButton fullWidth={false}
                                                buttonName="Hủy hợp đồng"
                                                variant='outlined'
                                                color='error'
                                                onClick={() => {
                                                    setAction('hủy');
                                                    setOpenDialog(true);
                                                }}
                                            />
                                        }
                                    </>
                            }
                        </Stack>
                        {
                            contractDetail.status === 1 &&
                            <CustomButton fullWidth={false}
                                buttonName="Thêm hóa đơn"
                                variant='outlined'
                                color='primary'
                                style={{ marginTop: 50 }}
                                onClick={() => {
                                    navigate('add-invoice', { state: { contractId: contractDetail.contractId } });
                                }}
                            />
                        }
                    </Box>
                </ContainerRoot>
            }
            <ConfirmationDialogRaw
                id="contract-action-dialog"
                keepMounted
                open={openDialog}
                dialogTitle={'Thông báo'}
                dialogMessage={`Bạn có chắc muốn ${action} hợp đồng?`}
                onClose={handleClose}
                isLoading={isMutating}
                onExecute={handleExecute}
            >
                {
                    action === 'từ chối' ?
                        <TextField
                            label="Lý do từ chối"
                            placeholder="Lý do từ chối"
                            multiline
                            rows={5}
                            sx={{ marginBottom: 5, marginTop: 3 }}
                            fullWidth
                            onChange={handleChangeText}
                        /> :
                        <></>
                }
            </ConfirmationDialogRaw>
        </Root>
    );
}