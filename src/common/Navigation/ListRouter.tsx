import * as React from 'react';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles'
import { Color } from '../../styles/GlobalStyles';
import { ListItemButton, ListSubheader, Typography } from '@mui/material';
import { Apartment, CircleNotifications, Description, Discount, EventSeat, Group, Groups, Handyman, HolidayVillage, Home, NightShelter, PermContactCalendar, RequestPage, RoomService } from '@mui/icons-material';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

interface ListRouterProps {
    open: boolean,
}

const CustomNavLink = styled(NavLink)(({ theme }) => ({
    color: Color.extraText,
    textDecorationLine: 'none',
    "&:hover, &.active": {
        color: Color.primary,
        '& .MuiListItemIcon-root': {
            color: Color.primary,
        },
    }
}));

function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;

    return (
        <CustomNavLink to={to} >
            <ListItemButton sx={{
                "&:hover": {
                    backgroundColor: Color.primaryTransparent,
                },
                marginTop: 1,
                marginBottom: 1,
                marginLeft: 0.5,
                marginRight: 0.5,
                borderRadius: 12
            }}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} primaryTypographyProps={{ sx: { fontWeight: 500 }, }} />
            </ListItemButton>
        </CustomNavLink>
    );
}

export default function ListRouter({ open }: ListRouterProps) {
    return (
        <Paper elevation={0}>
            <ListItemLink to="/dashboard" primary="Trang chủ" icon={<Home />} />
            <List
                component="nav"
                sx={{ marginTop: 2 }}
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {
                            open
                                ? <Typography variant="body2">Tòa nhà</Typography>
                                :
                                <Divider />
                        }
                    </ListSubheader>
                }
            >
                <ListItemLink to="/buildings" primary="Toà nhà" icon={<Apartment />} />
                <ListItemLink to="/services" primary="Dịch vụ" icon={<RoomService />} />
            </List>
            <List
                component="nav"
                sx={{ marginTop: 2 }}
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {
                            open
                                ? <Typography variant="body2">Căn hộ</Typography>
                                :
                                <Divider />
                        }
                    </ListSubheader>
                }
            >
                <ListItemLink to="/apartments" primary="Một hợp đồng" icon={<NightShelter />} />
                <ListItemLink to="/complex-apartments" primary="Nhiều hợp đồng" icon={<HolidayVillage />} />
                <ListItemLink to="/properties" primary="Nội thất" icon={<EventSeat />} />
            </List>
            <List
                component="nav"
                sx={{ marginTop: 2 }}
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {
                            open
                                ? <Typography variant="body2">Quản lý chung</Typography>
                                :
                                <Divider />
                        }
                    </ListSubheader>
                }
            >
                <ListItemLink to="/contracts" primary="Hợp đồng" icon={<Description />} />
                <ListItemLink to="/invoices" primary="Hóa đơn" icon={<RequestPage />} />
                <ListItemLink to="/vouchers" primary="Mã giảm giá" icon={<Discount />} />
                <ListItemLink to="/requests" primary="Yêu cầu" icon={<Handyman />} />
                <ListItemLink to="/notifications" primary="Thông báo" icon={<CircleNotifications />} />
            </List>
            <List
                component="nav"
                sx={{ marginTop: 2 }}
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        {
                            open
                                ? <Typography variant="body2">Người dùng</Typography>
                                :
                                <Divider />
                        }
                    </ListSubheader>
                }
            >
                <ListItemLink to="/customers" primary="Khách hàng" icon={<Groups />} />
                <ListItemLink to="/employee" primary="Nhân viên" icon={<Group />} />
                <ListItemLink to="/attendances" primary="Điểm danh nhân viên" icon={<PermContactCalendar />} />
            </List>
        </Paper>
    );
}