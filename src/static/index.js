window.lib = (new function(){
    var _music = null;
    var _intervals = [];
    this.players = [];

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
        {
            xhttp.send();
        }
        else {
            xhttp.send(params);
        }
    };

    this.setInterval = function(callback, timeout) {
        _intervals.push(window.setInterval(callback, timeout));
    }

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
        for(var interval of _intervals) {
            window.clearInterval(interval);
        }
        _intervals = [];
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

    this.getGameInfo = function(gameId) {
        lib.ajax("GET", "/game_info/"+lib.gameId+"/",
            function(data) {
                lib.joinLink = JSON.parse(data)["joinLink"];
        });
    }

    var _showTypewriterText = function(visible, invisible, interval){
        var message = invisible.textContent;
        if (message.length > 0) {
            visible.textContent += message[0];
            invisible.textContent = message.substring(1);
            setTimeout(function () { _showTypewriterText(visible, invisible, interval); }, interval);
        };
    };

    this.showTypewriterText = function(target, message, interval) {
        var visible = document.createElement("span");
        var invisible = document.createElement("span");
        invisible.style.opacity = "0";
        invisible.textContent = message;
        target.innerHTML = "";
        target.appendChild(visible);
        target.appendChild(invisible);
        _showTypewriterText(visible, invisible, interval);
    };

    window.onload = function() {
        var params = lib.getParams();
        if(params[2] && params[3]){
            lib.gameId = params[2];
            lib.playerId = params[3];
            lib.getPlayerInfo(lib.playerId);
            lib.getGameInfo(lib.gameId);
        }
        lib.loadContent(params[1] || "welcome");
    };
});
