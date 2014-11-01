function onLogin() {
    fbService.connect(function(isMember, isAdmin){
        if(isMember) {
            if(!isAdmin)
                console.log("Welcome Fiiob Member");
            else
                console.log("Welcome Fiiob Admin");
        }
        else {
            console.log("You are not Welcome");
        }
    });
}

function onDeauthorize() {
    fbService.deauthorize();
}

var members = [];

function onShowMembers() {
    fbService.getFiiobMembers("", function(members) {
        setTimeout(function() {
            for(var i in members) {
                var member = members[i];
                if(member.administrator) {
                    console.log(member.name);
                }
            }
        }, 1);
    });
}




function showFeed() {
    fbService.fetchFiiobFeed("", showFeedWithResponse);
}

function showMyPosts() {
    fbService.fetchMyFiiobFeed("", function(response) {

    });
}

var postsToday = [];

function showTodaysPosts(url) {
    var date = new Date();
    var todayStart = date.toISOString().split('T')[0];
    if(url == undefined) {
        url = "";
        postsToday.length = 0;
    }

    fbService.fetchFiiobFeed(url, function(response) {
        var posts = response.data;
        var updatedToday = true;
        var container = document.getElementById("feed");
        posts.forEach(function(post, index, postList) {
            var postObject = {};
            if(post.message)
                postObject.message = post.message;

            if(post.picture)
                postObject.picture = post.picture;

            postObject.from = post.from;

            if(post.created_time > todayStart) {
                postsToday.push(postObject);
                console.log(postObject.message);

                var postDiv = document.createElement("div");
                var html = "";
                if(post.message) {
                    html += post.message + "<br>";
                }
                if(post.picture) {
                    html += '<img src="' + post.picture + '"/>';
                }
                postDiv.innerHTML = html + "<br>--------------------------------------------------------------------------<br><br>";

                container.appendChild(postDiv);
            }

            if(post.updated_time < todayStart) {
                updatedToday = false;
            }
        });
        if(response.paging && response.paging.next && updatedToday) {
            url = response.paging.next.split("https://graph.facebook.com/v2.1/146194088779617/feed")[1];
            //console.log(url);
            showTodaysPosts(url);
        }
    });
}



var currentFeedResponse = undefined;

function showFeedWithResponse(response) {
    console.log(response);
    var container = document.getElementById("feed");
    while(container.firstChild)
        container.removeChild(container.firstChild);
    var posts = response.data;
    currentFeedResponse = response;
    for(var i in posts) {
        var post = posts[i];
        var postDiv = document.createElement("div");
        var html = "";
        if(post.message) {
            html += post.message + "<br>";
        }
        if(post.picture) {
            html += '<img src="' + post.picture + '"/>';
        }
        postDiv.innerHTML = html + "<br><br><br>";

        container.appendChild(postDiv);
    }
    if(currentFeedResponse.paging && currentFeedResponse.paging.next) {
        document.getElementById("next").isDisabled = false;
    }
    else {
        document.getElementById("next").isDisabled = true;
    }
}

function onNextPage() {
    if(currentFeedResponse.paging && currentFeedResponse.paging.next) {
        var url = currentFeedResponse.paging.next.split("https://graph.facebook.com/v2.0/146194088779617/feed")[1];
        fbService.fetchFiiobFeed(url, showFeedWithResponse);
    }
}

function getUserInfo() {
    var id = "915112075168812";
    var query = "";
    fbService.fetchUserInfo(id, undefined, function(response) {

    });
}