'use strict'
const Db = require('../config/db');

class PostQueryHandler {

    async insertPost(post) {
        return new Promise( async (resolve, reject) => {
            try{
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').insertOne(post, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
            }catch(err){
                reject(err);
            }
        });
    }
    
    async getAllPosts() {
        return new Promise( async (resolve, reject) => {
            try{
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').find({}).project({comments: {$slice: -10}}).sort({'_id': -1}).toArray( (err,posts) => {
                    DB.close();
                    if(err) {
                        // console("In DataBase: "+err);
                        reject(err);
                    }
                    // console.log(posts);
                    resolve(posts);
                });
            }catch(err){
                reject(err);
            }
        });
    }
    async insertComment(postid, comment) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').update({_id: ObjectID(postid)}, {$inc:{noOfcomments: 1}, $push:{comments: comment}}, (err, data) => {
                    DB.close();
                    if(err){
                        reject(err);
                    }
                    // console.log(data);
                    comment.postid = postid;
                    resolve(comment);
                });
            } catch(error) {
                reject(error);
            }
        });
    }
    async like(postid,userid,inc) {
        const like = {};
        return new Promise(async (resolve, reject) => {
            try{
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                if(inc == true) {
                    DATABASE.collection('posts').update({_id: ObjectID(postid)}, {$inc: {noOflikes: 1}, $push: {likedBy: userid}}, (err,data) => {
                        DB.close();
                        if(err) {
                            reject(err);
                            console.log(err);
                        }
                        like.postid = postid;
                        like.userid = userid;
                    });
                }
                else {
                    DATABASE.collection('posts').update({_id: ObjectID(postid)}, {$inc: {noOflikes: -1}, $pull: {likedBy: userid}}, (err,data) => {
                        DB.close();
                        if(err) {
                            reject(err);
                            console.log(err);
                        }
                        like.userid = userid;
                        like.postid = postid;
                    });
                }
                const likes = await this.getLikes(postid);
                like.likes = likes.noOflikes;
                // console.log('like  '+like);
                resolve(like);
            } catch(err) {
                reject(err);
            }
        });
    }

    async incShares(postid) {
        return new Promise( async (resolve, reject) => {
            try {
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').updateOne({_id: ObjectID(postid)},{$inc: {shares: 1}}, (err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async getLikes(postid) {
        return new Promise( async (resolve, reject) => {
            try {
                // console.log(postid);
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').find({_id: ObjectID(postid)}).toArray((err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async getPostDetails(postid) {
        return new Promise( async (resolve, reject) => {
            try{
                const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').find({_id: ObjectID(postid)}).toArray((err, data) => {
                    if(err) {
                        reject(err);
                    }
                    console.log(data[0]);
                    resolve(data[0]);
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    async getAllActivities(userid) {
        return new Promise( async (resolve, reject) => {
            const [DB,ObjectID] = await Db.connectToDb();
                const DATABASE = DB.db('Fb');
                DATABASE.collection('posts').find({$or:[
                    {
                        uploader: userid
                    },
                    {
                        likedBy: userid
                    },
                    {
                        comments: {$elemMatch: {userid: userid}}
                    }
                ]}).sort({'_id': -1}).toArray((err, data) => {
                    DB.close();
                    if(err) {
                        reject(err);
                    }
                    resolve(data);
                });
        });
    }
}
module.exports = new PostQueryHandler();