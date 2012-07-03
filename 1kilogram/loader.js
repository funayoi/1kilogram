var callbackURLPrefix = "http://instagram.com/#access_token=";
var loginURL = "https://instagram.com/oauth/authorize/?client_id=e0119e8eb2e0491ab67862b5d302646f&redirect_uri=http://instagram.com/&response_type=token";

function updateSelfInfo() {
    var apiURL = "https://api.instagram.com/v1/users/self?access_token=" + access_token;

    $.ajax({
        url: apiURL,
        dataType: "json",
        success: function(data, textStatus, jqXHR){
            console.debug(data);
            $("#username").text(data.data.username);
            },
        error: function(jqXHR, textStatus, errorThrown){
            alert("error:" + textStatus);
        }
    });


}

function renderImages(feedObject) {
    for (var i in feedObject) {
        var entry = feedObject[i];
        //console.debug(entry);

        var created = new Date(entry.created_time * 1000);
        console.debug(created);
        created.setHours(0); created.setMinutes(0); created.setSeconds(0); created.setMilliseconds(0);
        var now = new Date();
        now.setHours(0); now.setMinutes(0); now.setSeconds(0); now.setMilliseconds(0);
        var diffDays = (now - created) / (1000 * 60 * 60 * 24);
        var daysBefore;
        if (diffDays < 1) {
            daysBefore = "今日";
        } else if (diffDays < 2) {
            daysBefore = "昨日";
        } else {
            daysBefore = diffDays.toFixed() + "日前"
        }
        console.debug(created);
        console.debug(now);

        var imageFrame = $('<div class="image_frame"></div>');
        imageFrame.append('<img src="' + entry.images.low_resolution.url + '"/>');
        imageFrame.append('<p class="user">' + entry.user.username + '</p>');
        imageFrame.append('<p class="created">' + daysBefore + '</p>');
        imageFrame.append('<p class="caption">' + entry.caption.text + '</p>');
        $('#thumbnails').append(imageFrame);
    }
    $(window).resize();
}

function loadFeed() {
    var feedURL = "https://api.instagram.com/v1/users/self/feed?access_token=" + access_token;

    $.ajax({
        url: feedURL,
        dataType: "json",
        success: function(data, textStatus, jqXHR){
            console.debug(data);
            renderImages(data.data);
            },
        error: function(jqXHR, textStatus, errorThrown){
            alert("error:" + textStatus);
        }
    });

}
