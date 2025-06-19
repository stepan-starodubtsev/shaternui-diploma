import React, { useEffect, useState, useMemo } from 'react';
import { Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userStore, instructorStore } = useStore();

    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        role: 'INSTRUCTOR',
        instructorId: '',
    });
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && userStore.users.length === 0) userStore.fetchAll();
        if (instructorStore.instructors.length === 0) instructorStore.fetchAll();
    }, [userStore, instructorStore, isEditMode]);

    // Фільтруємо викладачів, які ще не прив'язані до акаунтів
    const availableInstructors = useMemo(() => {
        const linkedInstructorIds = userStore.users
            .map(user => user.instructorId)
            .filter(id => id !== null);

        return instructorStore.instructors.filter(
            instructor => !linkedInstructorIds.includes(instructor.id)
        );
    }, [userStore.users, instructorStore.instructors]);

    useEffect(() => {
        if (isEditMode && userStore.users.length > 0) {
            const itemToEdit = userStore.users.find((item) => item.id === parseInt(id));
            if (itemToEdit) {
                setFormValues({
                    username: itemToEdit.username,
                    email: itemToEdit.email || '',
                    password: '', // Пароль не заповнюємо для безпеки
                    role: itemToEdit.role,
                    instructorId: itemToEdit.instructorId || '',
                });
            }
        }
    }, [id, isEditMode, userStore.users]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.username) tempErrors.username = 'Логін є обов\'язковим';
        if (!isEditMode && !formValues.password) {
            tempErrors.password = 'Пароль є обов\'язковим при створенні';
        }
        if (formValues.role === 'INSTRUCTOR' && !formValues.instructorId) {
            tempErrors.instructorId = 'Для ролі INSTRUCTOR потрібно обрати викладача';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const dataToSend = { ...formValues };
            // Не надсилаємо порожній пароль при редагуванні
            if (isEditMode && !dataToSend.password) {
                delete dataToSend.password;
            }
            // Встановлюємо instructorId в null, якщо роль не INSTRUCTOR
            if (dataToSend.role !== 'INSTRUCTOR') {
                dataToSend.instructorId = null;
            }
            if (isEditMode) {
                await userStore.updateItem(id, dataToSend);
            } else {
                await userStore.createItem(dataToSend);
            }
            navigate('/users');
        }
    };

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ КОРИСТУВАЧА' : 'СТВОРИТИ КОРИСТУВАЧА'}
                subtitle={isEditMode ? 'Редагування акаунту користувача' : 'Створення нового акаунту'}
            />
            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                    <TextField fullWidth variant="filled" type="text" label="Логін" onChange={handleChange} value={formValues.username} name="username" error={!!errors.username} helperText={errors.username} sx={{ gridColumn: 'span 2' }} />
                    <TextField fullWidth variant="filled" type="email" label="Email" onChange={handleChange} value={formValues.email} name="email" sx={{ gridColumn: 'span 2' }} />
                    <TextField fullWidth variant="filled" type="password" label="Пароль" onChange={handleChange} value={formValues.password} name="password" error={!!errors.password} helperText={errors.password || (isEditMode && "Залиште порожнім, щоб не змінювати")} sx={{ gridColumn: 'span 4' }} />

                    <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 2' }}>
                        <InputLabel>Роль</InputLabel>
                        <Select name="role" value={formValues.role} label="Роль" onChange={handleChange}>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="INSTRUCTOR">INSTRUCTOR</MenuItem>
                        </Select>
                    </FormControl>

                    {formValues.role === 'INSTRUCTOR' && (
                        <FormControl fullWidth variant="filled" sx={{ gridColumn: 'span 2' }} error={!!errors.instructorId}>
                            <InputLabel>Прив'язати викладача</InputLabel>
                            <Select name="instructorId" value={formValues.instructorId} label="Прив'язати викладача" onChange={handleChange}>
                                <MenuItem value=""><em>Не обрано</em></MenuItem>
                                {isEditMode && formValues.instructorId && (
                                    <MenuItem key={formValues.instructorId} value={formValues.instructorId}>
                                        {instructorStore.instructors.find(i => i.id === formValues.instructorId)?.fullName || ''}
                                    </MenuItem>
                                )}
                                {availableInstructors.map((i) => (
                                    <MenuItem key={i.id} value={i.id}>{i.fullName}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.instructorId}</FormHelperText>
                        </FormControl>
                    )}
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{ mr: 2 }} onClick={() => navigate('/users')}>Скасувати</Button>
                    <Button type="submit" color="secondary" variant="contained">{isEditMode ? 'Зберегти зміни' : 'Створити користувача'}</Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(UserFormPage);