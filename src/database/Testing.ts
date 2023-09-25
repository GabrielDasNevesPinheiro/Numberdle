import sequelize from "./Connection";


async function test() {
        
    await sequelize.authenticate();
    console.log("Connected.");
}

try {   
    
    test();

} catch (error) {
    console.log(`Error while connecting ${error}`);
}