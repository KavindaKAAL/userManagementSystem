const mongoose  = require("mongoose");

const checkDBConnection = (req, res, next)=>{
    const ready_state = mongoose.connection.readyState;

    if (ready_state !== 1){
        return res.status(503).json({message: "Service unavailable."})
    }

    next();
};

module.exports = checkDBConnection;