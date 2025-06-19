import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Typography,
    Divider,
    Paper,
    CircularProgress
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns';

import {useStore} from '../../stores/mobx/storeContext';
import Header from '../../components/Header';
import {ATTENDANCE_STATUSES_LIST} from '../../utils/constants';

const LessonFormPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {lessonStore, academicDisciplineStore, instructorStore, educationalGroupStore, attendanceStore} = useStore();

    // Стан для полів основної форми
    const [formValues, setFormValues] = useState({
        name: '',
        location: '',
        startTime: '',
        endTime: '',
        academicDisciplineId: '',
        instructorId: '',
        educationalGroupId: '',
    });

    // Окремий стан для записів відвідуваності, які редагуються
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    // Прапорець, що визначає, чи можна редагувати відвідуваність
    const [isLessonActive, setIsLessonActive] = useState(false);
    // Стан для помилок валідації
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const isEditMode = Boolean(id);
    // Ефект для завантаження всіх необхідних даних
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            const promises = [
                academicDisciplineStore.fetchAll(),
                instructorStore.fetchAll(),
                educationalGroupStore.fetchAll(),
            ];
            if (isEditMode) {
                promises.push(lessonStore.fetchAll());
            }
            await Promise.all(promises);
            setIsLoading(false);
        };
        loadAllData();
    }, [isEditMode, lessonStore, academicDisciplineStore, instructorStore, educationalGroupStore]);

    // Ефект для заповнення форми в режимі редагування
    useEffect(() => {
        if (isEditMode && lessonStore.lessons.length > 0) {
            const itemToEdit = lessonStore.lessons.find((item) => item.id === parseInt(id));
            if (itemToEdit) {
                // Заповнюємо основні поля
                setFormValues({
                    name: itemToEdit.name,
                    location: itemToEdit.location,
                    startTime: format(new Date(itemToEdit.startTime), "yyyy-MM-dd'T'HH:mm"),
                    endTime: format(new Date(itemToEdit.endTime), "yyyy-MM-dd'T'HH:mm"),
                    academicDisciplineId: itemToEdit.academicDisciplineId || '',
                    instructorId: itemToEdit.instructorId || '',
                    educationalGroupId: itemToEdit.educationalGroupId || '',
                });

                // Заповнюємо дані по відвідуваності
                setAttendanceRecords(itemToEdit.attendances || []);

                // Визначаємо, чи активне заняття для редагування
                const now = new Date();
                const startTime = new Date(itemToEdit.startTime);
                const endTime = new Date(itemToEdit.endTime);
                setIsLessonActive(now >= startTime && now <= endTime);
            }
        }
    }, [id, isEditMode, lessonStore.lessons]);

    // Функція валідації форми
    const validate = () => {
        const tempErrors = {};
        if (!formValues.name) tempErrors.name = 'Назва є обов\'язковим полем';
        if (!formValues.location) tempErrors.location = 'Місце є обов\'язковим полем';
        if (!formValues.startTime) tempErrors.startTime = 'Час початку є обов\'язковим';
        if (!formValues.endTime) tempErrors.endTime = 'Час кінця є обов\'язковим';
        if (formValues.startTime && formValues.endTime && formValues.startTime >= formValues.endTime) {
            tempErrors.endTime = 'Час кінця має бути пізніше часу початку';
        }
        if (!formValues.academicDisciplineId) tempErrors.academicDisciplineId = 'Оберіть дисципліну';
        if (!formValues.instructorId) tempErrors.instructorId = 'Оберіть викладача';
        if (!formValues.educationalGroupId) tempErrors.educationalGroupId = 'Оберіть групу';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Обробник зміни для звичайних полів
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    // Обробник зміни статусу відвідуваності
    const handleAttendanceChange = (attendanceId, newStatus) => {
        setAttendanceRecords(prevRecords =>
            prevRecords.map(record =>
                record.id === attendanceId ? {...record, status: newStatus} : record
            )
        );
    };

    // Обробник відправки форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditMode) {
                // Створюємо масив промісів для паралельного виконання
                const promises = [];
                // 1. Проміс для оновлення даних заняття
                promises.push(lessonStore.updateItem(id, formValues));
                // 2. Проміс для оновлення статусів відвідуваності
                if (attendanceRecords.length > 0) {
                    const updates = attendanceRecords.map(({id, status}) => ({id, status}));
                    promises.push(attendanceStore.saveAttendances(updates));
                }
                await Promise.all(promises);
            } else {
                await lessonStore.createItem(formValues);
            }
            navigate('/lessons');
        }
    };

    if (isLoading && isEditMode) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>;
    }

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ ЗАНЯТТЯ' : 'СТВОРИТИ ЗАНЯТТЯ'}
                subtitle="Планування заняття та призначення ресурсів"
            />
            <form onSubmit={handleSubmit}>
                {/* --- БЛОК ОСНОВНИХ ДАНИХ ЗАНЯТТЯ --- */}
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                    <TextField fullWidth variant="filled" type="text" label="Назва заняття" onChange={handleChange}
                               value={formValues.name} name="name" error={!!errors.name} helperText={errors.name}
                               sx={{gridColumn: 'span 2'}}/>
                    <TextField fullWidth variant="filled" type="text" label="Місце проведення" onChange={handleChange}
                               value={formValues.location} name="location" error={!!errors.location}
                               helperText={errors.location} sx={{gridColumn: 'span 2'}}/>
                    <TextField fullWidth variant="filled" type="datetime-local" label="Час початку"
                               onChange={handleChange} value={formValues.startTime} name="startTime"
                               error={!!errors.startTime} helperText={errors.startTime} sx={{gridColumn: 'span 2'}}
                               InputLabelProps={{shrink: true}}/>
                    <TextField fullWidth variant="filled" type="datetime-local" label="Час кінця"
                               onChange={handleChange} value={formValues.endTime} name="endTime"
                               error={!!errors.endTime} helperText={errors.endTime} sx={{gridColumn: 'span 2'}}
                               InputLabelProps={{shrink: true}}/>
                    <FormControl fullWidth variant="filled" sx={{gridColumn: 'span 4'}}
                                 error={!!errors.academicDisciplineId}>
                        <InputLabel>Навчальна дисципліна</InputLabel>
                        <Select name="academicDisciplineId" value={formValues.academicDisciplineId}
                                label="Навчальна дисципліна" onChange={handleChange}>
                            {academicDisciplineStore.disciplines.map((d) => (
                                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>))}
                        </Select>
                        <FormHelperText>{errors.academicDisciplineId}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth variant="filled" sx={{gridColumn: 'span 2'}} error={!!errors.instructorId}>
                        <InputLabel>Викладач</InputLabel>
                        <Select name="instructorId" value={formValues.instructorId} label="Викладач"
                                onChange={handleChange}>
                            {instructorStore.instructors.map((i) => (
                                <MenuItem key={i.id} value={i.id}>{i.fullName}</MenuItem>))}
                        </Select>
                        <FormHelperText>{errors.instructorId}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth variant="filled" sx={{gridColumn: 'span 2'}}
                                 error={!!errors.educationalGroupId}>
                        <InputLabel>Навчальна група</InputLabel>
                        <Select name="educationalGroupId" value={formValues.educationalGroupId} label="Навчальна група"
                                onChange={handleChange}>
                            {educationalGroupStore.groups.map((g) => (
                                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>))}
                        </Select>
                        <FormHelperText>{errors.educationalGroupId}</FormHelperText>
                    </FormControl>
                </Box>

                {/* --- БЛОК ВІДВІДУВАНОСТІ (тільки в режимі редагування) --- */}
                {isEditMode && attendanceRecords.length > 0 && (
                    <Paper elevation={2} sx={{p: 2, mt: 4}}>
                        <Typography variant="h4" mb={2}>Відвідуваність</Typography>
                        {!isLessonActive && (
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Редагування відвідуваності доступне тільки під час проведення заняття.
                            </Typography>
                        )}
                        <Divider sx={{mb: 2}}/>
                        <Box>
                            {attendanceRecords.map((record) => (
                                <Box key={record.id} display="flex" alignItems="center" justifyContent="space-between"
                                     mb={2}>
                                    <Typography>{record.cadet?.fullName || 'Невідомий курсант'}</Typography>
                                    <FormControl sx={{minWidth: 180}} size="small">
                                        <InputLabel>Статус</InputLabel>
                                        <Select
                                            value={record.status}
                                            label="Статус"
                                            disabled={!isLessonActive}
                                            onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
                                        >
                                            {ATTENDANCE_STATUSES_LIST.map(status => (
                                                <MenuItem key={status} value={status}>{status}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                {/* --- КНОПКИ ДІЙ --- */}
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{mr: 2}}
                            onClick={() => navigate('/lessons')}>Скасувати</Button>
                    <Button type="submit" color="secondary"
                            variant="contained">{isEditMode ? 'Зберегти зміни' : 'Створити заняття'}</Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(LessonFormPage);