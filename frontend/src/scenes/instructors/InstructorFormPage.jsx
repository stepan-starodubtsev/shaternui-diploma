import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import { RANKS_LIST, ACADEMIC_DEGREES_LIST, INSTRUCTOR_POSITIONS_LIST } from '../../utils/constants';

const InstructorFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { instructorStore } = useStore();
    const { instructors, createItem, updateItem, fetchAll } = instructorStore;

    const [formValues, setFormValues] = useState({
        fullName: '',
        rank: '',
        academicDegree: '',
        position: '',
    });
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && instructors.length === 0) {
            fetchAll();
        }
    }, [fetchAll, instructors.length, isEditMode]);

    useEffect(() => {
        if (isEditMode && instructors.length > 0) {
            const itemToEdit = instructors.find((item) => item.id === parseInt(id));
            if (itemToEdit) {
                setFormValues({
                    fullName: itemToEdit.fullName,
                    rank: itemToEdit.rank || '',
                    academicDegree: itemToEdit.academicDegree || '',
                    position: itemToEdit.position,
                });
            }
        }
    }, [id, isEditMode, instructors]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.fullName) tempErrors.fullName = 'ПІБ є обов\'язковим полем';
        if (!formValues.position) tempErrors.position = 'Посада є обов\'язковим полем';
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
            const dataToSend = { ...formValues };
            if (dataToSend.rank === '') dataToSend.rank = null;
            if (dataToSend.academicDegree === '') dataToSend.academicDegree = null;

            if (isEditMode) {
                await updateItem(id, dataToSend);
            } else {
                await createItem(dataToSend);
            }
            navigate('/instructors');
        }
    };

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ ВИКЛАДАЧА' : 'СТВОРИТИ ВИКЛАДАЧА'}
                subtitle={isEditMode ? 'Редагування даних викладача' : 'Створення нового викладача'}
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

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 1' }}>
                        <InputLabel>Звання</InputLabel>
                        <Select name="rank" value={formValues.rank} label="Звання" onChange={handleChange}>
                            <MenuItem value=""><em>Цивільний</em></MenuItem>
                            {RANKS_LIST.map((rank) => (<MenuItem key={rank} value={rank}>{rank}</MenuItem>))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 1' }}>
                        <InputLabel>Науковий ступінь</InputLabel>
                        <Select name="academicDegree" value={formValues.academicDegree} label="Науковий ступінь" onChange={handleChange}>
                            <MenuItem value=""><em>Немає</em></MenuItem>
                            {ACADEMIC_DEGREES_LIST.map((degree) => (<MenuItem key={degree} value={degree}>{degree}</MenuItem>))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 2' }} error={!!errors.position}>
                        <InputLabel>Посада *</InputLabel>
                        <Select name="position" value={formValues.position} label="Посада" onChange={handleChange} required>
                            {INSTRUCTOR_POSITIONS_LIST.map((pos) => (<MenuItem key={pos} value={pos}>{pos}</MenuItem>))}
                        </Select>
                        {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
                    </FormControl>

                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{ mr: 2 }} onClick={() => navigate('/instructors')}>
                        Скасувати
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        {isEditMode ? 'Зберегти зміни' : 'Створити викладача'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(InstructorFormPage);