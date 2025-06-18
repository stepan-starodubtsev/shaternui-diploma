import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, useTheme } from '@mui/material';
import StatBox from '../StatBox/StatBox.jsx';
import GroupIcon from '@mui/icons-material/Group';
import militaryPersonnelStore from '../../../stores/militaryPersonnelStore';
import { tokens } from "../../../theme.js";

const TotalMilitaryPersonnelStat = observer(() => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (militaryPersonnelStore.personnelList.length === 0 && !militaryPersonnelStore.loading) {
            militaryPersonnelStore.loadPersonnel();
        }
    }, []);

    if (militaryPersonnelStore.loading && militaryPersonnelStore.personnelList.length === 0) {
        return <Typography variant="caption">Завантаження...</Typography>;
    }

    return (
        <StatBox
            title="Всього особового складу"
            value={militaryPersonnelStore.personnelList.length}
            icon={<GroupIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
        />
    );
});

export default TotalMilitaryPersonnelStat;