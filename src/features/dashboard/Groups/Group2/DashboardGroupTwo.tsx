import Grid2 from '@mui/material/Unstable_Grid2';
import { Typography } from "@mui/material";
import ChartWidget from '../../Components/ChartWidget';
import { useAppSelector } from '../../../../app/hooks';
import { selectCurrentUser } from '../../../../app/features/authentication/authSlice';
import { useQuery } from 'react-query';
import dashboardApi from '../../../../api/dashboardApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import Center from '../../../../common/StyledComponents/Center';
import LoadingIndicator from '../../../../common/Indicators/LoadingIndicator';
import { backgroundColor, barOptions, borderColor, doughnutOptions } from '../../Charts/options';
import { ChartDataModel, DashboardRevenueInMonthModel } from '../../../../model/Dashboard';
import FirstRow from './FirstRow';
import { getDashboardRevenueLabel } from '../../../../utils/invoiceUtils';
import { Color } from '../../../../styles/GlobalStyles';

ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, BarElement, PointElement, LineElement
);

export default function DashboardGroupTwo() {
    const currentUser = useAppSelector(selectCurrentUser);

    const revenueInMonth = useQuery(['dashboard-revenue-in-month'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.calculateRevenueInMonth(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            const data: DashboardRevenueInMonthModel = res.data;
            return data;
        },
        retry: 1,
        refetchOnMount: true,
    });

    const costInMonth = useQuery(['dashboard-cost-in-month'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.calculateCostInMonth(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            const data: DashboardRevenueInMonthModel = res.data;
            return data;
        },
        retry: 1,
        refetchOnMount: true,
    });

    const customerData = useQuery(['dashboard-customer-by-year'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.countCustomersByLastYear(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            let data: ChartDataModel[] = res.data;
            return data;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
        },
        refetchOnMount: true,
    });

    const revenueInLastYear = useQuery(['dashboard-revenue-by-year'], async ({ signal }) => {
        if (signal && currentUser?.jwt) {
            return await dashboardApi.countRevenueInLastYear(currentUser.jwt, signal)
        }
    }, {
        enabled: true,
        select: (res: any) => {
            let data: ChartDataModel[] = res.data;
            return data;
        },
        retry: 1,
        onError: (error) => {
            console.log(error);
        },
        refetchOnMount: true,
    });    

    return (
        <>
            <Typography variant="h6" fontWeight="600" mb={1} mt={5}>Tháng này</Typography>
            <FirstRow
                revenueData={revenueInMonth.data?.total}
                revenueLoading={revenueInMonth.isLoading}
                costData={costInMonth.data?.total}
                costLoading={costInMonth.isLoading}
                customerData={customerData.data && customerData.data[11].value.toString()}
                customerLoading={customerData.isLoading}
            />
            <Grid2 container spacing={3}>
                <Grid2 md={4} xs={12}>
                    <ChartWidget
                        title="Doanh thu"
                        toottipTitle=""
                    >
                        <Center sx={{ width: '75%', maxWidth: 400, maxHeight: 450, minWidth: 300 }}>
                            {
                                revenueInMonth.isSuccess ?
                                    <Doughnut
                                        data={{
                                            labels: revenueInMonth.data.chartData.map(ele =>
                                                getDashboardRevenueLabel(parseInt(ele.label))
                                            ),
                                            datasets: [
                                                {
                                                    label: 'Số tiền (đồng)',
                                                    data: revenueInMonth.data.chartData.map(ele => ele.value),
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
                <Grid2 md={8} xs={12}>
                    <ChartWidget
                        title="Doanh thu hàng tháng"
                        toottipTitle=""
                    >
                        <Center sx={{ width: '100%', maxWidth: 1000, maxHeight: 380, minWidth: 300, overflow: 'visible' }}>
                            {
                                revenueInLastYear.isSuccess ?
                                    <Line options={barOptions}
                                        data={{
                                            labels: revenueInLastYear.data.map(ele => ele.label),
                                            datasets: [
                                                {
                                                    label: 'Doanh thu (đồng)',
                                                    data: revenueInLastYear.data.map(ele => ele.value),
                                                    borderColor: Color.primary,
                                                    backgroundColor: Color.chart.primaryBg,
                                                },
                                            ],
                                        }}
                                    /> :
                                    <LoadingIndicator />
                            }
                        </Center>
                    </ChartWidget>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={3} mb={5}>
                <Grid2 md={4} xs={12}>
                    <ChartWidget
                        title="Chi phí"
                        toottipTitle=""
                    >
                        <Center sx={{ width: '75%', maxWidth: 400, maxHeight: 450, minWidth: 300 }}>
                            {
                                costInMonth.isSuccess ?
                                    <Doughnut
                                        data={{
                                            labels: costInMonth.data.chartData.map(ele => ele.label),
                                            datasets: [
                                                {
                                                    label: 'Số tiền (đồng)',
                                                    data: costInMonth.data.chartData.map(ele => ele.value),
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
                <Grid2 md={8} xs={12}>
                    <ChartWidget
                        title="Khách hàng mới hàng tháng"
                        toottipTitle=""
                    >
                        <Center sx={{ width: '100%', maxWidth: 1000, maxHeight: 380, minWidth: 300, overflow: 'visible' }}>
                            {
                                customerData.isSuccess ?
                                    <Line options={barOptions}
                                        data={{
                                            labels: customerData.data.map(ele => ele.label),
                                            datasets: [
                                                {
                                                    label: 'Khách hàng (người)',
                                                    data: customerData.data.map(ele => ele.value),
                                                    borderColor: Color.warning,
                                                    backgroundColor: Color.chart.warningBg,
                                                },
                                            ],
                                        }}
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