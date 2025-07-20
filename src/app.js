const express = require('express');
const { connectDB } = require("./utils/db");
const routes = require('./routes/index');
const checkDBConnection = require('./middleware/checkDBConnection');
const checkUndefinedRoutes = require('./middleware/checkUndefinedRoutes');
const {invalidJsonPayload, nonJsonReq} = require('./middleware/errorJsonHandler');
const morgan = require('morgan');
const logger = require('../logger');


const initiate_app = async (uri)=>{
    const app = express();
    app.use(express.json());
    
    connectDB(uri);

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