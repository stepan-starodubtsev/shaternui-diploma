const Sequelize = require('sequelize');
const sequelize = require('../config/settingsDB');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.User = require('./User.model.js');
db.Unit = require('./Unit.model.js');
db.MilitaryPersonnel = require('./militaryPersonnel.model.js');
db.Exercise = require('./exercise.model.js');
db.Location = require('./location.model.js');
db.TrainingSession = require('./trainingSession.model.js');
db.SessionExercise = require('./sessionExercise.model.js');
db.StandardAssessment = require('./standardAssessment.model.js');


// User <-> Unit (One-to-Many)
db.Unit.hasMany(db.User, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'users' });
db.User.belongsTo(db.Unit, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'unit' });

// Unit <-> MilitaryPersonnel (One-to-Many)
db.Unit.hasMany(db.MilitaryPersonnel, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'militaryPersonnel' });
db.MilitaryPersonnel.belongsTo(db.Unit, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'unit' });

// User (Conductor) <-> TrainingSession (One-to-Many)
db.User.hasMany(db.TrainingSession, { foreignKey: { name: 'conductedByUserId', field: 'conducted_by_user_id' }, as: 'conductedTrainingSessions' });
db.TrainingSession.belongsTo(db.User, { foreignKey: { name: 'conductedByUserId', field: 'conducted_by_user_id' }, as: 'conductor' });

// Location <-> TrainingSession (One-to-Many)
db.Location.hasMany(db.TrainingSession, { foreignKey: { name: 'locationId', field: 'location_id' }, as: 'trainingSessions' });
db.TrainingSession.belongsTo(db.Location, { foreignKey: { name: 'locationId', field: 'location_id' }, as: 'location' });

// Unit <-> TrainingSession (One-to-Many)
db.Unit.hasMany(db.TrainingSession, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'trainingSessions' });
db.TrainingSession.belongsTo(db.Unit, { foreignKey: { name: 'unitId', field: 'unit_id' }, as: 'unit' });

// TrainingSession <-> Exercise (Many-to-Many through SessionExercise)
db.TrainingSession.belongsToMany(db.Exercise, {
    through: db.SessionExercise,
    foreignKey: { name: 'sessionId', field: 'session_id' },
    otherKey: { name: 'exerciseId', field: 'exercise_id' },
    as: 'exercises'
});
db.Exercise.belongsToMany(db.TrainingSession, {
    through: db.SessionExercise,
    foreignKey: { name: 'exerciseId', field: 'exercise_id' },
    otherKey: { name: 'sessionId', field: 'session_id' },
    as: 'trainingSessions'
});

db.TrainingSession.hasMany(db.SessionExercise, { foreignKey: { name: 'sessionId', field: 'session_id' }, as: 'sessionExerciseEntries' });
db.SessionExercise.belongsTo(db.TrainingSession, { foreignKey: { name: 'sessionId', field: 'session_id' }, as: 'trainingSession' });

db.Exercise.hasMany(db.SessionExercise, { foreignKey: { name: 'exerciseId', field: 'exercise_id' }, as: 'sessionExerciseLinks' });
db.SessionExercise.belongsTo(db.Exercise, { foreignKey: { name: 'exerciseId', field: 'exercise_id' }, as: 'exercise' });


// TrainingSession <-> StandardAssessment (One-to-Many)
db.TrainingSession.hasMany(db.StandardAssessment, { foreignKey: { name: 'sessionId', field: 'session_id' }, as: 'standardAssessments' });
db.StandardAssessment.belongsTo(db.TrainingSession, { foreignKey: { name: 'sessionId', field: 'session_id' }, as: 'trainingSession' });

// MilitaryPersonnel <-> StandardAssessment (One-to-Many)
db.MilitaryPersonnel.hasMany(db.StandardAssessment, { foreignKey: { name: 'militaryPersonId', field: 'military_person_id' }, as: 'standardAssessments' });
db.StandardAssessment.belongsTo(db.MilitaryPersonnel, { foreignKey: { name: 'militaryPersonId', field: 'military_person_id' }, as: 'militaryPersonnel' });

// Exercise <-> StandardAssessment (One-to-Many)
db.Exercise.hasMany(db.StandardAssessment, { foreignKey: { name: 'exerciseId', field: 'exercise_id' }, as: 'exerciseAssessments' });
db.StandardAssessment.belongsTo(db.Exercise, { foreignKey: { name: 'exerciseId', field: 'exercise_id' }, as: 'exerciseDetails' });

module.exports = db;