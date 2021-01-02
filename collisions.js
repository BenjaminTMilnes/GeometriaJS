
class BoundingRectangle {
    constructor(topLeft, width, height) {
        this.topLeft = topLeft;
        this.width = width;
        this.height = height;
    }

    get topRight() {
        return this.topLeft.add(v2(this.width, 0));
    }

    get bottomLeft() {
        return this.topLeft.add(v2(0, this.height));
    }

    get bottomRight() {
        return this.topLeft.add(v2(this.width, this.height));
    }

    get centre() {
        return midpoint(this.topLeft, this.bottomRight);
    }

    containsPoint(point) {
        return (point.x >= this.topLeft.x && point.y >= this.topLeft.y && point.x <= this.bottomRight.x && point.y <= this.bottomRight.y);
    }
}

class BoundingQuadrilateral {
    constructor(vertex1, vertex2, vertex3, vertex4) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;
        this.vertex4 = vertex4;
    }

    get line1() {
        return GeneralLinearFunction.fromVertices(this.vertex1, this.vertex2);
    }

    get line2() {
        return GeneralLinearFunction.fromVertices(this.vertex2, this.vertex3);
    }

    get line3() {
        return GeneralLinearFunction.fromVertices(this.vertex3, this.vertex4);
    }

    get line4() {
        return GeneralLinearFunction.fromVertices(this.vertex4, this.vertex1);
    }

    get lines() {
        return [this.line1, this.line2, this.line3, this.line4];
    }

    containsPoint(point) {
        var a = 0; // The number of lines to the right of the point.
        var b = 0; // The number of lines to the left of the point.
        var c = 0; // The number of lines above the point.
        var d = 0; // The number of lines below the point.

        this.lines.forEach(line => { if (line.isPointLeftOfLine(point)) { a += 1; } });
        this.lines.forEach(line => { if (line.isPointRightOfLine(point)) { b += 1; } });
        this.lines.forEach(line => { if (line.isPointAboveLine(point)) { c += 1; } });
        this.lines.forEach(line => { if (line.isPointBelowLine(point)) { d += 1; } });

        if (a == 1 && b == 1 && c == 1 && d == 1 || a == 2 && b == 2 && c == 2 && d == 2) {
            return true;
        }
        else {
            return false;
        }
    }
}

class BoundingTriangle {
    constructor(vertex1, vertex2, vertex3) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;
    }

    get line1() {
        return GeneralLinearFunction.fromVertices(this.vertex1, this.vertex2);
    }

    get line2() {
        return GeneralLinearFunction.fromVertices(this.vertex2, this.vertex3);
    }

    get line3() {
        return GeneralLinearFunction.fromVertices(this.vertex3, this.vertex1);
    }

    get lines() {
        return [this.line1, this.line2, this.line3];
    }

    containsPoint(point) {
        var a = 0; // The number of lines to the right of the point.
        var b = 0; // The number of lines to the left of the point.
        var c = 0; // The number of lines above the point.
        var d = 0; // The number of lines below the point.

        this.lines.forEach(line => { if (line.isPointLeftOfLine(point)) { a += 1; } });
        this.lines.forEach(line => { if (line.isPointRightOfLine(point)) { b += 1; } });
        this.lines.forEach(line => { if (line.isPointAboveLine(point)) { c += 1; } });
        this.lines.forEach(line => { if (line.isPointBelowLine(point)) { d += 1; } });

        if (a == 0 || b == 0 || c == 0 || d == 0) {
            return false;
        }
        else {
            return true;
        }
    }
}

class BoundingCircle {
    constructor(centre, radius) {
        this.centre = centre;
        this.radius = radius;
    }

    containsPoint(point) {
        return separation(this.centre, point) <= this.radius;
    }
}


class BoundingArc {
    constructor(centre, angle1, angle2, radius1, radius2) {
        this.centre = centre;
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.radius1 = radius1;
        this.radius2 = radius2;
    }

    containsPoint(point) {
        var ds = from(this.centre).to(point);

        if (ds.m < this.radius1 || ds.m > this.radius2) {
            return false;
        }

        if (this.angle2 >= this.angle1 && ds.a >= this.angle1 && ds.a <= this.angle2) {
            return true;
        }
        else if (this.angle2 < this.angle1 && (ds.a >= this.angle1 || ds.a <= this.angle2)) {
            return true;
        }
        else {
            return false;
        }
    }
}