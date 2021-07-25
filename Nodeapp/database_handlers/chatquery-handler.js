'use strict'

const Db = require('../config/db');

class ChatQueryHandler {

    async searchForPeoples(searchtext) {
        return new Promise(async (resolve ,reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').find({
                    $text: {$search: searchtext}
                }).toArray((err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
            } catch(err) {
                reject(err);
            }
        })
    }

    async getAllFriendrequests(userid) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').aggregate([
                    {$match: {_id: ObjectID(userid)}},
                    {$project: {receivedRequests: {$reverseArray: '$receivedRequests'}, sentRequests: {$reverseArray: '$sentRequests'}}}
                ]).toArray((err, data) => {
                    if(err) {
                        reject(err);
                    }
                    // console.log(data[0].sentRequests);
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async sendFriendrequest(sentFriendreq,receivedFriendreq) {
        return new Promise(async (resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(sentFriendreq.id)},{$push: {receivedRequests: receivedFriendreq}}, (err,data) => {
                    if(err) {
                        reject(err);
                    }
                    DATABASE.collection('users').update({_id: ObjectID(receivedFriendreq.id)}, {$push: {sentRequests: sentFriendreq}}, (err, data) => {
                        DB.close();
                        if(err) {
                            reject(err);
                        }
                    });
                    resolve([sentFriendreq, receivedFriendreq]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async removeFriendrequest(sender, reciever) {
        // console.log(sender+ '  ' +reciever);
        return new Promise(async(resolve, reject) => {
            try{
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(sender)}, {$pull: {sentRequests: {id: reciever}}},(err, data) => {
                    if(err) {
                        reject(err);
                    }
                    DATABASE.collection('users').update({_id: ObjectID(reciever)}, {$pull: {receivedRequests: {id: sender}}},(err, data) => {
                        if(err) {
                            reject(err);
                        }
                    });
                    //console.log('deleting');
                    resolve([sender,reciever]);   
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async acceptFriendRequest(sender, reciever) {
        //console.log(sender);
        //console.log(reciever);
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(reciever.id)}, {$push: {friends: sender}}, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    DATABASE.collection('users').update({_id: ObjectID(reciever.id)}, {$pull: {receivedRequests: {id: sender.id}}}, (err, data) => {
                        if(err) {
                            reject(err);
                        }
                        DATABASE.collection('users').update({_id: ObjectID(sender.id), 'sentRequests.id': reciever.id},{$push: {friends: reciever}}, (err, data) => {
                            if(err) {
                                reject(err);
                            }
                            DATABASE.collection('users').update({_id: ObjectID(sender.id), 'sentRequests.id': reciever.id}, {$set: {'sentRequests.$.read': true}}, (err, data) => {
                                DB.close();
                                if(err) {
                                    reject(err);
                                }
                                
                            });
                        });
                    });
                    resolve([sender,reciever]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async clearAllRequests(userid) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(userid)}, {$pull: {sentRequests: {read: true}}},{multi: true}, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    DATABASE.collection('users').update({_id: ObjectID(userid)}, {$set: {'receivedRequests.$[element].read': true}}, { multi: true, arrayFilters: [{"element.read": false}]}, (err, data) => {
                       DB.close();
                        if(err) {
                            console.log('Error');
                            reject(err);
                        }            
                    });
                    resolve('success');
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async deleteSentFriendrequest(sender, receiver) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(receiver.id)},{$pull: {receivedRequests: {id: sender.id}}}, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(sender.id);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async peopleYouMayKnow(userid) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').find({}).project({_id: 1, firstname: 1, surname: 1, gender: 1, profile: 1}).toArray((err, data) => {
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

    async unfriend(sender, reciever) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('users').update({_id: ObjectID(sender)},{$pull: {friends: {id: reciever}}}, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    DATABASE.collection('users').update({_id: ObjectID(reciever)},{$pull: {friends: {id: sender}}}, (err, data) => {
                        DB.close();
                        if(err) {
                            reject(err);
                        }
                    });
                    resolve([sender, reciever]);
                });

            } catch(err) {
                reject(err);
            }
        });        
    }

    async insertMessage(message) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('chats').insertOne(message, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(message);
                });
            } catch(err) { 
                reject(err);
            }
        });
    }

    async getConversation(userid1, userid2) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('chats').find({
                    $or:[
                        {
                           $and:[
                                {from: userid1},
                                {to: userid2}
                            ]
                        },
                        {
                            $and:[
                                {from: userid2},
                                {to: userid1}
                            ]
                        }
                    ]
                }).toArray((err, data) => {
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

    async getUnreadMessages(from, to) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('chats').find({
                    from: from,
                    to: to,
                    read: false
                }).count((err, data) => {
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

    async getUnreadMessagesOfaUser(userid) {
        return new Promise (async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('chats').find({
                    to: userid
                }).sort({_id: -1}).toArray((err, data) => {
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

    async makeSeen(from, to) {
        return new Promise (async (resolve, reject) => {
            try {
                const [DB, ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('chats').updateMany({from: from, to: to, read: false}, {$set: {read: true}}, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve([from, to]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }
}
module.exports = new ChatQueryHandler();