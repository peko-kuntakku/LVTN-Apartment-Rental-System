import Grid2 from '@mui/material/Unstable_Grid2';
import { Typography } from "@mui/material";
import { Apartment, AttachMoney, Groups, NightShelter } from "@mui/icons-material";
import StatisticCardVer1 from '../Components/StatisticCardVer1';
import { Color } from '../../../styles/GlobalStyles';
import ChartWidget from '../Components/ChartWidget';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../app/features/authentication/authSlice';
import { useQuery } from 'react-query';
import dashboardApi from '../../../api/dashboardApi';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import Center from '../../../common/StyledComponents/Center';
import LoadingIndicator from '../../../common/Indicators/LoadingIndicator';
import { backgroundColor, borderColor, doughnutOptions, pieOptions } from '../Charts/options';
import { DashboardApartmentModel, DashboardBuildingModel, DashboardCustomerModel } from '../../../model/Dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardGroupOne() {
    const currentUser = useAppSelector(selectCurrentUser);

    const buildingData = useQuery(['dashboard-building'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.countRentedApartmentsByLocation(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            let data: DashboardBuildingModel = res.data;
            return data;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
        // refetchOnWindowFocus: true,
    });

    const apartmentData = useQuery(['dashboard-apartment'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.countApartmentsByStatus(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            let data: DashboardApartmentModel = res.data;
            return data;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
    });

    const customerData = useQuery(['dashboard-customer'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.countCustomersByContract(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            let data: DashboardCustomerModel = res.data;
            return data;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
            toast.error('Lỗi');
        },
        refetchOnMount: true,
    });

    return (
        <>
            <Typography variant="h6" fontWeight="600" mb={1}>Tổng quan</Typography>
            <Grid2 container spacing={3} mb={2}>
                <Grid2 md={3} xs={12}>
                    <StatisticCardVer1 title="Tổng doanh thu">
                        <AttachMoney sx={{ color: Color.extraText }} fontSize="small" />
                    </StatisticCardVer1>
                </Grid2>
                <Grid2 md={3} xs={12}>
                    <StatisticCardVer1
                        title="Tổng tòa nhà" iconBgColor={Color.extraText}
                        isLoading={buildingData.isLoading}
                        value={buildingData.data && buildingData.data.allBuildings.toString()}
                    >
                        <Apartment sx={{ color: Color.secondary }} fontSize="small" />
                    </StatisticCardVer1>
                </Grid2>
                <Grid2 md={3} xs={12}>
                    <StatisticCardVer1
                        title="Tổng căn hộ" iconBgColor={Color.extraText}
                        isLoading={apartmentData.isLoading}
                        value={apartmentData.data && apartmentData.data.total.toString()}
                    >
                        <NightShelter sx={{ color: Color.secondary }} fontSize="small" />
                    </StatisticCardVer1>
                </Grid2>
                <Grid2 md={3} xs={12}>
                    <StatisticCardVer1
                        title="Tổng khách hàng"
                        isLoading={customerData.isLoading}
                        value={customerData.data && customerData.data.total.toString()}
                    >
                        <Groups sx={{ color: Color.extraText }} fontSize="small" />
                    </StatisticCardVer1>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={3}>
                <Grid2 md={4} xs={12}>
                    <ChartWidget
                        title="Căn hộ"
                        toottipTitle="Với căn hộ nhiều người thuê, mỗi căn hộ nhỏ được tính là 1 đơn vị"
                    >
                        <Center sx={{ width: '75%', maxWidth: 400, maxHeight: 450, minWidth: 300 }}>
                            {
                                apartmentData.isSuccess ?
                                    <Pie
                                        data={{
                                            labels: apartmentData.data.apartmentsByStatus.map(ele => ele.label),
                                            datasets: [
                                                {
                                                    label: 'Số căn hộ',
                                                    data: apartmentData.data.apartmentsByStatus.map(ele => ele.value),
                                                    backgroundColor: backgroundColor,
                                                    borderColor: borderColor,
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                        options={pieOptions}
                                    /> :
                                    <LoadingIndicator />
                            }
                        </Center>
                    </ChartWidget>
                </Grid2>
                <Grid2 md={4} xs={12}>
                    <ChartWidget
                        title="Khu vực"
                        toottipTitle="Biểu đồ thể hiện số căn hộ hiện đang được thuê phân bố theo khu vực."
                    >
                        <Center sx={{ width: '75%', maxWidth: 400, maxHeight: 450, minWidth: 300, overflow: 'visible' }}>
                            {
                                buildingData.isSuccess ?
                                    <Doughnut
                                        data={{
                                            labels: buildingData.data.apartmentsByLocation.map(ele => ele.location),
                                            // labels: ['Thành phố Biên Hoà, tỉnh Đồng Nai', 'Thành phố Biên Hoà, tỉnh Đồng Nai', 'Thành phố Biên Hoà, Nai', 'Thành phố Biên Hoà, Nai', 'Thành phố Biên Hoà, tỉnNai'],
                                            datasets: [
                                                {
                                                    label: 'Số căn hộ có hợp đồng',
                                                    data: buildingData.data.apartmentsByLocation.map(ele => ele.apartments),
                                                    // data: [1, 2, 3, 4, 5],
                                                    backgroundColor: backgroundColor,
                                                    borderColor: borderColor,
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                        options={doughnutOptions}
                                    /> :
                                    <LoadingIndicator />
                            }
                        </Center>
                    </ChartWidget>
                </Grid2>
                <Grid2 md={4} xs={12}>
                    <ChartWidget
                        title="Khách hàng"
                        toottipTitle=""
                    >
                        <Center sx={{ width: '75%', maxWidth: 400, maxHeight: 450, minWidth: 300 }}>
                            {
                                customerData.isSuccess ?
                                    <Pie
                                        data={{
                                            labels: customerData.data.customersByStatus.map(ele => ele.label),
                                            datasets: [
                                                {
                                                    label: 'Số khách hàng',
                                                    data: customerData.data.customersByStatus.map(ele => ele.value),
                                                    backgroundColor: backgroundColor,
                                                    borderColor: borderColor,
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                        options={pieOptions}
                                    /> :
                                    <LoadingIndicator />
                            }
                        </Center>
                    </ChartWidget>
                </Grid2>
            </Grid2>
        </>
    );
}