import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import { RANKS_LIST, CADET_POSITIONS_LIST } from '../../utils/constants';

const CadetFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cadetStore, educationalGroupStore } = useStore();

    const [formValues, setFormValues] = useState({
        fullName: '',
        rank: '',
        position: '',
        educationalGroupId: '',
    });
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);

    useEffect(() => {
        // Завантажуємо дані, якщо їх немає
        if (cadetStore.cadets.length === 0 && isEditMode) {
            cadetStore.fetchAll();
        }
        if (educationalGroupStore.groups.length === 0) {
            educationalGroupStore.fetchAll();
        }
    }, [cadetStore, educationalGroupStore, isEditMode]);

    useEffect(() => {
        if (isEditMode && cadetStore.cadets.length > 0) {
            const itemToEdit = cadetStore.cadets.find((item) => item.id === parseInt(id));
            if (itemToEdit) {
                setFormValues({
                    fullName: itemToEdit.fullName,
                    rank: itemToEdit.rank,
                    position: itemToEdit.position,
                    educationalGroupId: itemToEdit.educationalGroupId || '',
                });
            }
        }
    }, [id, isEditMode, cadetStore.cadets]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.fullName) tempErrors.fullName = 'ПІБ є обов\'язковим полем';
        if (!formValues.rank) tempErrors.rank = 'Звання є обов\'язковим полем';
        if (!formValues.position) tempErrors.position = 'Посада є обов\'язковим полем';
        if (!formValues.educationalGroupId) tempErrors.educationalGroupId = 'Навчальна група є обов\'язковим полем';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditMode) {
                await cadetStore.updateItem(id, formValues);
            } else {
                await cadetStore.createItem(formValues);
            }
            navigate('/cadets');
        }
    };

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ КУРСАНТА' : 'СТВОРИТИ КУРСАНТА'}
                subtitle={isEditMode ? 'Редагування даних курсанта' : 'Створення нового курсанта'}
            />

            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="ПІБ"
                        onChange={handleChange}
                        value={formValues.fullName}
                        name="fullName"
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={{ gridColumn: 'span 4' }}
                    />

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 1' }} error={!!errors.rank}>
                        <InputLabel>Звання</InputLabel>
                        <Select name="rank" value={formValues.rank} label="Звання" onChange={handleChange}>
                            {RANKS_LIST.map((rank) => (<MenuItem key={rank} value={rank}>{rank}</MenuItem>))}
                        </Select>
                        {errors.rank && <FormHelperText>{errors.rank}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 1' }} error={!!errors.position}>
                        <InputLabel>Посада</InputLabel>
                        <Select name="position" value={formValues.position} label="Посада" onChange={handleChange}>
                            {CADET_POSITIONS_LIST.map((pos) => (<MenuItem key={pos} value={pos}>{pos}</MenuItem>))}
                        </Select>
                        {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 2' }} error={!!errors.educationalGroupId}>
                        <InputLabel>Навчальна група</InputLabel>
                        <Select name="educationalGroupId" value={formValues.educationalGroupId} label="Навчальна група" onChange={handleChange}>
                            {educationalGroupStore.groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.educationalGroupId && <FormHelperText>{errors.educationalGroupId}</FormHelperText>}
                    </FormControl>

                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{ mr: 2 }} onClick={() => navigate('/cadets')}>
                        Скасувати
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        {isEditMode ? 'Зберегти зміни' : 'Створити курсанта'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(CadetFormPage);