// const express = require('express');
// const app = express();
// const port = 8080;
// const hostname = "127.0.0.1";

// const studentRoutes = require('./routes/students');
// const teachersRoutes = require('./routes/teachers');
// const classRoutes = require('./routes/classes');

// const connectDB = require("./config/db");
// const uri = "mongodb://172.17.0.2:27017/?directConnection=true&appName=mongosh+2.5.5";

// connectDB(uri);

// app.use(express.json());
// app.use('/api/students',studentRoutes);
// app.use('/api/classes',classRoutes);
// app.use('/api/teachers',teachersRoutes);

// app.listen(port,hostname,()=>{
//     console.log(`app is running on http://${hostname}:${port}`);
// })

const express = require('express');
const { connectDB } = require("./config/db");
const { config } = require("./config/keys");
const routes = require('./routes/index');
const checkDBConnection = require('./middleware/checkDBConnection');
const checkUndefinedRoutes = require('./middleware/checkUndefinedRoutes');
const {invalidJsonPayload, nonJsonReq} = require('./middleware/errorJsonHandler');
const morgan = require('morgan');
const logger = require('../logger');


const initiate_app = async ()=>{
    const app = express();
    app.use(express.json());
    
    connectDB(config.MONGO_URI);

    app.use(checkDBConnection);
    app.use(morgan('combined', { stream: logger.stream }));
    app.use(nonJsonReq);
    app.use(invalidJsonPayload);

    app.use("/api/v1", routes);

    // for undefined routes
    app.use(checkUndefinedRoutes);

    // General error handler
    app.use((err, req, res, next) => {
        console.error('Global error handler:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    });

    return app;
}

module.exports = {initiate_app};