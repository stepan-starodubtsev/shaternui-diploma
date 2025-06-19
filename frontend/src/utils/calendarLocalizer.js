import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import uk from 'date-fns/locale/uk';

const locales = {
    'uk-UA': uk,
};

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Початок тижня з понеділка
    getDay,
    locales,
});