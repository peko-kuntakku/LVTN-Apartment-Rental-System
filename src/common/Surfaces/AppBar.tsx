import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { drawerWidth } from '../Navigation/Drawer';
import { styled } from '@mui/material/styles';
import { IconButton, Toolbar, Box, Badge, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout, Notifications } from '@mui/icons-material';
import { Color } from '../../styles/GlobalStyles';
import AvatarSection from '../AvatarSection';
import SearchBar from '../SearchBar';
import { useAppDispatch } from '../../app/hooks';
import { authActions } from '../../app/features/authentication/authSlice';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

interface Props {
    open: boolean,
    handleDrawerOpen: () => void,
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    backgroundColor: Color.secondary,
}));

export default function CustomAppBar({ open, handleDrawerOpen }: Props) {
    const dispatch = useAppDispatch();

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                        color: Color.extraText
                    }}
                >
                    <MenuIcon />
                </IconButton>
                {/* <SearchBar /> */}
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {/* <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        sx={{ color: Color.extraText, marginRight: 2 }}
                    >
                        <Badge badgeContent={17} color="error">
                            <Notifications/>
                        </Badge>
                    </IconButton> */}
                    <Tooltip title='Đăng xuất'>
                        <IconButton
                            size="large"
                            aria-label="logout icon button"
                            sx={{ color: Color.extraText, marginRight: 2 }}
                            onClick={() => dispatch(authActions.logout())}
                        >
                            <Logout />
                        </IconButton>
                    </Tooltip>
                    <AvatarSection sx={{ borderLeft: `1px solid ${Color.border}` }} />
                    {/* <IconButton
                        size="large"
                        edge="end"
                        sx={{ color: Color.extraText }}
                    >
                        <AccountCircle />
                    </IconButton> */}
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    {/* <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
