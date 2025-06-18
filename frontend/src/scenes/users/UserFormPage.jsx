import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    Grid,
    Stack,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOnIcon from '@mui/icons-material/Visibility';
import Header from "../../components/Header.jsx";
import TopBar from "../global/TopBar.jsx";
import userStore from "../../stores/userStore.js";
import unitStore from "../../stores/unitStore.js";
import useError from "../../utils/useError.js";
import {UserRolesDisplay} from "../../utils/constants.js";

const UserFormPage = () => {
    const theme = useTheme();
    const {userId} = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        password: '',
        unit_id: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const areRelatedStoresLoading = unitStore.loading;

    useEffect(() => {
        if (unitStore.units.length === 0 && !unitStore.loading) {
            unitStore.loadUnits();
        }
        if (userId) {
            setIsLoading(true);
            userStore.loadUserById(userId).then((data) => {
                if (data) {
                    setUser({...data, password: ''});
                } else {
                    setFormError("Не вдалося завантажити дані користувача.");
                }
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        } else {
            setUser({first_name: '', last_name: '', email: '', role: '', password: '', unit_id: ''});
            userStore.clearSelectedUser();
        }
        setFormError('');
    }, [userId]);

    useError(userStore);
    useError(unitStore);

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateForm = () => {
        if (!user.first_name.trim() || !user.last_name.trim() || !user.email.trim() || !user.role) {
            setFormError("Ім'я, прізвище, email та роль є обов'язковими.");
            return false;
        }
        if (!userId && !user.password) {
            setFormError("Пароль є обов'язковим при створенні користувача.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setFormError("Некоректний формат email.");
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
        const dataToSubmit = {...user};
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }
        if (dataToSubmit.unit_id === '' || dataToSubmit.unit_id === null) {
            dataToSubmit.unit_id = null;
        } else {
            dataToSubmit.unit_id = parseInt(dataToSubmit.unit_id);
        }


        try {
            if (userId) {
                await userStore.updateUser(userId, dataToSubmit);
            } else {
                await userStore.addUser(dataToSubmit);
            }
            navigate('/users');
        } catch (error) {
            setFormError(userStore.error || "Помилка збереження користувача");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && userId && !userStore.selectedUser) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress/>
                <Typography sx={{ml: 2}}>Завантаження даних користувача...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{m: "20px"}}>
            <TopBar headerBox={
                <Header
                    title={userId ? `Редагувати Користувача №${user.last_name || userId}` : "Створити Нового Користувача"}
                    subtitle={userId ? "Оновлення даних облікового запису" : "Створення нового облікового запису"}
                />
            }/>
            <Box>
                <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{mt: 2}}>
                    <Grid container spacing={2}>
                        <Grid item size={4}>
                            <TextField label="Прізвище" name="last_name" value={user.last_name} onChange={handleChange}
                                       fullWidth required disabled={isLoading}/>
                        </Grid>
                        <Grid item size={4}>
                            <TextField label="Ім'я" name="first_name" value={user.first_name} onChange={handleChange}
                                       fullWidth required disabled={isLoading}/>
                        </Grid>
                        <Grid item size={4}>
                            <TextField label="Email" name="email" type="email" value={user.email}
                                       onChange={handleChange} fullWidth required disabled={isLoading}/>
                        </Grid>
                        <Grid item size={4}>
                            <TextField label="Роль" name="role" value={user.role || ''} onChange={handleChange}
                                       fullWidth select required disabled={isLoading}>
                                <MenuItem value=""><em>Оберіть роль</em></MenuItem>
                                {UserRolesDisplay.map((roleOption) => (
                                    <MenuItem key={roleOption.value} value={roleOption.value}>
                                        {roleOption.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item size={4}>
                            <FormControl fullWidth variant="outlined" disabled={isLoading}>
                                <InputLabel
                                    htmlFor="password">Пароль {userId ? '(залиште порожнім, щоб не змінювати)' : ''}</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    label={`Пароль ${userId ? '(залиште порожнім, щоб не змінювати)' : ''}`}
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={user.password}
                                    onChange={handleChange}
                                    required={!userId}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility"
                                                        onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOffIcon/> : <VisibilityOnIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item size={4}>
                            <TextField
                                label="Підрозділ (опціонально)"
                                name="unit_id"
                                value={user.unit_id || ''}
                                onChange={handleChange}
                                fullWidth
                                select
                                disabled={isLoading || areRelatedStoresLoading}
                            >
                                <MenuItem value=""><em>Не призначено</em></MenuItem>
                                {unitStore.units.map((unit) => (
                                    <MenuItem key={unit.unit_id} value={unit.unit_id}>
                                        {unit.unit_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    {formError && <Typography color="error" sx={{mt: 1}}>{formError}</Typography>}
                    {userStore.error && <Typography color="error" sx={{mt: 1}}>{userStore.error}</Typography>}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button type="submit" variant="contained" color="secondary"
                                disabled={isLoading || userStore.loading || areRelatedStoresLoading}>
                            {isLoading || userStore.loading ?
                                <CircularProgress size={24}/> : (userId ? "Зберегти Зміни" : "Створити Користувача")}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default observer(UserFormPage);