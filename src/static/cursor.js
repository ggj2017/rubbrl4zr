document.onmousemove = function (evt){
    var cursor = document.getElementById('cursor');
    if(cursor == null){
        cursor = document.createElement("div");
        cursor.id = "cursor";
        document.body.appendChild(cursor);
    }
    cursor.style.left = evt.clientX+"px";
    cursor.style.top = evt.clientY+"px";
    cursor.style.display = "block";
}

document.onload = function() {
}
