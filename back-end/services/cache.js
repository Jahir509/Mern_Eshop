const mongoose = require('mongoose');
const client = require("../helpers/redis-connect");
const exec = mongoose.Query.prototype.exec;

(async ()=>{
    // starting redis client
    await client.connect().catch();
})()

mongoose.Query.prototype.exec = async function () {
    console.log('I always run before query');

    const key = JSON.stringify(
        Object.assign(
            {},
            this.getQuery(),
            {
                collection: this.mongooseCollection.name
            }
        )
    )
    //console.log(key)

    // See if we have a value for 'key' in redis
    const cachedValue = await client.get(key);
    // if we do, return that
    if(cachedValue){
        console.log("Cache");
        //console.log(cachedValue);
        return JSON.parse(cachedValue);
    }


    // Otherwise, issue the query and store result in redis

    const result = await exec.apply(this, arguments);
    //console.log(result);
    // redis set result data
    console.log('Saving Data into redis');
    await client.set(key,JSON.stringify(result));

    return result;
}
