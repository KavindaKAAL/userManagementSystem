const env = require("./config/config");
const { initiate_app } = require("./app");

const main = async ()=>{

    const port = env.PORT || 8081;
    
    const server = await initiate_app();

    server.listen(port,()=>{
        console.log(`server is running on http://localhost:${port}`);
    })

} 

main();