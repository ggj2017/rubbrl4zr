/*class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}*/

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return point.x >= x1 && point.x <= x2
                && point.y >= y1 && point.y <= y2;
    }
}

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    contains(point) {
        return Math.abs(point.x - this.x) <= this.radius && Math.abs(point.y - this.y) <= this.radius;
    }
}


// class RotationMatrix {
//     constructor(degrees) {
//         var angle = degrees
//         this.a = Math.cos(angle);
//         this.b = -Math.sin(angle);
//         this.c = -this.b;
//         this.d = this.a;
//     }
//
//     rotatePoint(point){
//
//     }
// }
