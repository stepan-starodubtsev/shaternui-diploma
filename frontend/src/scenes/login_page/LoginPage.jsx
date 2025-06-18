import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import authStore from '../../stores/authStore';

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {ROLES} from "../../utils/constants.js";


const LoginPage = observer(() => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            authStore.setError("Email та пароль не можуть бути порожніми.");
            return;
        }
        await authStore.login(email, password);

        if (authStore.isAuthenticated && authStore.user) {
            let destinationLocation;
            if (authStore.user.role === ROLES.ADMIN) {
                destinationLocation = '/';
            } else if (authStore.user.role === ROLES.DEPARTMENT_EMPLOYEE) {
                destinationLocation = '/';
            } else if (authStore.user.role === ROLES.COMMANDER) {
                destinationLocation = '/training-sessions';
            } else if (authStore.user.role === ROLES.INSTRUCTOR) {
                destinationLocation = '/training-sessions';
            } else {
                destinationLocation = '/profile';
            }
            navigate(destinationLocation, {replace: true});
        }
    };

    return (
        <Container component="main"
                   maxWidth={false}
                   sx={{
                       height: '100vh',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                   }}
        >
            <CssBaseline/>
            <Paper
                elevation={8}
                sx={{
                    padding: {xs: 2, sm: 3, md: 4},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '12px',
                    maxWidth: '400px',
                    width: '100%',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{mb: 2}}>
                    Вхід в Систему
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Адреса електронної пошти"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (authStore.error) authStore.setError(null);
                        }}
                        error={!!authStore.error && (authStore.error.toLowerCase().includes("email") || authStore.error.toLowerCase().includes("користувача"))}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (authStore.error) authStore.setError(null);
                        }}
                        error={!!authStore.error && authStore.error.toLowerCase().includes("пароль")}
                    />
                    {authStore.error && (
                        <Alert severity="error" sx={{width: '100%', mt: 2, mb: 1}}>
                            {authStore.error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 3,
                            mb: 2,
                            padding: '10px 0',
                            fontSize: '1rem'
                        }}
                        disabled={authStore.loading}
                    >
                        {authStore.loading ? <CircularProgress size={24} color="inherit"/> : 'Увійти'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
});

export default LoginPage;