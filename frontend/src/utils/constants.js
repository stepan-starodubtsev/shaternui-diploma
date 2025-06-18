
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ROLES = {
    ADMIN: 'ADMIN',
    COMMANDER: 'COMMANDER',
    DEPARTMENT_EMPLOYEE: 'DEPARTMENT_EMPLOYEE',
    INSTRUCTOR: 'INSTRUCTOR'
};

export const RANKS_LIST = [
    {value: 'курсант', label: 'Курсант'},
    {value: 'солдат', label: 'Солдат'},
    {value: 'старший солдат', label: 'Старший солдат'},
    {value: 'молодший сержант', label: 'Молодший сержант'},
    {value: 'сержант', label: 'Сержант'},
    {value: 'старший сержант', label: 'Старший сержант'},
    {value: 'головний сержант', label: 'Головний сержант'},
    {value: 'штаб-сержант', label: 'Штаб-сержант'},
    {value: 'майстер-сержант', label: 'Майстер-сержант'},
    {value: 'старший майстер-сержант', label: 'Старший майстер-сержант'},
    {value: 'головний майстер-сержант', label: 'Головний майстер-сержант'},
    {value: 'прапорщик', label: 'Прапорщик'},
    {value: 'старший прапорщик', label: 'Старший прапорщик'},
    {value: 'молодший лейтенант', label: 'Молодший лейтенант'},
    {value: 'лейтенант', label: 'Лейтенант'},
    {value: 'старший лейтенант', label: 'Старший лейтенант'},
    {value: 'капітан', label: 'Капітан'},
    {value: 'майор', label: 'Майор'},
    {value: 'підполковник', label: 'Підполковник'},
    {value: 'полковник', label: 'Полковник'},
]

export const UserRolesDisplay = [
    {label: 'Адміністратор', value: ROLES.ADMIN },
    {label: 'Командир', value: ROLES.COMMANDER},
    {label: 'Працівник навч. відділу', value: ROLES.DEPARTMENT_EMPLOYEE},
    {label: 'Інструктор', value: ROLES.INSTRUCTOR}
];

export const SessionTypes = [
    {label: 'Тренування', value: 'TRAINING'},
    {label: 'Здача нормативів', value: 'STANDARDS_ASSESSMENT'},
    {label: 'Заняття підрозділу', value: 'UNIT_TRAINING'}
];

export const ScoreTypes = [
    {label: 'Зараховано', value: 'PASSED'},
    {label: 'Відмінно', value: 'EXCELLENT'},
    {label: 'Добре', value: 'GOOD'},
    {label: 'Задовільно', value: 'SATISFACTORY'},
    {label: 'Не зараховано', value: 'FAILED'}
];
