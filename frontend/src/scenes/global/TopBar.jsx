import {Box, IconButton, Stack, Tooltip, Typography, useTheme} from "@mui/material";

import {PersonOutlined} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {Link} from "react-router-dom";

import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import GradeIcon from '@mui/icons-material/Grade';

import {authStore} from "../../stores/authStore.js";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const TopBar = ({headerBox}) => {
    const theme = useTheme();

    const handleLogout = () => {
        authStore.logout();
    };

    const navItems = [
        {
            title: "Головна",
            to: "/",
            icon: <DashboardIcon/>,
            roles: ['ADMIN', 'COMMANDER', 'DEPARTMENT_EMPLOYEE', 'INSTRUCTOR']
        },
        {
            title: "Заняття",
            to: "/training-sessions",
            icon: <EventIcon/>,
            roles: ['ADMIN', 'COMMANDER', 'DEPARTMENT_EMPLOYEE', 'INSTRUCTOR']
        },
        {
            title: "Оцінки",
            to: "/standard-assessments",
            icon: <GradeIcon/>,
            roles: ['ADMIN', 'COMMANDER', 'INSTRUCTOR']
        },
        {
            title: "Військовослужбовці",
            to: "/military-personnel",
            icon: <GroupIcon/>,
            roles: ['ADMIN', 'DEPARTMENT_EMPLOYEE', 'COMMANDER']
        },
        {
            title: "Вправи",
            to: "/exercises",
            icon: <FitnessCenterIcon/>,
            roles: ['ADMIN', 'DEPARTMENT_EMPLOYEE', 'COMMANDER', 'INSTRUCTOR']
        },
        {title: "Локації", to: "/locations", icon: <PlaceIcon/>, roles: ['ADMIN', 'DEPARTMENT_EMPLOYEE']},
        {
            title: "Підрозділи",
            to: "/units",
            icon: <MilitaryTechIcon/>,
            roles: ['ADMIN', 'DEPARTMENT_EMPLOYEE', 'COMMANDER']
        },
        {title: "Користувачі", to: "/users", icon: <GroupIcon/>, roles: ['ADMIN']},
        {
            title: "Календар",
            to: "/calendar",
            icon: <CalendarTodayOutlinedIcon/>,
            roles: ['ADMIN', 'DEPARTMENT_EMPLOYEE', 'COMMANDER', 'INSTRUCTOR']
        },
    ];

    const currentUserRole = authStore.user?.role;

    return (
        <Box display="flex" justifyContent={headerBox ? "space-between" : "end"}
             p={2}
             sx={{
                 backgroundColor: theme.palette.background.paper,
                 borderBottom: `1px solid ${theme.palette.divider}`
             }}
        >
            {headerBox ? (
                <Box flexGrow={1}>{headerBox}</Box>
            ) : (
                <Typography variant="h4" component={Link} to="/"
                            sx={{
                                textDecoration: 'none',
                                color: theme.palette.text.primary,
                                alignSelf: 'center',
                                flexGrow: 1
                            }}>
                    Облік Фіз. Підготовки
                </Typography>
            )}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                {navItems.filter(item => item.roles.includes(currentUserRole)).map((item) => (
                    <Tooltip title={item.title} key={item.to}>
                        <Link to={item.to}>
                            <IconButton sx={{color: theme.palette.text.secondary}}>
                                {item.icon}
                            </IconButton>
                        </Link>
                    </Tooltip>
                ))}

                <Tooltip title={'Профіль'}>
                    <Link to={'/profile'}>
                        <IconButton sx={{color: theme.palette.text.secondary}}>
                            <PersonOutlined/>
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title={'Вийти з акаунту'}>
                    <IconButton onClick={handleLogout} sx={{color: theme.palette.text.secondary}}>
                        <LogoutIcon/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}

export default TopBar;