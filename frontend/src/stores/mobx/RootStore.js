import AcademicDisciplineStore from '../AcademicDisciplineStore';
import InstructorStore from '../InstructorStore';
import TrainingGroupStore from '../TrainingGroupStore';
import CadetStore from '../CadetStore';
import LessonStore from '../LessonStore';
import AttendanceStore from '../AttendanceStore';
import UserStore from '../UserStore';
import AuthStore from '../authStore'; // Ми можемо тимчасово використати старий authStore або створити новий для MobX

class RootStore {
    constructor() {
        // Створюємо екземпляри кожного стору
        this.academicDisciplineStore = new AcademicDisciplineStore();
        this.instructorStore = new InstructorStore();
        this.trainingGroupStore = new TrainingGroupStore();
        this.cadetStore = new CadetStore();
        this.lessonStore = new LessonStore();
        this.attendanceStore = new AttendanceStore();
        this.userStore = new UserStore();

        // Стор для автентифікації може бути складнішим і посилатися на інші стори,
        // тому його можна ініціалізувати з посиланням на this (rootStore)
        // this.authStore = new AuthStore(this);
    }
}

export default RootStore;