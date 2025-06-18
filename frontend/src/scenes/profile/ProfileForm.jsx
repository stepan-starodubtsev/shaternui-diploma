import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
    useTheme,
    CircularProgress,
    Grid, Paper
} from "@mui/material";
import {observer} from "mobx-react-lite";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOnIcon from '@mui/icons-material/Visibility';
import {tokens} from "../../theme.js";
import Header from "../../components/Header.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useError from "../../utils/useError.js";
import TopBar from "../global/TopBar.jsx";
import {authStore} from "../../stores/authStore.js";
import userStore from "../../stores/userStore.js";
import {UserRolesDisplay} from "../../utils/constants.js";

const ProfileForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (authStore.user) {
            setProfileData({
                first_name: authStore.user.first_name || '',
                last_name: authStore.user.last_name || '',
                email: authStore.user.email || '',
                password: '',
                role: authStore.user.role || '',
                unit_id: authStore.user.unit_id || '',
            });
        }
    }, [authStore.user]);

    useError(userStore);

    const handleChange = (e) => {
        setProfileData({...profileData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setFormError('');

        const dataToUpdate = {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
        };

        if (profileData.password) {
            dataToUpdate.password = profileData.password;
        }

        try {
            await authStore.updateUser(dataToUpdate);
            alert('Профіль успішно оновлено!');
        } catch (error) {
            setFormError(userStore.error || "Помилка оновлення профілю");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateForm = () => {
        if (!profileData.first_name.trim() || !profileData.last_name.trim() || !profileData.email.trim()) {
            setFormError("Ім'я, прізвище та email є обов'язковими.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            setFormError("Некоректний формат email.");
            return false;
        }
        if (profileData.password && profileData.password.length < 6) {
            setFormError("Пароль має містити щонайменше 6 символів.");
            return false;
        }
        setFormError('');
        return true;
    };

    const userRoleLabel = UserRolesDisplay.find(r => r.value === profileData.role)?.label || profileData.role;

    return (
        <Box m={"20px"}>
            <TopBar headerBox={
                <Header title={`ОСОБИСТИЙ КАБІНЕТ`} subtitle={"Редагування даних профілю"}/>
            }/>
            <Box component={Paper} p={3} elevation={3}>
                <Stack component="form" onSubmit={handleSubmit} spacing={3}
                       sx={{
                           '& label.Mui-focused': {
                               color: theme.palette.mode === 'dark' ? colors.grey[200] : theme.palette.primary.main,
                           },
                           '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                               borderColor: theme.palette.mode === 'dark' ? colors.grey[200] : theme.palette.primary.main,
                           },
                       }}>
                    <Grid container spacing={2}>
                        <Grid item size={6}>
                            <TextField
                                label="Прізвище"
                                name="last_name"
                                value={profileData.last_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Ім'я"
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Роль"
                                name="role"
                                value={userRoleLabel}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item size={6}>
                            <FormControl sx={{width: '100%'}} variant="outlined" disabled={isLoading}>
                                <InputLabel htmlFor="password">Новий Пароль (залиште порожнім, щоб не
                                    змінювати)</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    label="Новий Пароль (залиште порожнім, щоб не змінювати)"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    name="password"
                                    sx={{width: '100%'}}
                                    type={showPassword ? 'text' : 'password'}
                                    value={profileData.password}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon/> : <VisibilityOnIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    {formError && <Typography color="error" sx={{mt: 2}}>{formError}</Typography>}
                    {userStore.error && <Typography color="error" sx={{mt: 1}}>{userStore.error}</Typography>}

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={isLoading || userStore.loading}
                        >
                            {isLoading || userStore.loading ? <CircularProgress size={24}/> : "Зберегти Зміни"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default observer(ProfileForm);