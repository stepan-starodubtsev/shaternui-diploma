import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';

const AcademicDisciplineFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { academicDisciplineStore } = useStore();
    const { disciplines, createItem, updateItem, fetchAll } = academicDisciplineStore;

    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (disciplines.length === 0) {
            fetchAll();
        }
    }, [fetchAll, disciplines.length]);

    useEffect(() => {
        if (isEditMode && disciplines.length > 0) {
            const disciplineToEdit = disciplines.find((d) => d.id === parseInt(id));
            if (disciplineToEdit) {
                setFormValues({
                    name: disciplineToEdit.name,
                    description: disciplineToEdit.description || '',
                });
            }
        }
    }, [id, isEditMode, disciplines]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.name) {
            tempErrors.name = 'Назва є обов\'язковим полем';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditMode) {
                await updateItem(id, formValues);
            } else {
                await createItem(formValues);
            }
            navigate('/academic-disciplines');
        }
    };

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ ДИСЦИПЛІНУ' : 'СТВОРИТИ ДИСЦИПЛІНУ'}
                subtitle={isEditMode ? 'Редагування інформації про дисципліну' : 'Створення нової навчальної дисципліни'}
            />

            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Назва"
                        onChange={handleChange}
                        value={formValues.name}
                        name="name"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ gridColumn: 'span 4' }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="filled"
                        type="text"
                        label="Опис"
                        onChange={handleChange}
                        value={formValues.description}
                        name="description"
                        sx={{ gridColumn: 'span 4' }}
                    />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{ mr: 2 }} onClick={() => navigate('/academic-disciplines')}>
                        Скасувати
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        {isEditMode ? 'Зберегти зміни' : 'Створити дисципліну'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(AcademicDisciplineFormPage);