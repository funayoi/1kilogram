$(document).ready(function(){
    // 読み込み時の処理
    // トークンを取り出す
    chrome.storage.sync.get('access_token', function(kv){
        console.log(kv);
        if ('access_token' in kv) {
            access_token = kv.access_token;
            // ログイン処理
            updateSelfInfo();
            $("#login_menu,#user_menu").toggle();
        }
    });

    
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

    // ログインボタン
    $("a#login").click(function(){
        chrome.windows.create({url:loginURL, width:610, height:300, type:"popup"}, popupCallback);
    });

    // アクセストークンの取得・保存
    function getAccessToken(url) {
        if (url.indexOf(callbackURLPrefix) == 0) {
            access_token = url.substring(callbackURLPrefix.length);
            chrome.storage.sync.set({'access_token': access_token});
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

