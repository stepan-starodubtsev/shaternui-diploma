import {ColorModeContext, useMode} from "./theme.js";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {Navigate, Route, Routes} from "react-router-dom";
import {observer} from 'mobx-react-lite';
import authStore from './stores/authStore';
import {ROLES} from './utils/constants.js';

import Dashboard from "./scenes/dashboard";

import UserListPage from "./scenes/users/UserListPage.jsx";
import UserFormPage from "./scenes/users/UserFormPage.jsx";
import UnitListPage from "./scenes/units/UnitListPage.jsx";
import UnitFormPage from "./scenes/units/UnitFormPage.jsx";
import MilitaryPersonnelListPage from "./scenes/military_personnel/MilitaryPersonnelListPage.jsx";
import MilitaryPersonnelFormPage from "./scenes/military_personnel/MilitaryPersonnelFormPage.jsx";
import ExerciseListPage from "./scenes/exercises/ExerciseListPage.jsx";
import ExerciseFormPage from "./scenes/exercises/ExerciseFormPage.jsx";
import LocationListPage from "./scenes/locations/LocationListPage.jsx";
import LocationFormPage from "./scenes/locations/LocationFormPage.jsx";
import TrainingSessionListPage from "./scenes/training_sessions/TrainingSessionListPage.jsx";
import TrainingSessionFormPage from "./scenes/training_sessions/TrainingSessionFormPage.jsx";
import CalendarPage from "./scenes/calendar";

import ProfileForm from "./scenes/profile/ProfileForm.jsx";
import LoginPage from './scenes/login_page/LoginPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute.jsx';
import NotFoundPage from "./scenes/not_found_page/NotFoundPage.jsx";
import AccessDeniedPage from "./scenes/access_denied_page/AccessDeniedPage.jsx";
import SessionAssessmentsPage from "./scenes/training_sessions/SessionAssessmentsPage.jsx";
import StandardAssessmentListPage from "./scenes/standard_assessments/StandardAssessmentListPage.jsx";
import StandardAssessmentFormPage from "./scenes/standard_assessments/StandardAssessmentFormPage.jsx";

const App = observer(() => {
    const [theme, colorMode] = useMode();


    const allAuthenticatedRoles = Object.values(ROLES);
    const adminOnly = [ROLES.ADMIN];
    const departmentAndAdmin = [ROLES.ADMIN, ROLES.DEPARTMENT_EMPLOYEE];
    const instructorsAndAbove = [ROLES.ADMIN, ROLES.COMMANDER, ROLES.DEPARTMENT_EMPLOYEE, ROLES.INSTRUCTOR];
    const commandersAndAdminDept = [ROLES.ADMIN, ROLES.COMMANDER, ROLES.DEPARTMENT_EMPLOYEE];


    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    <main className="content">
                        <Routes>
                            <Route
                                path="/login"
                                element={!authStore.isAuthenticated ? <LoginPage/> : <Navigate to="/" replace/>}
                            />
                            <Route path="/access-denied" element={<AccessDeniedPage/>}/>

                            <Route element={<ProtectedRoute allowedRoles={allAuthenticatedRoles}/>}>
                                <Route path="/profile" element={<ProfileForm/>}/>
                                <Route path="/" element={<Dashboard/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={adminOnly}/>}>
                                <Route path="/users" element={<UserListPage/>}/>
                                <Route path="/users/create" element={<UserFormPage/>}/>
                                <Route path="/users/edit/:userId" element={<UserFormPage/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={departmentAndAdmin}/>}>
                                <Route path="/units" element={<UnitListPage/>}/>
                                <Route path="/units/create" element={<UnitFormPage/>}/>
                                <Route path="/units/edit/:unitId" element={<UnitFormPage/>}/>

                                <Route path="/exercises" element={<ExerciseListPage/>}/>
                                <Route path="/exercises/create" element={<ExerciseFormPage/>}/>
                                <Route path="/exercises/edit/:exerciseId" element={<ExerciseFormPage/>}/>

                                <Route path="/locations" element={<LocationListPage/>}/>
                                <Route path="/locations/create" element={<LocationFormPage/>}/>
                                <Route path="/locations/edit/:locationId" element={<LocationFormPage/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={commandersAndAdminDept}/>}>
                                <Route path="/military-personnel" element={<MilitaryPersonnelListPage/>}/>
                                <Route path="/military-personnel/create" element={<MilitaryPersonnelFormPage/>}/>
                                <Route path="/military-personnel/edit/:personnelId"
                                       element={<MilitaryPersonnelFormPage/>}/>
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={instructorsAndAbove}/>}>
                                <Route path="/standard-assessments" element={<StandardAssessmentListPage/>}/>
                                <Route path="/standard-assessments/create" element={<StandardAssessmentFormPage/>}/>
                                <Route path="/standard-assessments/edit/:assessmentId"
                                       element={<StandardAssessmentFormPage/>}/>
                            </Route>


                            <Route element={<ProtectedRoute allowedRoles={instructorsAndAbove}/>}>
                                <Route path="/training-sessions" element={<TrainingSessionListPage/>}/>
                                <Route path="/training-sessions/create" element={<TrainingSessionFormPage/>}/>
                                <Route path="/training-sessions/edit/:sessionId" element={<TrainingSessionFormPage/>}/>
                                <Route path="/training-sessions/:sessionId/unit/:unitId/assessments"
                                       element={<SessionAssessmentsPage/>}/> {/* Ваш новий маршрут */}
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={instructorsAndAbove}/>}>
                                <Route path="/calendar" element={<CalendarPage/>}/>
                            </Route>

                            <Route path="*" element={
                                authStore.isAuthenticated
                                    ? <NotFoundPage/>
                                    : <Navigate to="/login" replace/>
                            }/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
});

export default App;