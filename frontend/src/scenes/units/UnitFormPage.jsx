import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, useTheme, Grid, Stack, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import unitStore from "../../stores/unitStore.js";
import useError from "../../utils/useError.js";

const UnitFormPage = () => {
    const theme = useTheme();
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [unit, setUnit] = useState({
        unit_name: '',
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (unitId) {
            setIsLoading(true);
            unitStore.loadUnitById(unitId).then((data) => {
                if (data) {
                    setUnit(data);
                } else {
                    setFormError("Не вдалося завантажити дані підрозділу.");
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        } else {
            setUnit({ unit_name: '' });
            unitStore.clearSelectedUnit();
        }
        setFormError('');
    }, [unitId]);

    useError(unitStore);

    const handleChange = (e) => {
        setUnit({ ...unit, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!unit.unit_name.trim()) {
            setFormError("Назва підрозділу є обов'язковою.");
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
        const dataToSubmit = { unit_name: unit.unit_name };

        try {
            if (unitId) {
                await unitStore.updateUnit(unitId, dataToSubmit);
            } else {
                await unitStore.addUnit(dataToSubmit);
            }
            navigate('/units');
        } catch (error) {
            setFormError(unitStore.error || "Помилка збереження підрозділу");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && unitId && !unitStore.selectedUnit) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Завантаження даних підрозділу...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ m: "20px" }}>
            <TopBar headerBox={
                <Header
                    title={unitId ? `Редагувати Підрозділ №${unit.unit_name || unitId}` : "Створити Новий Підрозділ"}
                    subtitle={unitId ? "Оновлення даних про підрозділ" : "Введення даних для нового підрозділу"}
                />
            } />
            <Box>
                <Stack component="form" onSubmit={handleSubmit} spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        label="Назва підрозділу"
                        name="unit_name"
                        value={unit.unit_name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formError && formError.includes("Назва")}
                        helperText={formError && formError.includes("Назва") ? formError : ''}
                        disabled={isLoading}
                    />

                    {formError && <Typography color="error">{formError}</Typography>}
                    {unitStore.error && <Typography color="error" sx={{ mt: 1 }}>{unitStore.error}</Typography>}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="secondary" disabled={isLoading || unitStore.loading}>
                            {isLoading || unitStore.loading ? <CircularProgress size={24} /> : (unitId ? "Зберегти Зміни" : "Створити Підрозділ")}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default observer(UnitFormPage);