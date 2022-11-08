const mongoose = require('mongoose');
const {createClient} = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));


// starting redis client
(async ()=>{
    await client.connect().catch();
})()


// Monkey patching Query.prototype.exec
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function(){
    const key = JSON.stringify(
        Object.assign({},this.getQuery(),{
            collection: this.mongooseCollection.name
        })
    )

    // See if we have a value for 'key' in redis
    const cacheValue = await client.get(key)

    // If we do, return value
    if(cacheValue){
        console.log(key)
        console.log("From Cache Server",JSON.parse(cacheValue))
        return JSON.parse(cacheValue)
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this,arguments)
    await client.set(key, JSON.stringify(result))
    return result

}
