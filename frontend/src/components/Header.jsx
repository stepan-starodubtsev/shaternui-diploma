import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../theme';

const Header = ({ title, subtitle }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box mb="30px">
            <Typography
                variant="h2"
                // ВИПРАВЛЕНО: Використовуємо темний колір для світлої теми і навпаки
                color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800]}
                fontWeight="bold"
                sx={{ mb: '5px' }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={colors.purpleAccent[400]}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header;