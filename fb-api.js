(function(d, s, id) {
    console.log('loading fb sdk...');
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')
    );

window.fbAsyncInit = function() {
    // initializing the app
    console.log('initializing fb app...');
    FB.init({
        appId      : '638028812956369',
        cookie     : true,  // enable cookies to allow the server to access the session
        xfbml      : false,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.0
    });
};

//facebook class constructor
function FiiobFBService(){
    var _facebookService = this;
    var connected = false;
    var groupName = 'FOOTBALL IS IN OUR BLOOD';

    var permissions = 'user_likes, user_activities, user_groups, user_interests, read_stream';
    var fiiobInfo = undefined;
    var fiiobGroupId = "146194088779617";

    var members = [];
    var user = undefined;

    var fetchInfo = function(callback) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            if (response && !response.error) {
                console.log('Good to see you, ' + response.name + '.');
                fetchGroupInfo(response, callback);
            }
        });
    };

    var fetchGroupInfo = function(response, callback) {
        FB.api('/me/groups', {q: groupName}, function(response) {
            if (response && !response.error) {
                if(response.data.length > 0) {
                    var isAdmin = false;
                    if(response.data[0].administrator)
                        isAdmin = true;
                    user = response;
                    callback(true, isAdmin);
                }
                else {
                    callback(false);
                }
            }
        });
    };

    var fetchFiiobInfo = function() {
        FB.api("/" + fiiobGroupId, function (response) {
            if (response && !response.error) {
                /* handle the result */
                fiiobInfo = response;
            }
        });
    };

    var fetchPermissions = function() {
        FB.api('/me/permissions', function(response) {
            if (response && !response.error) {
                //console.log(response);
            }
        });
    };

    this.deauthorize = function() {
        FB.api('/me/permissions',"DELETE", function(response) {
            if (response && !response.error) {
                console.log(response);
            }
        });
    };

    this.fetchFiiobFeed = function(url, callback) {
        FB.api("/" + fiiobGroupId + "/feed" + url, function (response) {
            if (response && !response.error) {
                /* handle the result */
                //console.log(response);
                callback(response);
            }
        });
    };

    this.fetchMyFiiobFeed = function(url, callback) {
        FB.api("/me/feed",
        function (response) {
            if (response && !response.error) {
                /* handle the result */
                //console.log(response);
                callback(response);
            }
        });
    };

    this.getFiiobMembers = function(url, callback) {
        FB.api("/" + fiiobGroupId + "/members" + url, function (response) {
            if (response && !response.error) {
                /* handle the result */
                members = members.concat(response.data);
                console.log(members.length);

                if(response.paging && response.paging.next) {
                    var nextUrl = response.paging.next.split("https://graph.facebook.com/v2.0/146194088779617/members")[1];
                    _facebookService.getFiiobMembers(nextUrl, callback);
                }
                else {
                    callback(members);
                }
            }
            else {
                callback(members);
            }
        });
    };

    this.connect = function(callback) {
        if (connected)
            return;

        console.log('Connecting to facebook');

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                fetchInfo(function(isMember, isAdmin) {
                    if(isMember) {
                        fetchPermissions();
                        fetchFiiobInfo();
                        connected = true;
                    }
                    callback(isMember, isAdmin);
                });
            }
            else {
                console.log('Calling fblogin');
                FB.login(function(response) {
                    if (response.authResponse) {
                        fetchInfo(function(isMember, isAdmin) {
                            if(isMember) {
                                fetchPermissions();
                                fetchFiiobInfo();
                                connected = true;
                            }
                            callback(isMember, isAdmin);
                        });
                        connected = true;
                        return true;
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                        return false;
                    }
                },
                {
                    scope: permissions,
                    auth_type: 'rerequest'
                });
            }
        });
    };
}

var fbService = new FiiobFBService();