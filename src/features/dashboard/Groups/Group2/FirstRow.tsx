import { AttachMoney, Description, Groups } from "@mui/icons-material";
import { Color } from "../../../../styles/GlobalStyles";
import StatisticCardVer1 from '../../Components/StatisticCardVer1';
import Grid2 from '@mui/material/Unstable_Grid2';
import { currencyFormatter } from "../../../../utils/utils";

interface RowProps {
    revenueData?: number,
    revenueLoading?: boolean,
    costData?: number,
    costLoading?: boolean,
    customerData?: string,
    customerLoading?: boolean,
}

/*
    Value = 0 becomes false and not show
*/
export default function FirstRow({ 
    revenueData, 
    revenueLoading, 
    costData, 
    costLoading, 
    customerData,
    customerLoading,
}: RowProps) {
    return (
        <Grid2 container spacing={3} mb={2}>
            <Grid2 md={3} xs={12}>
                <StatisticCardVer1 title="Doanh thu (đồng)"
                    isLoading={revenueLoading}
                    value={revenueData ? currencyFormatter.format(revenueData) : ''}
                >
                    <AttachMoney sx={{ color: Color.extraText }} fontSize="small" />
                </StatisticCardVer1>
            </Grid2>
            <Grid2 md={3} xs={12}>
                <StatisticCardVer1
                    title="Chi phí (đồng)" 
                    iconBgColor={Color.extraText}
                    isLoading={costLoading}
                    value={costData ? currencyFormatter.format(costData) : ''}
                >
                    <AttachMoney sx={{ color: Color.secondary }} fontSize="small" />
                </StatisticCardVer1>
            </Grid2>
            <Grid2 md={3} xs={12}>
                <StatisticCardVer1
                    title="Hợp đồng" iconBgColor={Color.extraText}
                    // isLoading={apartmentData.isLoading}
                    // value={apartmentData.data && apartmentData.data.total.toString()}
                >
                    <Description sx={{ color: Color.secondary }} fontSize="small" />
                </StatisticCardVer1>
            </Grid2>
            <Grid2 md={3} xs={12}>
                <StatisticCardVer1
                    title="Khách hàng"
                    isLoading={customerLoading}
                    value={customerData ? customerData : ''}
                >
                    <Groups sx={{ color: Color.extraText }} fontSize="small" />
                </StatisticCardVer1>
            </Grid2>
        </Grid2>
    );
}