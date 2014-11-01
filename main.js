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