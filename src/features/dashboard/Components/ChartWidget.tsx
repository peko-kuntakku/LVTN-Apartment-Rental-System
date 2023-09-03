import { Stack, Box, Typography, Tooltip as MuiTooltip } from "@mui/material";
import { Color } from "../../../styles/GlobalStyles";
import Center from "../../../common/StyledComponents/Center";
import { ReactElement } from "react";

export interface WidgetProps {
    title: string,
    toottipTitle?: string,
    children?: ReactElement

}

export default function ChartWidget({ title, toottipTitle, children }: WidgetProps) {
    return (
        <Stack sx={{ backgroundColor: Color.secondary, width: "100%", height: 490 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                <Stack direction="column" sx={{ width: 'fit-content' }}>
                    <MuiTooltip
                        title={toottipTitle}
                        placement='bottom-start'
                        arrow
                        followCursor
                    >
                        <Typography m={3} mb={0} variant="subtitle1"
                            color={Color.extraText}
                            fontWeight={600}
                        >{title}</Typography>
                    </MuiTooltip>
                </Stack>
                <Center sx={{ width: '100%' }}>
                    {children}
                </Center>
            </Box>
        </Stack>

    );
}
