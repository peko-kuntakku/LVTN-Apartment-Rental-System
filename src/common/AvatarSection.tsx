import { Typography } from "@mui/material";
import Grid2, { Grid2Props } from "@mui/material/Unstable_Grid2";
import { Color } from "../styles/GlobalStyles";
import { styled } from '@mui/material/styles';
import Center from "./StyledComponents/Center";
import { drawerWidth } from "./Navigation/Drawer";
import { AccountCircle } from "@mui/icons-material";
import { useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../app/features/authentication/authSlice";

const Container = styled(Grid2)<Grid2Props>(({ theme }) => ({
    width: drawerWidth,
}));

export default function AvatarSection(props: Grid2Props) {
    const currentUser = useAppSelector(selectCurrentUser);
    return (
        <Container container {...props}>
            <Grid2 xs={3}>
                <Center>
                    {/* <Avatar
                        sx={{ bgcolor: deepOrange[500] }}
                        alt="Remy Sharp"
                        src="/broken-image.jpg"
                    >
                        B
                    </Avatar> */}
                    <AccountCircle sx={{ fontSize: 45, color: Color.border }} />
                </Center>
            </Grid2>
            <Grid2 xs={1}></Grid2>
            <Grid2 xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" fontWeight="600" color={Color.normalText}>{currentUser?.username}</Typography>
                <Typography variant="body2" color={Color.extraText}>Quản trị viên</Typography>
            </Grid2>
        </Container>
    );
}