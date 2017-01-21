document.onmousemove = function (evt){
    var cursor = document.getElementById('cursor');
    cursor.style.left = evt.clientX+"px";
    cursor.style.top = evt.clientY+"px";
}