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
        cadetIds: [],
    });
    // 'selectedCadets' тепер єдине джерело правди для значення Autocomplete
    const [selectedCadets, setSelectedCadets] = useState([]);
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(id);
    const groupId = isEditMode ? parseInt(id) : null;

    useEffect(() => {
        if (educationalGroupStore.groups.length === 0) {
            educationalGroupStore.fetchAll();
        }
        if (cadetStore.cadets.length === 0) {
            cadetStore.fetchAll();
        }
    }, [educationalGroupStore, cadetStore]);

    useEffect(() => {
        if (isEditMode && educationalGroupStore.groups.length > 0) {
            const groupToEdit = educationalGroupStore.groups.find((item) => item.id === groupId);
            if (groupToEdit) {
                const initialCadets = groupToEdit.cadets || [];
                setFormValues(prev => ({ ...prev, name: groupToEdit.name }));
                // Встановлюємо початково вибраних курсантів безпосередньо
                setSelectedCadets(initialCadets);
            }
        }
    }, [id, isEditMode, educationalGroupStore.groups, groupId]);

    const validate = () => {
        const tempErrors = {};
        if (!formValues.name) tempErrors.name = 'Назва групи є обов\'язковим полем';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleAutocompleteChange = (event, newValue) => {
        // Просто оновлюємо масив вибраних курсантів
        setSelectedCadets(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Синхронізуємо ID перед відправкою
        const finalFormValues = {
            ...formValues,
            cadetIds: selectedCadets.map(c => c.id),
        };

        if (validate()) {
            if (isEditMode) {
                await educationalGroupStore.updateItem(id, finalFormValues);
            } else {
                await educationalGroupStore.createItem(finalFormValues);
            }
            navigate('/educational-groups');
        }
    };

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
                        // ВИПРАВЛЕНО: Передаємо всіх курсантів
                        options={cadetStore.cadets}
                        // ВИПРАВЛЕНО: Використовуємо getOptionDisabled для блокування зайнятих
                        getOptionDisabled={(option) =>
                            option.educationalGroupId !== null && option.educationalGroupId !== groupId
                        }
                        disableCloseOnSelect
                        value={selectedCadets}
                        onChange={handleAutocompleteChange}
                        getOptionLabel={(option) => `${option.fullName} (${option.rank})`}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option, { selected }) => {
                            const { key, ...liProps } = props;
                            return (
                                <li key={key} {...liProps}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.fullName}
                                </li>
                            );
                        }}
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