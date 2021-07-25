'use strict'

const Db = require('../config/db');

class NotificationQueryHandler {
    async insertNotification(notification) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('notifications').insertOne(notification, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(notification);
                });
            } catch(err) {
                reject(err);
            }
        });
    }
    async getAllNotificationsOfAuser(userid) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('notifications').find({to: userid}).sort({_id: -1}).toArray((err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        });        
    }
    async makeSeen(userid) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('notifications').updateMany({to: userid, read: false}, {$set: {read: true}}, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        });  
    }
}
module.exports = new NotificationQueryHandler();