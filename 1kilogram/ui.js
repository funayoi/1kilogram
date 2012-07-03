$(document).ready(function(){
    var onWindowResize = function(){
        var boxWidth = 330;
        var boxVerticalCount = Math.floor(window.innerWidth / boxWidth);
        var newWidth = boxVerticalCount * boxWidth;
        $("#thumbnails").width(newWidth);
        var imageFrames = $(".image_frame");
        for (var i = 0; i < imageFrames.length; i++) {
            if (i % boxVerticalCount == 0) {
                $(imageFrames[i]).css("clear", "both");
            } else {
                $(imageFrames[i]).css("clear", "none");
            }
        }
    };
    $(window).resize(onWindowResize);
    onWindowResize();


    var popupTabId;
    var loginTabCallback = function(tabId, changeInfo, tab) {
        if (tabId == popupTabId) {
            if (getAccessToken(tab.url)) {
                chrome.tabs.remove(tabId);
                chrome.tabs.onUpdated.removeListener(loginTabCallback);
                // ログイン処理
                updateSelfInfo();
                $("#login_menu,#user_menu").toggle();
            }
        }
    }
    var popupCallback = function(win) {
        console.debug(win);
        if (getAccessToken(win.tabs[0].url) == false) {
            popupTabId = win.tabs[0].id;
            chrome.tabs.onUpdated.addListener(loginTabCallback);
        }
    }
    $("a#login").click(function(){
        chrome.windows.create({url:loginURL, width:610, height:300, type:"popup"}, popupCallback);
    });

    function getAccessToken(url) {
        if (url.indexOf(callbackURLPrefix) == 0) {
            access_token = url.substring(callbackURLPrefix.length);
            console.debug(access_token);
            return true;
        } else {
            return false;
        }
    }

    $("a#test").click(function(){
        loadFeed();
    });

});

