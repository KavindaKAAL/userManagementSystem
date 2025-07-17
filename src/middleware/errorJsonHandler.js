const invalidJsonPayload = async (err, req, res, next)=>{
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err){
        return res.status(400).json({
            status: "error",
            message: "Invalid JSON payload"
        })
    };
    next();
};

const nonJsonReq = async (req, res, next) =>{
    const contentType = req.headers['content-type'] || '';
    const methodsWithBody = ['POST', 'PUT'];

    if (methodsWithBody.includes(req.method)){
        if(!contentType.includes('application/json')){
            return res.status(415).json({
            status: 'error',
            message: 'Content-Type must be application/json'
        })
        }
    }
    
    next();
}

module.exports = {invalidJsonPayload, nonJsonReq};