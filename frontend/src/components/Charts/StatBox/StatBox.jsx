import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import {tokens} from "../../../theme.js";

const StatBox = ({ title, subtitle, value, icon, increase }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box width="100%" p="15px 20px" backgroundColor={colors.primary[400]} borderRadius="4px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    {icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                        {title}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                    {subtitle}
                </Typography>
                {increase && (
                    <Typography variant="h5" fontStyle="italic" sx={{ color: colors.greenAccent[600] }}>
                        {increase}
                    </Typography>
                )}
            </Box>
            <Typography variant="h3" fontWeight="bold" sx={{ color: colors.greenAccent[500], mt: "5px" }}>
                {value}
            </Typography>
        </Box>
    );
};

export default StatBox;