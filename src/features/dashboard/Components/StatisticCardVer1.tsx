import { Typography, Stack, Box, CircularProgress } from "@mui/material";
import Center from "../../../common/StyledComponents/Center";
import { Color } from "../../../styles/GlobalStyles";
import { ReactElement } from "react";

interface Props {
    children: ReactElement,
    title: string,
    iconBgColor?: string,
    value?: string,
    isLoading?: boolean,
}

export default function StatisticCardVer1({ children, title, iconBgColor, value, isLoading }: Props) {
    return (
        <Stack sx={{ backgroundColor: Color.secondary, width: "100%", height: 110 }} justifyContent="center">
            <Box sx={{ marginLeft: 3, marginRight: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1"
                        color={Color.extraText}
                        // fontWeight={600}
                    >{title}</Typography>
                    <Center sx={{
                        backgroundColor: iconBgColor ? iconBgColor : Color.secondary,
                        width: 30, height: 30,
                        borderRadius: 50,
                        border: `1px solid ${Color.border}`
                    }}>
                        {children}
                    </Center>
                </Stack>
                {
                    !value ?
                    <CircularProgress size={25} /> :
                    <Typography variant="h5" fontWeight={600} color={Color.primary}>{value}</Typography>
                }
            </Box>
        </Stack>
    );
}