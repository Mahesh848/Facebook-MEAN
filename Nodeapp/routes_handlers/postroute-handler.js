'use strict'

const PostQueryHandler = require('../database_handlers/postquery-handler');
const AuthQueryHandler = require('../database_handlers/authquery-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const POSTS = '/home/mahesh/Documents/Mean/FaceBook/Angularapp/src/assets/posts/';

class PostRouteHandler {

    async uploadPostHandler(req, res){
        const postStorage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null,POSTS);
            },
            filename: (req,file,cb) => {
                cb(null, Date.now()+path.extname(file.originalname));
            }
        });
        const postUpload = multer({storage: postStorage}).single('post');
        let post = {
            type: 0,
            noOflikes: 0,
            noOfcomments: 0,
            likedBy: [],
            comments: [],
            shares: 0 
        };
        postUpload(req,res, async (err) => {
            //console.log(req.file.filename);
            //console.log(req.body);
            if(err) {
                res.status(501).json({
                    error: true,
                    message: 'Internal Server Error1'
                });
                console.log(err);
            }
            try{
                post.uploader = req.body.uploader;
                post.location = 'assets/posts/' + req.file.filename;
                post.description = req.body.description;
                post.uploadername = req.body.uploadername;
                post.uploaderprofile = req.body.uploaderprofile;
                post.uploadedDate = req.body.uploadedDate;
                // console.log(post.uploader+"   "+post.location);
                const result = await PostQueryHandler.insertPost(post);
                if(result == null || result == undefined || result == "") {
                    res.status(501).json({
                        error: true,
                        message: 'DataBase Error'
                    });
                }
                else{
                    res.status(201).json({
                        error: false,
                        message: 'SuccessFully Uploaded'
                    });
                }
            } catch(err) {
                res.status(501).json({
                    error: true,
                    message: 'Internal Server Error2'
                });
                console.log(err);
            }
        });
    }

    async getPostsHandler(req, res) {
        try{
            const AllPosts = await PostQueryHandler.getAllPosts();
            // console.log(AllPosts);
            res.status(200).json({
                error: false,
                posts: AllPosts
            });
        }catch(err){
            console.log(err);
        }
    }

    async getUploaderNameHandler(req, res) {
        if(req.body.userid != undefined){
            try{
                const projection = {
                    _id: true,
                    firstname: true,
                    surname: true,
                    username: false,
                    password: false,
                    socketid: false,
                    gender: false,
                    dob: false,
                    profile: false,
                    online: false,
                }
                const result = await AuthQueryHandler.getUserInfoById(req.body.userid, projection);
                if(result != undefined) {
                    res.status.json({
                        error: false,
                        userid: result.userid
                    });
                }
                else{
                    res.status(501).json({
                        error: true,
                        message: `Invalid userid`
                    });
                }
            }catch(err){
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else{
            res.status(501).json({
                error: true,
                message: `userid cnanot be empty`
            });
        }
    }

    async getPostDetalsHandler(req, res) {
        const postid = req.body.postid;
        if(postid != undefined) {
            try {
                const result = await PostQueryHandler.getPostDetails(postid);
                if(result != undefined) {
                    res.status(200).json({
                        error: false,
                        post: result
                    });
                }
            }catch(err) {
                res.status(501).json({
                    error: true,
                    message: `Internal Error`
                });
            }
        }
        else{
            res.status(501).json({
                error: true,
                message: `postid cnanot be empty`
            });
        }
    }

    async getAllActivitiesHandler(req, res) {
        const userid = req.body.userid;
        console.log(userid);
        if(userid != undefined && userid != null) {
            try{
                const posts = await PostQueryHandler.getAllActivities(userid);
                if(posts != undefined && posts != null) {
                    res.status(200).json({
                        error: false,
                        activities: posts
                    });
                }
            } catch(err){
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
            })
        }
    }

}
module.exports = new PostRouteHandler();