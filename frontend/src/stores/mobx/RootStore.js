import AcademicDisciplineStore from '../AcademicDisciplineStore';
import InstructorStore from '../InstructorStore';
import EducationalGroupStore from '../EducationalGroupStore';
import CadetStore from '../CadetStore';
import LessonStore from '../LessonStore';
import AttendanceStore from '../AttendanceStore';
import UserStore from '../UserStore';
import AuthStore from '../AuthStore.js'; // Ми можемо тимчасово використати старий authStore або створити новий для MobX

class RootStore {
    constructor() {
        // Створюємо екземпляри кожного стору
        this.academicDisciplineStore = new AcademicDisciplineStore();
        this.instructorStore = new InstructorStore();
        this.educationalGroupStore = new EducationalGroupStore();
        this.cadetStore = new CadetStore();
        this.lessonStore = new LessonStore();
        this.attendanceStore = new AttendanceStore();
        this.userStore = new UserStore();
        this.authStore = new AuthStore(this);
    }
}

export default RootStore;