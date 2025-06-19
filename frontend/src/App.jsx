import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { StoreContext } from './stores/mobx/storeContext'; // Виправлено шлях
import RootStore from './stores/mobx/RootStore'; // Виправлено шлях

import TopBar from './scenes/global/TopBar';
// import Dashboard from './scenes/dashboard';

// Імпортуємо наші нові сторінки
import AcademicDisciplineListPage from './scenes/academic-disciplines/AcademicDisciplineListPage';
import AcademicDisciplineFormPage from './scenes/academic-disciplines/AcademicDisciplineFormPage';
import EducationalGroupListPage from "./scenes/educational-groups/EducationalGroupListPage.jsx";
import EducationalGroupFormPage from "./scenes/educational-groups/EducationalGroupFormPage.jsx";
import CadetListPage from "./scenes/cadets/CadetListPage.jsx";
import CadetFormPage from "./scenes/cadets/CadetFormPage.jsx";
import InstructorListPage from "./scenes/instructors/InstructorListPage.jsx";
import InstructorFormPage from "./scenes/instructors/InstructorFormPage.jsx";
import LessonListPage from "./scenes/lessons/LessonListPage.jsx";
import LessonFormPage from "./scenes/lessons/LessonFormPage.jsx";
import UserListPage from "./scenes/users/UserListPage.jsx";
import UserFormPage from "./scenes/users/UserFormPage.jsx";

const rootStore = new RootStore();

function App() {
    const [theme, colorMode] = useMode();

    return (
        <StoreContext.Provider value={rootStore}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="app">
                        <main className="content">
                            <TopBar />
                            <Routes>
                                {/*<Route path="/" element={<Dashboard />} />*/}

                                {/* Маршрути для навчальних дисциплін */}
                                <Route path="/academic-disciplines" element={<AcademicDisciplineListPage />} />
                                <Route path="/academic-disciplines/new" element={<AcademicDisciplineFormPage />} />
                                <Route path="/academic-disciplines/edit/:id" element={<AcademicDisciplineFormPage />} />

                                <Route path="/educational-groups" element={<EducationalGroupListPage />} />
                                <Route path="/educational-groups/new" element={<EducationalGroupFormPage />} />
                                <Route path="/educational-groups/edit/:id" element={<EducationalGroupFormPage />} />

                                <Route path="/cadets" element={<CadetListPage />} />
                                <Route path="/cadets/new" element={<CadetFormPage />} />
                                <Route path="/cadets/edit/:id" element={<CadetFormPage />} />
                                {/* Тут будуть маршрути для інших сутностей */}

                                <Route path="/instructors" element={<InstructorListPage />} />
                                <Route path="/instructors/new" element={<InstructorFormPage />} />
                                <Route path="/instructors/edit/:id" element={<InstructorFormPage />} />

                                <Route path="/lessons" element={<LessonListPage />} />
                                <Route path="/lessons/new" element={<LessonFormPage />} />
                                <Route path="/lessons/edit/:id" element={<LessonFormPage />} />

                                <Route path="/users" element={<UserListPage />} />
                                <Route path="/users/new" element={<UserFormPage />} />
                                <Route path="/users/edit/:id" element={<UserFormPage />} />
                            </Routes>
                        </main>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </StoreContext.Provider>
    );
}

export default observer(App);