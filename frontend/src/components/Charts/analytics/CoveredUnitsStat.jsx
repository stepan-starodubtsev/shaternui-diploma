import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, useTheme } from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import unitStore from '../../../stores/unitStore';
import { tokens } from "../../../theme.js";

const CoveredUnitsStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
    }, []);

    if (unitStore.loading && unitStore.units.length === 0) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    const coveredUnitsCount = unitStore.units.length;

    return (
        <StatBox
            title="Охоплено підрозділів"
            value={coveredUnitsCount}
            icon={<MilitaryTechIcon sx={{ color: colors.primary[500], fontSize: "26px" }} />}
        />
    );
});

export default CoveredUnitsStat;