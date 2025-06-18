const app = require('./app');
const db = require('./models');

const PORT = 5001;

const start = async () => {
    try {
        await db.sequelize.sync();
        console.log('Database synchronized successfully.');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        console.error('Unable to connect to the database or synchronize:', err);
    }
};

start();