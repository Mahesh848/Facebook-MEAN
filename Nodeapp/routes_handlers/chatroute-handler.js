'use strict'
const ChatQueryHandler = require('../database_handlers/chatquery-handler');
const AuthQueryHandler = require('../database_handlers/authquery-handler');
const NotificationQueryHandler = require('../database_handlers/notificationquery-handler');

class ChatRouteHandler {
    async getFriendRequestsHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                const result = await ChatQueryHandler.getAllFriendrequests(userid);
                if(result != null && result != undefined) {
                    //console.log("Notsdwg");
                    //console.log(result);
                    res.status(200).json({
                        error: false,
                        receivedRequests: result
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }
    async searchHandler(req, res) {
        const searchtext = req.body.searchtext;
        if(searchtext != undefined && searchtext != null){
            try {
                const result = await ChatQueryHandler.searchForPeoples(searchtext);
                if(result != undefined && result != null) {
                    console.log(result);
                    res.status(200).json({
                        error: false,
                        people: result
                    });
                }
                else{
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else{
            res.status(501).json({
                error: true,
                message: 'Search Cannot be empty'
            });
        }
    }

    async clearAllRequestsHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                const result = await ChatQueryHandler.clearAllRequests(userid);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
                else {
                    res.status(200).json({
                        error: false,
                        message: `Success`
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }    
    }

    async deleteSentFriendrequestHandler(req, res) {
        const sender = req.body.sender;
        const reciever = req.body.reciever;
        if(sender != undefined && reciever != undefined) {
            try {
                const result = await ChatQueryHandler.deleteSentFriendrequest(sender, reciever);
                if(result != undefined) {
                    res.status(200).json({
                        error: false,
                        sender: result
                    });
                }
                else {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `details cannot be empty`
            });
        }
    }

    async peopleYouMayKnowHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                const result = await ChatQueryHandler.peopleYouMayKnow(userid);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
                else {
                    res.status(200).json({
                        error: false,
                        people: result
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }    
    }

    async getFriendsHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                const projection = {
                    _id: false,
                    firstname: false,
                    surname: false,
                    username: false,
                    password: false,
                    socketid: false,
                    gender: false,
                    dob: false,
                    profile: false,
                    online: false,
                    sentRequests: false,
                    receivedRequests: false,
                    friends: true
                }
                const result = await AuthQueryHandler.getUserInfoById(userid, projection);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
                else {
                    res.status(200).json({
                        error: false,
                        friends: result.friends
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }
    
    async getChatFriendsHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                const projection = {
                    _id: false,
                    firstname: false,
                    surname: false,
                    username: false,
                    password: false,
                    socketid: false,
                    gender: false,
                    dob: false,
                    profile: false,
                    online: false,
                    sentRequests: false,
                    receivedRequests: false,
                    friends: true
                }
                const result = await AuthQueryHandler.getUserInfoById(userid, projection);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
                else {
                    let friends = [];
                    for (var i=0; i<result.friends.length; i++) {
                        const user = await AuthQueryHandler.getUserInfoById(result.friends[i].id, projection);
                        user.unreadMessages = await ChatQueryHandler.getUnreadMessages(result.friends[i].id, userid);
                        console.log(user);
                        friends.push(user);
                    }
                    res.status(200).json({
                        error: false,
                        friends: friends
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }
    async getConversationHandler(req, res) {
        const userid1 = req.body.userid1;
        const userid2 = req.body.userid2;
        if(userid1 != undefined && userid2 != undefined) {
            try {
                const conversation = await ChatQueryHandler.getConversation(userid1, userid2);
                if(conversation != undefined) {
                    res.status(200).json({
                        error: false,
                        conversation: conversation
                    });
                }
                else {
                    res.status(501).json({
                        error: true,
                        message: `Internal Error`
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }

    async getUnreadMessagesHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                    const messages = await ChatQueryHandler.getUnreadMessagesOfaUser(userid);
                    if (messages != undefined) {
                        // console.log(messages);
                        res.status(200).json({
                            error: false,
                            messages: messages
                        });
                    }
                    else {
                        res.status(501).json({
                            error: true,
                            message: `Internal Error`
                        });
                    }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }

    async getAllNotificationHandler(req, res) {
        const userid = req.body.userid;
        if(userid != '' && userid != undefined && userid != null) {
            try {
                    const notifications = await NotificationQueryHandler.getAllNotificationsOfAuser(userid);
                    if (notifications != undefined) {
                        res.status(200).json({
                            error: false,
                            notifications: notifications
                        });
                    }
                    else {
                        res.status(501).json({
                            error: true,
                            message: `Internal Error`
                        });
                    }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else {
            res.status(501).json({
                error: true,
                message: `userid cannot be empty`
            });
        }
    }
}
module.exports = new ChatRouteHandler();