import {Box, Typography} from "@mui/material";
import TopBar from "../global/TopBar.jsx";

const NotFoundPage = () => {
    return (
        <>
            <TopBar/>
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography color="error" sx={{p: 3}}>Сторінку не знайдено (404)</Typography>
            </Box>
        </>
    );
};

export default NotFoundPage;