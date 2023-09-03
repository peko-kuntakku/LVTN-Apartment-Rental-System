import { useParams } from "react-router-dom";
import { Typography, Stack, Box } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Center from "../../common/StyledComponents/Center";
import { Color } from "../../styles/GlobalStyles";
import apartmentApi from "../../api/apartmentApi";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/features/authentication/authSlice";
import { getApartmentInitialValue } from "../../utils/apartmentUtils";
import BackButton from "../../common/StyledComponents/BackButton";
import ApartmentList from "../apartment/ApartmentList";

export default function ComplexApartmentDetail() {
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
                            <Typography color={Color.primary} fontWeight={600} variant="h6" mb={2}>{apartmentDetail?.apartmentName}</Typography>
                            <Box mt={5}>
                                <Typography fontWeight={600}>Mô tả</Typography>
                                <Typography variant="body2" color={Color.extraText}>{apartmentDetail?.description}</Typography>
                            </Box>
                        </Stack>
                    </Grid2>
                </Grid2>
            </ContainerRoot>

            <ApartmentList
                tableName="Các căn hộ thành phần"
                complexApartmentId={id ? parseInt(id) : undefined}
            />
        </Root>
    );
}