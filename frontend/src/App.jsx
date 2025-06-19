import React from 'react';
import {Box, CssBaseline, ThemeProvider, CircularProgress} from '@mui/material';
import {Route, Routes, Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ColorModeContext, useMode} from './theme';
import {useStore} from './stores/mobx/storeContext';

import TopBar from './scenes/global/TopBar';
// import Dashboard from './scenes/dashboard';
import LoginPage from './scenes/login_page/LoginPage';

// Імпортуємо всі сторінки для сутностей
import AcademicDisciplineListPage from './scenes/academic-disciplines/AcademicDisciplineListPage';
import AcademicDisciplineFormPage from './scenes/academic-disciplines/AcademicDisciplineFormPage';
import InstructorListPage from './scenes/instructors/InstructorListPage';
import InstructorFormPage from './scenes/instructors/InstructorFormPage';
import EducationalGroupListPage from './scenes/educational-groups/EducationalGroupListPage';
import EducationalGroupFormPage from './scenes/educational-groups/EducationalGroupFormPage';
import CadetListPage from './scenes/cadets/CadetListPage';
import CadetFormPage from './scenes/cadets/CadetFormPage';
import LessonListPage from './scenes/lessons/LessonListPage';
import LessonFormPage from './scenes/lessons/LessonFormPage';
import UserListPage from './scenes/users/UserListPage';
import UserFormPage from './scenes/users/UserFormPage';
import LessonsCalendar from "./scenes/calendar";
import ProfilePage from "./scenes/profile/ProfilePage.jsx";

function App() {
    const [theme, colorMode] = useMode();
    const {authStore} = useStore();

    // Поки йде початкова перевірка токена, показуємо завантажувач
    if (authStore.isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Routes>
                    {authStore.isAuthenticated ? (
                        // Маршрути для залогіненого користувача
                        <Route
                            path="/*"
                            element={
                                <div className="app">
                                    <TopBar/>
                                    <main className="content">
                                        <Routes>
                                            {/*<Route path="/" element={<Dashboard />} />*/}

                                            {/* Маршрути для сутностей */}
                                            <Route path="/academic-disciplines"
                                                   element={<AcademicDisciplineListPage/>}/>
                                            <Route path="/academic-disciplines/new"
                                                   element={<AcademicDisciplineFormPage/>}/>
                                            <Route path="/academic-disciplines/edit/:id"
                                                   element={<AcademicDisciplineFormPage/>}/>

                                            <Route path="/instructors" element={<InstructorListPage/>}/>
                                            <Route path="/instructors/new" element={<InstructorFormPage/>}/>
                                            <Route path="/instructors/edit/:id" element={<InstructorFormPage/>}/>

                                            <Route path="/educational-groups" element={<EducationalGroupListPage/>}/>
                                            <Route path="/educational-groups/new"
                                                   element={<EducationalGroupFormPage/>}/>
                                            <Route path="/educational-groups/edit/:id"
                                                   element={<EducationalGroupFormPage/>}/>

                                            <Route path="/cadets" element={<CadetListPage/>}/>
                                            <Route path="/cadets/new" element={<CadetFormPage/>}/>
                                            <Route path="/cadets/edit/:id" element={<CadetFormPage/>}/>

                                            <Route path="/lessons" element={<LessonListPage/>}/>
                                            <Route path="/lessons/new" element={<LessonFormPage/>}/>
                                            <Route path="/lessons/edit/:id" element={<LessonFormPage/>}/>

                                            <Route path="/users" element={<UserListPage/>}/>
                                            <Route path="/users/new" element={<UserFormPage/>}/>
                                            <Route path="/users/edit/:id" element={<UserFormPage/>}/>

                                            <Route path="/" element={<LessonsCalendar/>}/>
                                            <Route path="/profile" element={<ProfilePage/>}/>

                                            {/* Маршрут, якщо сторінку не знайдено */}
                                            <Route path="*" element={<Navigate to="/" replace/>}/>
                                        </Routes>
                                    </main>
                                </div>
                            }
                        />
                    ) : (
                        // Маршрути для незалогіненого користувача
                        <>
                            <Route path="/login" element={<LoginPage/>}/>
                            {/* Будь-який інший шлях перенаправляє на логін */}
                            <Route path="*" element={<Navigate to="/login" replace/>}/>
                        </>
                    )}
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default observer(App);