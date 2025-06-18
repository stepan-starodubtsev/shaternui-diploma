import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, useTheme, Grid, Stack, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import militaryPersonnelStore from "../../stores/militaryPersonnelStore";
import unitStore from "../../stores/unitStore.js";
import useError from "../../utils/useError.js";
import { RANKS_LIST } from "../../utils/constants.js";

const MilitaryPersonnelFormPage = () => {
    const theme = useTheme();
    const { personnelId } = useParams();
    const navigate = useNavigate();
    dayjs.locale('uk');

    const [personnel, setPersonnel] = useState({
        first_name: '',
        last_name: '',
        rank: '',
        date_of_birth: null,
        unit_id: '',
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
        if (personnelId) {
            setIsLoading(true);
            militaryPersonnelStore.loadPersonnelById(parseInt(personnelId)).then((data) => {
                if (data) {
                    setPersonnel({
                        ...data,
                        date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth) : null
                    });
                } else {
                    setFormError("Не вдалося завантажити дані військовослужбовця.");
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        } else {
            setPersonnel({ first_name: '', last_name: '', rank: '', date_of_birth: null, unit_id: '' });
            militaryPersonnelStore.clearSelectedPersonnel();
        }
        setFormError('');
    }, [personnelId]);

    useError(militaryPersonnelStore);
    useError(unitStore);

    const handleChange = (e) => {
        setPersonnel({ ...personnel, [e.target.name]: e.target.value });
    };

    const handleDateChange = (newDate) => {
        setPersonnel({ ...personnel, date_of_birth: newDate });
    };

    const validateForm = () => {
        if (!personnel.first_name.trim() || !personnel.last_name.trim() || !personnel.rank || !personnel.date_of_birth || !personnel.unit_id) {
            setFormError("Ім'я, прізвище, звання, дата народження та підрозділ є обов'язковими.");
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setFormError('');
        const dataToSubmit = {
            ...personnel,
            date_of_birth: personnel.date_of_birth ? personnel.date_of_birth.format('YYYY-MM-DD') : null,
            unit_id: personnel.unit_id ? parseInt(personnel.unit_id) : null
        };

        try {
            if (personnelId) {
                await militaryPersonnelStore.updatePersonnel(personnelId, dataToSubmit);
            } else {
                await militaryPersonnelStore.addPersonnel(dataToSubmit);
            }
            navigate('/military-personnel');
        } catch (error) {
            setFormError(militaryPersonnelStore.error || "Помилка збереження даних військовослужбовця");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && personnelId) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Завантаження даних...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ m: "20px" }}>
            <TopBar headerBox={
                <Header
                    title={personnelId ? `Редагувати Військовослужбовця №${personnel.last_name || personnelId}` : "Додати Нового Військовослужбовця"}
                    subtitle={personnelId ? "Оновлення даних особового складу" : "Введення даних нового військовослужбовця"}
                />
            } />
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item size={4}>
                                <TextField
                                    label="Прізвище"
                                    name="last_name"
                                    value={personnel.last_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Ім'я"
                                    name="first_name"
                                    value={personnel.first_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Звання"
                                    name="rank"
                                    value={personnel.rank}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading}
                                >
                                    {RANKS_LIST.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item size={4}>
                                <DatePicker
                                    label="Дата народження"
                                    value={personnel.date_of_birth}
                                    onChange={handleDateChange}
                                    slotProps={{ textField: { fullWidth: true, required: true, disabled: isLoading } }}
                                    format="DD.MM.YYYY"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item size={4}>
                                <TextField
                                    label="Підрозділ"
                                    name="unit_id"
                                    value={personnel.unit_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    select
                                    required
                                    disabled={isLoading || unitStore.loading}
                                >
                                    <MenuItem value=""><em>Оберіть підрозділ</em></MenuItem>
                                    {unitStore.units.map((unit) => (
                                        <MenuItem key={unit.unit_id} value={unit.unit_id}>
                                            {unit.unit_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        {formError && <Typography color="error" sx={{ mt: 1 }}>{formError}</Typography>}
                        {militaryPersonnelStore.error && <Typography color="error" sx={{ mt: 1 }}>{militaryPersonnelStore.error}</Typography>}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button type="submit" variant="contained" color="secondary" disabled={isLoading || militaryPersonnelStore.loading}>
                                {isLoading || militaryPersonnelStore.loading ? <CircularProgress size={24} /> : (personnelId ? "Зберегти Зміни" : "Додати Військовослужбовця")}
                            </Button>
                        </Box>
                    </Stack>
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default observer(MilitaryPersonnelFormPage);