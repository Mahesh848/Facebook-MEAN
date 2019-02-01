'use strict'
const AuthQueryHandler = require('../database_handlers/authquery-handler');
const PostQueryHandler = require('../database_handlers/postquery-handler');
const ChatQueryHandler = require('../database_handlers/chatquery-handler');
const NotificationQueryHandler = require('../database_handlers/notificationquery-handler');

class SocketEventHandler {
    constructor(socket) {
        this.io = socket;
    }
    includeSocketEvents(){
        this.io.on('connection', (socket) => {

            socket.on('login', async (data) => {
                const userid = data.userid;
                const response = {
                    on: true,
                    error: false,
                    userid: userid
                };
                socket.broadcast.emit('make-offline', response);
            });

            socket.on('profile-request', async (data) => {
                const userid = data.userid;
                if(userid != null) {
                    const projection = {
                        _id: false,
                        firstname: false,
                        surname: false,
                        username: false,
                        password: false,
                        socketid: true,
                        gender: false,
                        dob: false,
                        profile: true,
                        online: false,
                    };
                    const result = await AuthQueryHandler.getUserInfoById(userid, projection);
                    // console.log(result);
                    if(result != null) { 
                        this.io.to(result.socketid).emit('profile-response', result.profile);
                    }
                }
            });

            socket.on('comment-request', async (data) => {
                const comment = {};
                const postid = data.postid;
                if(data.userid != null && data.comment != null && data.postid != null) {
                    comment.userid = data.userid;
                    comment.comment = data.comment;
                    comment.username = data.username;
                    comment.userprofile = data.userprofile;
                }
                // console.log(comment);
                const response = await PostQueryHandler.insertComment(postid, comment);
                if(response != null) {
                    this.io.emit('comment-response', response);
                    const postdetails = await PostQueryHandler.getPostDetails(postid);
                    const notification = {
                        to: postdetails.uploader,
                        type: 1,
                        postid: postid,
                        read: false,
                    };
                    if (postdetails.type == 0) {
                        notification.notification = comment.username+' commented on a post you uploaded'
                        notification.profile = comment.userprofile;
                        await NotificationQueryHandler.insertNotification(notification);
                        const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                        this.io.to(receiver.socketid).emit('notification', notification);
                    }
                    if (postdetails.type == 1) {
                        notification.notification = comment.username+' commented on a post you shared'
                        notification.profile = comment.userprofile;
                        await NotificationQueryHandler.insertNotification(notification);
                        const receiver = await AuthQueryHandler.getUserInfoById(postdetails.sharer);
                        this.io.to(receiver.socketid).emit('notification', notification);
                    }
                    if (postdetails.type == 2) {
                        notification.notification = comment.username+' commented on your profile'
                        notification.profile = comment.userprofile;
                        await NotificationQueryHandler.insertNotification(notification);
                        const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                        this.io.to(receiver.socketid).emit('notification', notification);
                    }
                    if (postdetails.type == 3) {
                        notification.notification = comment.username+' commented on a post you shared'
                        notification.profile = comment.userprofile;
                        await NotificationQueryHandler.insertNotification(notification);
                        const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                        this.io.to(receiver.socketid).emit('notification', notification);
                    }
                    
                }
            });

            socket.on('like-request', async (data) => {
                const postid = data.postid;
                const userid = data.userid;
                const inc = data.inc;
                if(postid != undefined && userid != undefined) {
                    const response = await PostQueryHandler.like(postid, userid, inc);
                    if(response != undefined) {
                        this.io.emit('like-response' , response);
                        const postdetails = await PostQueryHandler.getPostDetails(postid);
                        if(inc && postdetails.uploader != userid){
                            const notification = {
                                to: postdetails.uploader,
                                type: 1,
                                postid: postid,
                                read: false,
                            };
                            const user = await AuthQueryHandler.getUserInfoById(userid);
                            if (postdetails.type == 0) {
                                notification.notification = user.firstname+' '+user.surname+' likes a post you uploaded'
                                notification.profile = user.profile;
                                await NotificationQueryHandler.insertNotification(notification);
                                const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                                this.io.to(receiver.socketid).emit('notification', notification);
                            }
                            if (postdetails.type == 1) {
                                notification.notification = user.firstname+' '+user.surname+' likes a post you shared'
                                notification.profile = user.profile;
                                await NotificationQueryHandler.insertNotification(notification);
                                const receiver = await AuthQueryHandler.getUserInfoById(postdetails.sharer);
                                this.io.to(receiver.socketid).emit('notification', notification);
                            }
                            if (postdetails.type == 2) {
                                notification.notification = user.firstname+' '+user.surname+' likes your profile'
                                notification.profile = user.profile;
                                await NotificationQueryHandler.insertNotification(notification);
                                const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                                this.io.to(receiver.socketid).emit('notification', notification);
                            }
                            if (postdetails.type == 3) {
                                notification.notification = user.firstname+' '+user.surname+' likes a post you shared'
                                notification.profile = user.profile;
                                await NotificationQueryHandler.insertNotification(notification);
                                const receiver = await AuthQueryHandler.getUserInfoById(postdetails.uploader);
                                this.io.to(receiver.socketid).emit('notification', notification);
                            }
                        }
                    }
                }
            });

            socket.on('friendrequest-request', async (data) => {
                const sentFriendreq = data.sentFriendreq;
                const recievedFriendreq = data.recievedFriendreq;
                console.log(sentFriendreq);
                console.log(recievedFriendreq);
                if(sentFriendreq != undefined && recievedFriendreq != undefined) {
                    const [response1, response2] = await ChatQueryHandler.sendFriendrequest(sentFriendreq, recievedFriendreq);
                    if(response1 != undefined && response2 != undefined) {
                        const projection = {
                            _id: false,
                            firstname: false,
                            surname: false,
                            username: false,
                            password: false,
                            socketid: true,
                            gender: false,
                            dob: false,
                            profile: true,
                            online: false,
                        };
                        const result1 = await AuthQueryHandler.getUserInfoById(response2.id, projection);
                        const result2 = await AuthQueryHandler.getUserInfoById(response1.id, projection);
                        if(result1 != undefined && result2 != undefined) { 
                            this.io.to(result1.socketid).emit('sentfriendrequest-response', response1);
                            this.io.to(result2.socketid).emit('recievedfriendrequest-response', response2);
                        }
                    }
                }
            });
            socket.on('deletefriendrequest-request', async (data) => {
                const sender = data.sender;
                const reciever = data.reciever;
                if (sender != undefined && reciever !=undefined) {
                    const [response1, response2] = await ChatQueryHandler.removeFriendrequest(sender, reciever);
                    if(response1 != undefined && response2 != undefined) {
                        const projection = {
                            _id: false,
                            firstname: false,
                            surname: false,
                            username: false,
                            password: false,
                            socketid: true,
                            gender: false,
                            dob: false,
                            profile: true,
                            online: false,
                        };
                        const result1 = await AuthQueryHandler.getUserInfoById(response1, projection);
                        const result2 = await AuthQueryHandler.getUserInfoById(response2, projection);
                        if(result1 != undefined && result2 != undefined) { 
                           // console.log(result1);
                           // console.log(result2);
                           // console.log(response1);
                           // console.log(response2);
                            this.io.to(result1.socketid).emit('deletesentfriendrequest-response', response2);
                            this.io.to(result2.socketid).emit('deletereceivedfriendrequest-response', response1);
                        }
                    }
                }
            });

            socket.on('acceptfriendrequest-request', async (data) => {
                const sender = data.sender;
                const reciever = data.reciever;
                console.log(sender);
                console.log(reciever);
                if(sender != undefined && reciever != undefined) {
                    const [response1, response2] = await ChatQueryHandler.acceptFriendRequest(sender, reciever);
                    if(response1 != undefined && response2 != undefined) {
                        const projection = {
                            _id: false,
                            firstname: false,
                            surname: false,
                            username: false,
                            password: false,
                            socketid: true,
                            gender: false,
                            dob: false,
                            profile: true,
                            online: false,
                        };
                        const result1 = await AuthQueryHandler.getUserInfoById(response1.id, projection);
                        const result2 = await AuthQueryHandler.getUserInfoById(response2.id, projection);
                        if(result1 != undefined && result2 != undefined) {
                            this.io.to(result1.socketid).emit('acceptfriendrequest-response', response2);
                            this.io.to(result2.socketid).emit('deleteacceptedrequest-response', response1);
                        }
                    }
                }
            });

            socket.on('unfriend-request', async (data) => {
                const sender = data.sender;
                const reciever = data.reciever;
                if(sender != undefined && reciever != undefined) {
                    const [response1,response2] = await ChatQueryHandler.unfriend(sender, reciever);
                    if(response1 != undefined && response2 != undefined) {
                        const projection = {
                            _id: false,
                            firstname: false,
                            surname: false,
                            username: false,
                            password: false,
                            socketid: true,
                            gender: false,
                            dob: false,
                            profile: true,
                            online: false,
                        };
                        const result1 = await AuthQueryHandler.getUserInfoById(response1, projection);
                        const result2 = await AuthQueryHandler.getUserInfoById(response2, projection);
                        if(result1 != undefined && result2 != undefined) {
                            this.io.to(result1.socketid).emit('unfriend-response', response2);
                            this.io.to(result2.socketid).emit('unfriend-response', response1);
                        }
                    }
                }
            });

            socket.on('message-request', async (data) => {
                const message = data.message;
                if( message != undefined && message != null) {
                    const projection = {
                        _id: false,
                        firstname: false,
                        surname: false,
                        username: false,
                        password: false,
                        socketid: true,
                        gender: false,
                        dob: false,
                        profile: true,
                        online: false,
                    };
                    const response = await ChatQueryHandler.insertMessage(message);
                    if(response != undefined) {
                        const result = await AuthQueryHandler.getUserInfoById(response.to, projection);
                        if (result != undefined) {
                            this.io.to(result.socketid).emit('message-response', response);
                        }
                    }
                }
            });

            socket.on('makeseen-request', async (data) => {
                const from = data.from;
                const to = data.to;
                if (from != undefined && to != undefined) {
                    const projection = {};
                    try{
                        const [response1, response2] = await ChatQueryHandler.makeSeen(from, to);
                        if(response1 != undefined && response2 != undefined) {
                            const result1 = await AuthQueryHandler.getUserInfoById(response1, projection);
                            const result2 = await AuthQueryHandler.getUserInfoById(response2, projection);
                            if(result1 != undefined && result2 != undefined) {
                                this.io.to(result2.socketid).emit('makeseen-response', response1);
                            }
                        }  
                    } catch(err) {
                        console.log(err);
                    }
                      
                }
            });

            socket.on('makeseen-notification', async (data) => {
                const userid = data.userid;
                if (userid != undefined) {
                    const result = await NotificationQueryHandler.makeSeen(userid);
                }
            });

            socket.on('sharepost-request', async (data) => {
                const post = data.post;
                if(post != undefined) {
                    try {
                        const postid = post._id;
                        delete post['_id'];
                        const result = await PostQueryHandler.insertPost(post);
                        if (result != undefined) {
                            await PostQueryHandler.incShares(postid);
                            post._id = result.insertedId;
                            this.io.emit('sharepost-response', post);
                        }
                    } catch(err) {
                        console.log(err);
                    }
                }
            });

            socket.on('logout-request', async (data) => {
                const userid = data.userid;
                if(userid != undefined && userid != null) {
                    const response = await AuthQueryHandler.logOut(userid);
                    if(response != null && response != undefined) {
                        const r = {
                            on: false,
                            error: false,
                            userid: userid
                        };
                        this.io.emit('logout-response', r);
                        socket.broadcast.emit('make-offline', r);
                    }
                }
            });

        }) ;
    }
    socketConfig(){
        this.io.use( async (socket,next) => {
            try{
                const userid = socket.request._query['userid'];
                await AuthQueryHandler.addSocketid(userid, socket.id);
                next();
            }catch(err) {
                console.log(err);
            }
        });
        this.includeSocketEvents();
    }
}   
module.exports = SocketEventHandler; 