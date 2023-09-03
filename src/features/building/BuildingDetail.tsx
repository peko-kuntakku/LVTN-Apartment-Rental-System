import { useParams } from "react-router-dom";
import { Typography, Stack, Box } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';
import { ContainerRoot, Root } from "../../common/StyledComponents/ItemList";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import buildingApi from "../../api/buildingApi";
import { transformBuildingDetail } from "../../utils/buildingUtils";
import Center from "../../common/StyledComponents/Center";
import { Color } from "../../styles/GlobalStyles";
import BuildingDetailItem from "./Components/BuildingDetailItem";
import ApartmentList from "../apartment/ApartmentList";
import BackButton from "../../common/StyledComponents/BackButton";

export default function BuildingDetail() {
    const { id } = useParams();

    const { data: buildingDetail } = useQuery(['buildingDetail', id], async ({ signal }) => {
        if (id) {
            return await buildingApi.getBuildingDetail(parseInt(id));
        }
    }, {
        enabled: true,
        select: (res: any) => {
            return transformBuildingDetail(res.data);
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
            <Typography variant="h6" fontWeight="600">Chi tiết tòa nhà</Typography>
            <ContainerRoot mb={6}>
                <Grid2 container
                    sx={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5 }}
                    spacing={7}
                >
                    <Grid2 sm={12} md={6}>
                        <Center sx={{ width: '95%', height: 480, border: `1px solid ${Color.border}` }}>
                            {
                                buildingDetail?.imageUrl &&
                                <img
                                    src={buildingDetail?.imageUrl}
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
                            <Typography color={Color.primary} fontWeight={600} variant="h6" mb={2}>{buildingDetail?.name}</Typography>
                            <BuildingDetailItem
                                leftText='Số tầng'
                                rightText={buildingDetail?.numberOfFloors.toString()}
                            />
                            {
                                buildingDetail?.province &&
                                <BuildingDetailItem
                                    leftText='Địa chỉ'
                                    rightText={`${buildingDetail?.addressDetail}, ${buildingDetail?.ward}, ${buildingDetail?.district}, ${buildingDetail?.province}`}
                                />
                            }
                        </Stack>
                    </Grid2>
                </Grid2>
            </ContainerRoot>

            <ContainerRoot mb={5}>
                <Box m={5}>
                    <Typography fontWeight={600}>Mô tả</Typography>
                    <Typography variant="body2" color={Color.extraText}>{buildingDetail?.description}</Typography>
                </Box>
            </ContainerRoot>

            <ApartmentList
                tableName="Các căn hộ thuộc tòa nhà"
                buildingId={id ? parseInt(id) : undefined}
            />
        </Root>
    );
}