import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Divider, Chip, Stack } from "@mui/material";
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Center from "../../common/StyledComponents/Center";
import { Color } from "../../styles/GlobalStyles";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import BackButton from "../../common/StyledComponents/BackButton";
import BuildingDetailItem from "../building/Components/BuildingDetailItem"
import LoadingIndicator from "../../common/Indicators/LoadingIndicator";
import { CustomButton } from "../../common/Inputs/CustomButton";
import requestApi from "../../api/requestApi";
import { getRequestStatusText, getRequestStatusTextColor, getRequestTypeColor, getRequestTypeText, transformRequestDetailResponseData } from "../../utils/requestUtils";

export default function RequestDetail() {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();

    const { data: detail, isLoading, isError, isSuccess } = useQuery(['requestDetail', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await requestApi.getRequestDetail(currentUser.jwt, parseInt(id), signal);
        }
    }, {
        enabled: true,
        select: (res: any) => {
            return transformRequestDetailResponseData(res.data);
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
    });

    return (
        <Root style={{ width: '60%', minWidth: 800 }}>
            <BackButton />
            <Typography variant="h6" fontWeight="600">Chi tiết yêu cầu</Typography>
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
                            label={getRequestStatusText(detail.status)}
                            sx={{
                                backgroundColor: getRequestStatusTextColor(detail.status),
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
                                rightText={detail.apartmentName}
                                rightTextColor={Color.warning}
                            />
                        </Box>
                        <Divider sx={{ marginBottom: 5 }} />
                        <Typography fontWeight={600}>Chi tiết yêu cầu</Typography>
                        <Box mb={5} mt={2}>
                            <BuildingDetailItem
                                leftText='Loại yêu cầu'
                                rightText={getRequestTypeText(detail.type)}
                                rightTextColor={getRequestTypeColor(detail.type)}
                                left={5}
                                right={7}
                            />
                            <BuildingDetailItem
                                leftText='Ngày tạo'
                                rightText={`${detail.createdAtDay} thg ${detail.createdAtMonth}, ${detail.createdAtYear}`}
                                left={5}
                                right={7}
                            />
                            <BuildingDetailItem
                                leftText='Mô tả của khách hàng'
                                rightText={detail.description}
                                left={5}
                                right={7}
                            />
                        </Box>
                        <Divider sx={{ marginBottom: 5 }} />
                        {
                            detail.employee &&
                            <>
                                <Typography fontWeight={600}>Nhân viên xử lý</Typography>
                                <Box mb={5} mt={2}>
                                    <BuildingDetailItem
                                        leftText='Email'
                                        rightText={detail.employee.email}
                                        left={5}
                                        right={7}
                                    />
                                    <BuildingDetailItem
                                        leftText='Họ, tên'
                                        rightText={`${detail.employee.lastname} ${detail.employee.firstname}`}
                                        left={5}
                                        right={7}
                                    />
                                    <BuildingDetailItem
                                        leftText='Số điện thoại'
                                        rightText={detail.employee.phone}
                                        left={5}
                                        right={7}
                                    />

                                </Box>
                                <Divider sx={{ marginBottom: 5 }} />
                            </>
                        }
                        {
                            detail.employeeFeedback &&
                            <>
                                <Typography fontWeight={600}>Phản hồi từ nhân viên</Typography>
                                <Box mb={5} mt={2}>
                                    <Typography>{detail.employeeFeedback}</Typography>
                                </Box>
                                <Divider sx={{ marginBottom: 5 }} />
                            </>
                        }
                        {
                            detail.status === 4 &&
                            <Stack direction='row' spacing={5}>
                                <CustomButton fullWidth={false}
                                    buttonName='Thêm hóa đơn'
                                    variant='outlined'
                                    color='primary'
                                    onClick={() => {
                                        navigate('add-invoice', { state: { contractId: detail.contractId, requestId: detail.id } });
                                    }}
                                />
                            </Stack>
                        }
                    </Box>
                </ContainerRoot>
            }
        </Root>
    );
}