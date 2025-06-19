import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import { tokens } from '../../theme';

const LoginPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { authStore } = useStore();

    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.email) tempErrors.email = 'Email є обов\'язковим';
        if (!formValues.password) tempErrors.password = 'Пароль є обов\'язковим';
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
            setIsSubmitting(true);
            try {
                await authStore.login(formValues);
                navigate('/');
            } catch (error) {
                setErrors({ submit: 'Неправильний Email або пароль' });
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh"
             sx={{ background: `linear-gradient(135deg, ${colors.primary[800]} 0%, ${colors.primary[600]} 100%)` }}
        >
            <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h2" align="center" mb={4}>Вхід</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        value={formValues.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        value={formValues.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ mb: 4 }}
                    />
                    {errors.submit && (
                        <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                            {errors.submit}
                        </Typography>
                    )}
                    <Button color="secondary" variant="contained" fullWidth type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Вхід...' : 'Увійти'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default observer(LoginPage);