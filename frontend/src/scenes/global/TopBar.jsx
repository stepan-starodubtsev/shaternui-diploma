import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

// Іконки
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'; // для Дисциплін
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // для Викладачів
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'; // для Груп
import PersonOutlined from '@mui/icons-material/PersonOutlined'; // для Профілю
import LogoutIcon from '@mui/icons-material/Logout';
import {tokens} from "../../theme.js";
// import { useStore } from "../../stores/mobx/storeContext"; // Розкоментуємо, коли будемо робити auth

const TopBar = ({ headerBox }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // const { authStore } = useStore(); // Поки не використовуємо

    const handleLogout = () => {
        // authStore.logout(); // Логіка виходу буде додана пізніше
        console.log("Logout clicked");
    };

    // НОВИЙ МАСИВ НАВІГАЦІЇ
    const navItems = [
        {
            title: "Головна",
            to: "/",
            icon: <DashboardIcon />,
            roles: ['ADMIN', 'INSTRUCTOR'] // Доступ для всіх ролей
        },
        {
            title: "Навчальні дисципліни",
            to: "/academic-disciplines",
            icon: <MenuBookOutlinedIcon />,
            roles: ['ADMIN'] // Доступ тільки для адміна
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
        // Сюди ми будемо додавати наступні сутності (Курсанти, Заняття)
    ];

    // ТИМЧАСОВЕ РІШЕННЯ: Оскільки authStore ще не реалізований,
    // ми жорстко задаємо роль, щоб бачити посилання.
    // У майбутньому це буде братися зі стору: authStore.user?.role
    const currentUserRole = 'ADMIN';

    return (
        <Box display="flex" justifyContent={headerBox ? "space-between" : "end"}
             p={2}
             sx={{
                 backgroundColor: theme.palette.background.default, // Використовуємо фон за замовчуванням
                 borderBottom: `1px solid ${theme.palette.divider}`
             }}
        >
            {headerBox ? (
                <Box flexGrow={1}>{headerBox}</Box>
            ) : (
                <Typography variant="h4" component={Link} to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit', // Наслідуємо колір з теми
                                alignSelf: 'center',
                                flexGrow: 1
                            }}>
                    Облік Відвідувань
                </Typography>
            )}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                {navItems.filter(item => item.roles.includes(currentUserRole)).map((item) => (
                    <Tooltip title={item.title} key={item.to}>
                        <Link to={item.to}>
                            <IconButton sx={{ color: colors.purpleAccent[500] }}>
                                {item.icon}
                            </IconButton>
                        </Link>
                    </Tooltip>
                ))}

                <Tooltip title={'Профіль'}>
                    <Link to={'/profile'}>
                        <IconButton sx={{ color: colors.purpleAccent[500] }}>
                            <PersonOutlined />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title={'Вийти з акаунту'}>
                    <IconButton onClick={handleLogout} sx={{ color: colors.purpleAccent[500] }}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}

export default TopBar;