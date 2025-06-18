import {Box, Typography} from "@mui/material";
import TopBar from "../global/TopBar.jsx";

const AccessDeniedPage = () => {
    return (
        <>
            <TopBar/>
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="h5" color="error">Доступ заборонено</Typography>
                <Typography>У вас недостатньо прав для перегляду цієї сторінки.</Typography>
            </Box>
        </>
    );
};

export default AccessDeniedPage;