const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });
//

const app = express();

//import routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
//app middleware
app.use(morgan('dev'));
app.use(bodyParser.json())
//app.use(cors());
if (process.env.NODE_ENV == 'development') {
    app.use(cors({ origin: `http://localhost:3000` }))
}
//connect to db
// mongoose.connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
// .then(() => console.log("DB Connected"))
// .catch(err => console.log("DB Error", err))
//middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
//
const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on port ${PORT}`))