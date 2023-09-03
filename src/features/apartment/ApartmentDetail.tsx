import { useParams } from "react-router-dom";
import { Typography, Stack, Box, Divider } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Center from "../../common/StyledComponents/Center";
import { Color } from "../../styles/GlobalStyles";
import apartmentApi from "../../api/apartmentApi";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { getApartmentInitialValue, getApartmentStatus, getStatusTextColor } from "../../utils/apartmentUtils";
import BackButton from "../../common/StyledComponents/BackButton";
import BuildingDetailItem from "../building/Components/BuildingDetailItem"
import { currencyFormatter } from "../../utils/utils";

export default function ApartmentDetail() {
    const { id } = useParams();
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: apartmentDetail } = useQuery(['apartmentDetail', id], async ({ signal }) => {
        if (id && currentUser?.jwt) {
            return await apartmentApi.getApartmentDetail(currentUser.jwt, parseInt(id));
        }
    }, {
        enabled: true,
        select: (res: any) => {
            return getApartmentInitialValue(res.data);
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
            <BackButton />
            <Typography variant="h6" fontWeight="600">Chi tiết căn hộ</Typography>
            <ContainerRoot mb={6}>
                <Grid2 container
                    sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}
                    spacing={7}
                >
                    <Grid2 sm={12} md={6}>
                        <Center sx={{ width: '95%', height: 480, border: `1px solid ${Color.border}` }}>
                            {
                                apartmentDetail?.imageUrl &&
                                <img
                                    src={apartmentDetail?.imageUrl}
                                    loading="lazy"
                                    style={{
                                        objectFit: 'contain', width: '100%', height: '100%',
                                        maxWidth: 700
                                    }}
                                />
                            }
                        </Center>
                    </Grid2>
                    <Grid2 sm={12} md={6}>
                        <Stack direction="column">
                            <Typography color={Color.primary} fontWeight={600} variant="h6" mb={2}>Căn hộ {apartmentDetail?.apartmentName}</Typography>
                            <BuildingDetailItem
                                leftText='Sức chứa'
                                rightText={`${apartmentDetail?.capacity ? apartmentDetail.capacity : ''} người`}
                            />
                            <BuildingDetailItem
                                leftText='Diện tích'
                                rightText={`${apartmentDetail?.size ? apartmentDetail.size : ''} m\u00b2`}
                            />
                            <Grid2 container pl={0}>
                                <Grid2 xs={3}>
                                    <Typography color={Color.extraText}>Phòng</Typography>
                                </Grid2>
                                <Grid2 xs={4}>
                                    <Typography mb={2}>{apartmentDetail?.livingroom} phòng khách</Typography>
                                    <Typography>{apartmentDetail?.bedroom} phòng ngủ</Typography>
                                </Grid2>
                                <Grid2 xs={4}>
                                    <Typography mb={2}>{apartmentDetail?.restroom} nhà vệ sinh</Typography>
                                    <Typography>{apartmentDetail?.kitchen} nhà bếp</Typography>
                                </Grid2>
                            </Grid2>
                            <Divider sx={{ marginTop: 10 }} />
                            <Grid2 container pl={0} alignItems='center'>
                                <Grid2 xs={7}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography color={Color.primary} variant="h6" fontWeight={600}>
                                            {apartmentDetail && currencyFormatter.format(parseInt(apartmentDetail.rentalFee))}
                                        </Typography>
                                        <Typography color={Color.extraText} ml={1}>đồng/tháng</Typography>
                                    </Stack>
                                </Grid2>
                                <Grid2 xs={5}>
                                    <Typography
                                        color={getStatusTextColor(apartmentDetail?.status)}
                                        variant="subtitle1"
                                    >
                                        {getApartmentStatus(apartmentDetail?.status)}
                                    </Typography>
                                </Grid2>
                            </Grid2>
                        </Stack>
                    </Grid2>
                </Grid2>
            </ContainerRoot>

            <ContainerRoot mb={5}>
                <Box m={5}>
                    <Typography fontWeight={600}>Mô tả</Typography>
                    <Typography variant="body2" color={Color.extraText}>{apartmentDetail?.description}</Typography>
                </Box>
            </ContainerRoot>
        </Root>
    );
}