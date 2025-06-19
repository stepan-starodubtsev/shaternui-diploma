import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Іконки
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlined from '@mui/icons-material/PersonOutlined';

import { useStore } from "../../stores/mobx/storeContext";

const TopBar = ({ headerBox }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { authStore } = useStore(); // Отримуємо наш стор

    const handleLogout = () => {
        authStore.logout(); // Викликаємо метод виходу зі стору
        navigate('/login'); // Перенаправляємо на сторінку входу
    };

    // Оновлений масив навігації з правильними ролями
    const navItems = [
        {
            title: "Головна",
            to: "/",
            icon: <DashboardIcon />,
            roles: ['ADMIN', 'INSTRUCTOR']
        },
        {
            title: "Календар",
            to: "/calendar",
            icon: <CalendarTodayOutlinedIcon />,
            roles: ['ADMIN', 'INSTRUCTOR']
        },
        {
            title: "Заняття",
            to: "/lessons",
            icon: <EventNoteOutlinedIcon />,
            roles: ['ADMIN', 'INSTRUCTOR'] // Викладач має бачити список занять
        },
        {
            title: "Навчальні дисципліни",
            to: "/academic-disciplines",
            icon: <MenuBookOutlinedIcon />,
            roles: ['ADMIN']
        },
        {
            title: "Викладачі",
            to: "/instructors",
            icon: <PersonOutlineIcon />,
            roles: ['ADMIN']
        },
        {
            title: "Навчальні групи",
            to: "/educational-groups",
            icon: <GroupsOutlinedIcon />,
            roles: ['ADMIN']
        },
        {
            title: "Курсанти",
            to: "/cadets",
            icon: <FaceOutlinedIcon />,
            roles: ['ADMIN']
        },
        {
            title: "Користувачі",
            to: "/users",
            icon: <SupervisorAccountOutlinedIcon />,
            roles: ['ADMIN']
        },
    ];

    // ВИПРАВЛЕНО: Беремо реальну роль з authStore
    const currentUserRole = authStore.user?.role;

    return (
        <Box display="flex" justifyContent={headerBox ? "space-between" : "end"}
             p={2}
             sx={{
                 backgroundColor: theme.palette.background.default,
                 borderBottom: `1px solid ${theme.palette.divider}`
             }}
        >
            {headerBox ? (
                <Box flexGrow={1}>{headerBox}</Box>
            ) : (
                <Typography variant="h4" component={Link} to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                alignSelf: 'center',
                                flexGrow: 1
                            }}>
                    Облік Відвідувань
                </Typography>
            )}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                {/* Фільтруємо посилання на основі ролі поточного користувача */}
                {navItems.filter(item => item.roles.includes(currentUserRole)).map((item) => (
                    <Tooltip title={item.title} key={item.to}>
                        <Link to={item.to}>
                            <IconButton sx={{ color: 'inherit' }}>
                                {item.icon}
                            </IconButton>
                        </Link>
                    </Tooltip>
                ))}

                <Tooltip title={'Профіль'}>
                    <Link to={'/profile'}>
                        <IconButton sx={{ color: 'inherit' }}>
                            <PersonOutlined />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title={'Вийти з акаунту'}>
                    <IconButton onClick={handleLogout} sx={{ color: 'inherit' }}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}

// Огортаємо компонент в observer, щоб він реагував на зміни в authStore
export default observer(TopBar);