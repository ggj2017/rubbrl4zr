window.lib = (new function(){
    var _music = null;

    this.ajax = function(method, uri, handler, params, contentType) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200
                && handler != undefined)
            {
                handler(xhttp.responseText);
            }
        };
        xhttp.open(method, uri, true);
        if(contentType != undefined)
            xhttp.setRequestHeader("Content-type", contentType);
        if(params == undefined)
            xhttp.send();
        else xhttp.send(params);
    };

    this.requestFullscreen = function(){
        var elem = document.body;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    };

    this.exitFullscreen = function(){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };

    this.isFullscreen = function(){
        return (document.fullscreenElement
            || document.mozFullScreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement) != undefined;
    };

    this.toggleFullscreen = function(){
        if(lib.isFullscreen()){
            lib.exitFullscreen();
        }
        else {
            lib.requestFullscreen();
        }
    };

    this.loopMusic = function(filePath) {
        _music = new Audio(filePath);
        _music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        _music.play();
    };

    this.stopMusic = function() {
        if(_music) {
            _music.stop();
            _music = null;
        }
        _music = new Audio(filePath);
        _music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        _music.play();
    };

    this.loadContent = function(uri){
        var suffix = "";
        if(lib.gameId && lib.playerId) {
            suffix = "/"+lib.gameId+"/"+lib.playerId+"/";
        }
        lib.ajax("GET", "/static/content/"+uri+".fragment.html", function(data){
            var wrapper = document.querySelector(".wrapper");
            var children = wrapper.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                child.className += " remove";
            }
            history.pushState(null, "", "/"+encodeURIComponent(uri)+suffix);
            window.setTimeout(function(){
                wrapper.innerHTML = data;

                var scripts = wrapper.getElementsByTagName("script");

                var i = 0;
                function loadNthScript(i, scripts){
                    if(i >= scripts.length) return;

                    if(scripts[i].src) {
                        var head = document.getElementsByTagName('head')[0];
                        var script = document.createElement("script");
                        script.onload = function(){
                            loadNthScript(i+1, scripts);
                        }
                        script.src = scripts[i].src;
                        head.appendChild(script);
                    }
                    else {
                        eval(scripts[i].innerHTML);
                        loadNthScript(i+1, scripts);
                    }
                }
                loadNthScript(0, scripts);

                // for(var i = 0; i < scripts.length; i++) {
                //     if(scripts[i].src){
                //         var head = document.getElementsByTagName('head')[0];
                //         head.appendChild(scripts[i]);
                //     }
                //     else{
                //         eval(scripts[i].innerHTML);
                //     }
                // }
            }, 500)
        });
    };

    this.getParams = function() {
        return window.location.pathname.split('/');
    }

    this.getPlayerInfo = function(playerId) {
        lib.ajax("GET", "/player/"+lib.gameId+"/"+lib.playerId+"/",
            function(data) {
                lib.playerName = JSON.parse(data)["name"];
        });
    }

    window.onload = function() {
        var params = lib.getParams();
        if(params[2] && params[3]){
            lib.gameId = params[2];
            lib.playerId = params[3];
            lib.getPlayerInfo(lib.playerId);
        }
        lib.loadContent(params[1] || "welcome");
    };
});
