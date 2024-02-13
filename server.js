const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: '.env' });


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    // Connection to database failed, log the error
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
