const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;
const {createClient} = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));


(async ()=>{
    // starting redis client
    await client.connect().catch();
})()

mongoose.Query.prototype.cache = function(option = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(option.key || '')
    return this; 
}

mongoose.Query.prototype.exec = async function () {
    if(!this.useCache){
        return exec.apply(this,arguments);
    }
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
    console.log(key)
    console.log(this.hashKey)
    // See if we have a value for 'key' in redis
    const cachedValue = await client.hGet(this.hashKey,key);

    // if we do, return that
    if(cachedValue){
        console.log("Cache Server");
        /** if need to return as Mongoose Model Document **/
        // const doc = JSON.parse(cachedValue)
        // Array.isArray(doc) ? doc.map(d=> new this.model(d)) : new this.model(doc);
        // return doc

        return JSON.parse(cachedValue);
    }


    // Otherwise, issue the query and store result in redis

    const result = await exec.apply(this, arguments);
    //console.log(result);

    // redis set result data
    console.log('Saving Data into redis');

    await client.hSet(
        this.hashKey,
        key,
        JSON.stringify(result),
        {
            EX: 10,      // Expiration cache in Second
            NX: true    //  Sets Expiry when expiry is not in keys
        }
    );

    return result;
}

module.exports = {
    clearHash(hashKey){
        console.log(hashKey)
        client.del(JSON.stringify(hashKey))
    }
}
