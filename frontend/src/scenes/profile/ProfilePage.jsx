import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';

const ProfilePage = () => {
    const { authStore, userStore } = useStore();
    const currentUser = authStore.user;

    const [formValues, setFormValues] = useState({
        email: currentUser.email || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validate = () => {
        const tempErrors = {};
        if (formValues.newPassword || formValues.oldPassword || formValues.confirmPassword) {
            if (!formValues.oldPassword) tempErrors.oldPassword = "Введіть поточний пароль";
            if (formValues.newPassword.length < 6) tempErrors.newPassword = "Пароль має бути не менше 6 символів";
            if (formValues.newPassword !== formValues.confirmPassword) tempErrors.confirmPassword = "Паролі не співпадають";
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
        setSuccessMessage('');
        if (validate()) {
            try {
                // Оновлення email, якщо він змінився
                if (formValues.email !== currentUser.email) {
                    await userStore.updateItem(currentUser.id, { email: formValues.email });
                    // Оновлюємо дані користувача в authStore
                    await authStore.fetchMe();
                }
                // Оновлення паролю, якщо введено новий
                if (formValues.newPassword) {
                    await userStore.updateMyPassword({
                        oldPassword: formValues.oldPassword,
                        newPassword: formValues.newPassword,
                    });
                }
                setSuccessMessage('Дані успішно оновлено!');
            } catch (error) {
                setErrors({ submit: error.response?.data?.message || 'Помилка оновлення' });
            }
        }
    };

    return (
        <Box m="20px">
            <Header title="ПРОФІЛЬ" subtitle="Керування вашим акаунтом" />
            <Paper elevation={3} sx={{ p: 3, maxWidth: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h5" mb={2}>Основні дані</Typography>
                    <TextField fullWidth variant="filled" type="text" label="Логін" name="username" value={currentUser.username} disabled sx={{ mb: 2 }} />
                    <TextField fullWidth variant="filled" type="email" label="Email" onChange={handleChange} value={formValues.email} name="email" sx={{ mb: 4 }} />

                    <Typography variant="h5" mb={2}>Зміна паролю</Typography>
                    <TextField fullWidth variant="filled" type="password" label="Поточний пароль" onChange={handleChange} value={formValues.oldPassword} name="oldPassword" error={!!errors.oldPassword} helperText={errors.oldPassword} sx={{ mb: 2 }} />
                    <TextField fullWidth variant="filled" type="password" label="Новий пароль" onChange={handleChange} value={formValues.newPassword} name="newPassword" error={!!errors.newPassword} helperText={errors.newPassword} sx={{ mb: 2 }} />
                    <TextField fullWidth variant="filled" type="password" label="Підтвердіть новий пароль" onChange={handleChange} value={formValues.confirmPassword} name="confirmPassword" error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={{ mb: 2 }} />

                    {errors.submit && <Typography color="error" variant="body2">{errors.submit}</Typography>}
                    {successMessage && <Typography color="secondary.main" variant="body2">{successMessage}</Typography>}

                    <Box display="flex" justifyContent="end" mt={2}>
                        <Button type="submit" color="secondary" variant="contained">
                            Зберегти зміни
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default observer(ProfilePage);