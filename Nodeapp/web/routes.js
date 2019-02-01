'use strict'
const AuthRouteHandler = require('../routes_handlers/authroute-handler');
const PostRouteHandler = require('../routes_handlers/postroute-handler');
const ChatRouteHandler = require('../routes_handlers/chatroute-handler');

class Routes {

    constructor(app) {
        this.app = app;
    }

    allRoutes(){
        
        this.app.post('/register',AuthRouteHandler.registerHandler);
        
        this.app.post('/login', AuthRouteHandler.loginHandler);

        this.app.post('/usernamecheck', AuthRouteHandler.usernameCheckHandler);

        this.app.post('/logout', AuthRouteHandler.logoutHandler);

        this.app.post('/uploadpost', PostRouteHandler.uploadPostHandler);

        this.app.post('/getallposts', PostRouteHandler.getPostsHandler);

        this.app.post('/getusername', PostRouteHandler.getUploaderNameHandler);

        this.app.post('/getpostdetails', PostRouteHandler.getPostDetalsHandler);

        this.app.post('/getuserdetails', AuthRouteHandler.getUserDetailsHandler);

        this.app.post('/updateuserdetails', AuthRouteHandler.updateUserDetailsHandler);

        this.app.post('/getallactivities', PostRouteHandler.getAllActivitiesHandler);

        this.app.post('/getallfriendrequests', ChatRouteHandler.getFriendRequestsHandler);

        this.app.post('/search', ChatRouteHandler.searchHandler);

        this.app.post('/clearallrequests', ChatRouteHandler.clearAllRequestsHandler);

        this.app.post('/deletesentfriendrequest', ChatRouteHandler.deleteSentFriendrequestHandler);

        this.app.post('/peopleyoumayknow', ChatRouteHandler.peopleYouMayKnowHandler);

        this.app.post('/getallfriends', ChatRouteHandler.getFriendsHandler);

        this.app.post('/getallchatfriends', ChatRouteHandler.getChatFriendsHandler);

        this.app.post('/getconversation', ChatRouteHandler.getConversationHandler);

        this.app.post('/getunreadmessages', ChatRouteHandler.getUnreadMessagesHandler);

        this.app.post('/getnotifications', ChatRouteHandler.getAllNotificationHandler);

    }

    includeRoutes() {
        this.allRoutes(); 
    }

}
module.exports = Routes;