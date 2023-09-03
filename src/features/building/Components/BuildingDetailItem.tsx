import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Color } from '../../../styles/GlobalStyles';

interface Props {
    leftText: string,
    rightText?: string,
    rightTextColor?: string,
    left?: number,
    right?: number,
}

export default function BuildingDetailItem({ leftText, rightText, rightTextColor, left, right }: Props) {
    return (
        <Grid2 container pl={0}>
            <Grid2 xs={left ? left : 3}>
                <Typography color={Color.extraText}>{leftText}</Typography>
            </Grid2>
            <Grid2 xs={right ? right: 8}>
                <Typography color={rightTextColor && rightTextColor}>{rightText}</Typography>
            </Grid2>
        </Grid2>
    );
}