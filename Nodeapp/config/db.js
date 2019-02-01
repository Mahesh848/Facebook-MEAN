const mongodb = require('mongodb');

class Db {
    constructor(){
        this.mongoClient = mongodb.MongoClient;
        this.objectID = mongodb.ObjectID;
    }
    connectToDb() {
        const MongoDatabaseUrl = `mongodb://localhost:27017/Fb`;
        return new Promise( (resolve, reject) => {
            this.mongoClient.connect(MongoDatabaseUrl, (err,db) => {
                if(err) {
                    reject(err);
                }
                else{
                    console.log('Connection To Database Established.....');
                    resolve([db,this.objectID]);
                }
            });
        });
    }
}
module.exports = new Db();