import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Typography, useTheme, Grid, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import useError from "../../utils/useError.js";
import locationStore from "../../stores/locationStore.js";


const LocationFormPage = () => {
    const theme = useTheme();
    const {locationId} = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState({
        name: '',
        description: '',
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (locationId) {
            const existingLocation = locationStore.locations.find(loc => loc.location_id === parseInt(locationId));
            if (existingLocation) {
                setLocation(existingLocation);
            } else {
                locationStore.loadLocationById(locationId).then(data => setLocation(data));
            }
        } else {
            setLocation({name: '', description: ''});
        }
    }, [locationId]);

    useError(locationStore);

    const handleChange = (e) => {
        setLocation({...location, [e.target.name]: e.target.value});
    };

    const validateForm = () => {
        if (!location.name.trim()) {
            setFormError("Назва локації є обов'язковою.");
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
        try {
            if (locationId) {
                await locationStore.updateLocation(locationId, location);
            } else {
                await locationStore.addLocation(location);
            }
            navigate('/locations');
        } catch (error) {
            setFormError(error.message || "Помилка збереження локації");
        }
    };

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={locationId ? `Редагувати Локацію №${locationId}` : "Створити Нову Локацію"}
                    subtitle={locationId ? "Оновлення даних про місце проведення" : "Введення даних для нового місця проведення"}
                />
            }/>
            <Box>
                <Stack component="form" onSubmit={handleSubmit} spacing={3} sx={{mt: 2}}>
                    <TextField
                        label="Назва локації"
                        name="name"
                        value={location.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formError && formError.includes("Назва")}
                        helperText={formError && formError.includes("Назва") ? formError : ''}
                    />
                    <TextField
                        label="Опис локації"
                        name="description"
                        value={location.description}
                        onChange={handleChange}
                        fullWidth

                        rows={4}
                    />
                    {formError && !formError.includes("Назва") && <Typography color="error">{formError}</Typography>}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="secondary">
                            {locationId ? "Зберегти Зміни" : "Створити Локацію"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default observer(LocationFormPage);