'use strict'
const Db = require('../config/db');
const bcrypt = require('bcrypt');

class AuthQueryHandler {

    async getUserInfo(username, projection) {
        return new Promise( async (resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').find({username: username}, projection).toArray((err, data) => {
                    DB.close();
                    if(err){
                        reject(err);
                    }
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async getUserInfoById(userid, projection) {
        return new Promise( async (resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').find({_id: ObjectID(userid)}).toArray((err, data) => {
                    DB.close();
                    if(err){
                        reject(err);
                    }
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }
    async register(user) {
        return new Promise(async (resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').insertOne(user, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async makeUserOnline(userid, socketid){
        return new Promise(async (resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(userid)}, {$set: {
                    socketid: socketid,
                    online: 'Y'
                }}, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async addSocketid(userid, socketid) {
        return new Promise(async (resolve, reject) => {
            try{
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({ _id: ObjectID(userid) }, 
                    {$set: {socketid: socketid, online: "Y"}}, 
                    (err, data) => {
                        DB.close();
                        if(err) {
                            reject(err);
                        }
                        resolve(data);
                    });
            }catch(err) {
                reject(err);
            }
        });
    }

    async updateUserDetails(userid, user) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(userid)}, {$set: user}, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    if(user.profile != undefined && user.profile !=null){
                        DATABASE.collection('posts').updateMany({uploader: userid}, {$set:{uploaderprofile: user.profile, uploadername: user.firstname+' '+user.surname}},(err,result) => {
                            if(err){
                                reject(err);
                            }
                            DATABASE.collection('posts').updateMany({},{$set: {"comments.$[element].username": user.firstname+' '+user.surname, "comments.$[element].userprofile": user.profile}},{multi: true, arrayFilters: [{"element.userid": userid}]},(err, data) => {
                                DB.close();
                                if(err) {
                                    reject(err);
                                }
                            });
                        });
                    }
                    else{
                        DATABASE.collection('posts').updateMany({uploader: userid}, {$set:{uploadername: user.firstname+' '+user.surname}},(err,result) => {
                            if(err){
                                reject(err);
                            }
                            DATABASE.collection('posts').updateMany({},{$set: {"comments.$[element].username": user.firstname+' '+user.surname}},{multi: true, arrayFilters: [{"element.userid": userid}]},(err, data) => {
                                DB.close();
                                if(err) {
                                    reject(err);
                                }
                            });
                        });
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async logOut(userid) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(userid)},{$set:{
                    socketid: '',
                    online: 'N',
                    lastseen: new Date()
                }}, (err, data) => {
                    DB.close();
                    if(err) {
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
module.exports = new AuthQueryHandler();