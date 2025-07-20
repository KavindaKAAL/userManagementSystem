const config = require('config');
const { initiate_app } = require("./app");

const main = async ()=>{

    const port = config.get('app.port');
    const mongo_uri = config.get('db.uri');
    
    const server = await initiate_app(mongo_uri);

    server.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    })

} 

main();