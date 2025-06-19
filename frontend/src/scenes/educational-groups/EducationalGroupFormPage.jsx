import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Autocomplete, Checkbox, CircularProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores/mobx/storeContext';
import Header from '../../components/Header';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EducationalGroupFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { educationalGroupStore, cadetStore } = useStore();

    const [formValues, setFormValues] = useState({
        name: '',
        cadetIds: [], // Масив ID обраних курсантів
    });
    const [selectedCadets, setSelectedCadets] = useState([]); // Масив об'єктів обраних курсантів
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);

    useEffect(() => {
        // Завантажуємо дані, якщо вони ще не завантажені
        if (educationalGroupStore.groups.length === 0) {
            educationalGroupStore.fetchAll();
        }
        if (cadetStore.cadets.length === 0) {
            cadetStore.fetchAll();
        }
    }, [educationalGroupStore, cadetStore]);

    useEffect(() => {
        if (isEditMode && educationalGroupStore.groups.length > 0 && cadetStore.cadets.length > 0) {
            const groupToEdit = educationalGroupStore.groups.find((item) => item.id === parseInt(id));
            if (groupToEdit) {
                const initialCadets = groupToEdit.cadets || [];
                setFormValues({
                    name: groupToEdit.name,
                    cadetIds: initialCadets.map(c => c.id),
                });
                setSelectedCadets(initialCadets);
            }
        }
    }, [id, isEditMode, educationalGroupStore.groups, cadetStore.cadets]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.name) {
            tempErrors.name = 'Назва групи є обов\'язковим полем';
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

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedCadets(newValue);
        setFormValues({
            ...formValues,
            cadetIds: newValue.map(c => c.id),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEditMode) {
                await educationalGroupStore.updateItem(id, formValues);
            } else {
                await educationalGroupStore.createItem(formValues);
            }
            navigate('/educational-groups');
        }
    };

    // Показуємо завантаження, якщо основні дані ще не готові
    if (cadetStore.isLoading || (isEditMode && educationalGroupStore.isLoading)) {
        return <CircularProgress />;
    }

    return (
        <Box m="20px">
            <Header
                title={isEditMode ? 'РЕДАГУВАТИ НАВЧАЛЬНУ ГРУПУ' : 'СТВОРИТИ НАВЧАЛЬНУ ГРУПУ'}
                subtitle="Керування складом та назвою групи"
            />

            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Назва групи"
                        onChange={handleChange}
                        value={formValues.name}
                        name="name"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ gridColumn: 'span 4' }}
                    />

                    <Autocomplete
                        multiple
                        id="cadets-autocomplete"
                        options={cadetStore.cadets}
                        disableCloseOnSelect
                        value={selectedCadets}
                        onChange={handleAutocompleteChange}
                        getOptionLabel={(option) => `${option.fullName} (${option.rank})`}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {`${option.fullName} (${option.rank})`}
                            </li>
                        )}
                        sx={{ gridColumn: 'span 4' }}
                        renderInput={(params) => (
                            <TextField {...params} label="Додати курсантів до групи" placeholder="Пошук..." />
                        )}
                    />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="button" color="secondary" variant="contained" sx={{ mr: 2 }} onClick={() => navigate('/educational-groups')}>
                        Скасувати
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        {isEditMode ? 'Зберегти зміни' : 'Створити групу'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default observer(EducationalGroupFormPage);