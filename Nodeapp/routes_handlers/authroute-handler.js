'use strict'
const AuthQueryHandler = require('../database_handlers/authquery-handler');
const PostQueryHandler = require('../database_handlers/postquery-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PROFILES = '/home/mahesh/Documents/Mean/FaceBook/Angularapp/src/assets/profiles/';

class AuthRouteHandler {
   
    async registerHandler(req, res) {
         if (req.body.firstname == undefined || req.body.surname == undefined || req.body.username == undefined || req.body.password == undefined || req.body.dob == undefined || req.body.gender == undefined) {
             res.status(501).json({
                 error: true,
                 message: `All Fields Are Required`
             });
         }
         else {
             const user = {
                firstname: req.body.firstname,
                surname: req.body.surname,
                username: req.body.username,
                password: req.body.password,
                dob: req.body.dob,
                gender: req.body.gender
             }
             try{
                user.online = "Y";
                user.socketid = "";
                user.receivedRequests = [];
                user.sentRequests = [];
                user.friends = [];
                if(user.gender == 'M') {
                    user.profile = "assets/profiles/default.jpg"
                }
                else {
                    user.profile = "assets/profiles/female.jpeg"
                }
                let insertedUser = await AuthQueryHandler.register(user);
                if(insertedUser == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Server Error`
                    });
                }
                else{
                    res.status(200).json({
                        error: false,
                        fullname: user.firstname + ' ' + user.surname,
                        userid: insertedUser.insertedId
                    })
                }
             } catch(err) {
                 res.status(501).json({
                     error: true,
                     message: `Internal Server Error`
                 });
             }
         }   
    }
    
    async loginHandler(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        if(username == undefined || password == undefined) {
            res.status(501).json({
                error: true,
                message: `Username or Password cannot be Empty`
            });
        }
        else{
            try {
                const projection = {
                    _id: true,
                    firstname: true,
                    surname: true,
                    username: true,
                    password: true,
                    socketid: false,
                    gender: false,
                    dob: false,
                    profile: false,
                    online: false,
                }
                const result = await AuthQueryHandler.getUserInfo(username, projection);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Server Error`
                    }); 
                }
                else{
                    if(password == result.password) {
                        res.status(200).json({
                            error: false,
                            fullname: result.firstname + ' ' + result.surname,
                            userid: result._id
                        });
                    }
                    else{
                        res.status(501).json({
                            error: true,
                            message: `Enter Correct Details`
                        });
                    }
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Server Error`
                });
            }
        }
    }
    async usernameCheckHandler(req,res){
        const username = req.body.username;
        try{
            const projection = {
                _id: false,
                firstname: false,
                surname: false,
                username: true,
                password: false,
                socketid: false,
                gender: false,
                dob: false,
                profile: false,
                online: false,
            }
            const result = await AuthQueryHandler.getUserInfo(username, projection);
            if(result == undefined || result == '' || result == null) {
                res.status(200).json({
                    error: false,
                    message: `Username Available`
                })
            } 
            else{
                res.status(501).json({
                    error: true,
                    message: `Username Not Available`
                });
            }
        } catch(err) {
            res.status(501).json({
                error: true,
                message: `Internal Server Error`
            });
        }
    }
    async logoutHandler(req, res) {
        const userid = req.body.userid;
        if(userid == undefined) {
            res.status(501).json({
                error: true,
                message: `userid Cannot Be Empty`
            });
        }
        else{
            try {
                const result = await AuthQueryHandler.logOut(userid);
                if(result == undefined) {
                    res.status(501).json({
                        error: true,
                        message: `Internal Server Error`
                    });
                }
                else{
                    res.status(501).json({
                        error: false,
                        message: `SuccessFully LoggedOut`
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Server Error`
                });
            }
        }
    }

    async getUserDetailsHandler(req, res) {
        const userid = req.body.userid;
        if(userid != undefined) {
            try {
                const projection = {
                    _id: true,
                    firstname: true,
                    surname: true,
                    username: true,
                    password: true,
                    socketid: false,
                    gender: true,
                    dob: true,
                    profile: true,
                    online: false
                };
                const result = await AuthQueryHandler.getUserInfoById(userid, projection);
                if(result != undefined) {
                    res.status(200).json({
                        _id: result._id,
                        firstname: result.firstname,
                        surname: result.surname,
                        username: result.username,
                        password: result.password,
                        dob: result.dob,
                        profile: result.profile,
                        gender: result.gender
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Server Error`
                });
            }
        }
        else{
            res.status(501).json({
                error: true,
                message: `userid cannot empty`
            });
        }
    }

    async updateUserDetailsHandler(req, res) {
        const profileStorage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null,PROFILES);
            },
            filename: (req,file,cb) => {
                cb(null, req.body.id);
            }
        });
        const profileUpload = multer({storage: profileStorage}).single('profile');
        profileUpload(req, res, async (err) => {
            if(req.file != null && req.file !=undefined){    
                if(err) {
                    res.status(501).json({
                        error: true,
                        message: 'Internal Server Error1'
                    });
                    console.log(err);
                }
                try{
                    const userid = req.body.id;
                    const user = {
                        firstname: req.body.firstname,
                        surname: req.body.surname,
                        username: req.body.username,
                        password: req.body.password,
                        dob: req.body.dob
                    };
                    // console.log('1' + user);
                    user.profile = 'assets/profiles/'+req.file.filename;
                    const result = await AuthQueryHandler.updateUserDetails(userid, user);
                    if (result != undefined) {
                        res.status(200).json({
                            error: false,
                            profile: user.profile
                        });
                        let post = {
                            type: 2,
                            noOflikes: 0,
                            noOfcomments: 0,
                            likedBy: [],
                            comments: [],
                            shares: 0 
                        };
                        post.uploader = userid;
                        post.location = 'assets/profiles/' + req.file.filename;
                        post.description = '';
                        post.uploadername = user.firstname+' '+user.surname;
                        post.uploaderprofile = user.profile;
                        post.uploadedDate = new Date();
                        await PostQueryHandler.insertPost(post);
                    }
                    else {
                        res.status(501).json({
                            error: true,
                            message: 'Internal Server Error'
                        });
                    }
                }catch(err) {
                    res.status(501).json({
                        error: true,
                        message: 'Internal Server Error2'
                    });
                    console.log(err);
                }
            }
            else {
                const userid = req.body.id;
                const user = {
                    firstname: req.body.firstname,
                    surname: req.body.surname,
                    username: req.body.username,
                    password: req.body.password,
                    dob: req.body.dob
                };
                const result = await AuthQueryHandler.updateUserDetails(userid, user);
                if (result != undefined) {
                    res.status(200).json({
                        error: false,
                        profile: 'not change'
                    });
                }
                else {
                    res.status(501).json({
                        error: true,
                        message: 'Internal Server Error'
                    });
                }
            }
        });
    }

}
module.exports = new AuthRouteHandler();
