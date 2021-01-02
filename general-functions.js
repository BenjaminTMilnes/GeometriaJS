

// Characterises a function in the form ax + by + c = 0 as opposed to y = mx + n.
// m = -a/b
// n = -c/b
// a = y1 - y2
// b = x2 - x1
// c = -a x1 - b y1
// Useful for determining whether two lines cross.
class GeneralLinearFunction {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.endpoint1 = null;
        this.endpoint2 = null;
    }

    static fromVertices(vertex1, vertex2) {
        var line = new GeneralLinearFunction(0, 0, 0);

        line.a = vertex1.y - vertex2.y;
        line.b = vertex2.x - vertex1.x;
        line.c = -line.a * vertex1.x - line.b * vertex1.y;
        line.endpoint1 = vertex1;
        line.endpoint2 = vertex2;

        return line;
    }

    get gradient() {
        if (this.isLineOfConstantY) {
            return 0;
        }
        else if (this.isLineOfConstantX) {
            return Infinity;
        }
        else {
            return -this.a / this.b;
        }
    }

    get m() {
        return this.gradient;
    }

    get yIntercept() {
        if (this.isLineOfConstantX) {
            return null;
        }
        else {
            return - this.c / this.b;
        }
    }

    get n() {
        return this.yIntercept;
    }

    get xIntercept() {
        if (this.isLineOfConstantY) {
            return null;
        }
        else {
            return - this.c / this.a;
        }
    }

    get e1() {
        return this.endpoint1;
    }

    get e2() {
        return this.endpoint2;
    }

    get isLineOfConstantX() {
        return this.b == 0;
    }

    get isLineOfConstantY() {
        return this.a == 0;
    }

    get u() {
        if (this.e1 !== null && this.e2 != null) {
            return from(this.e1).to(this.e2).u;
        }
        else {
            if (this.isLineOfConstantX) {
                return v2(0, 1);
            }
            else {
                return v2(1, this.m).u;
            }
        }
    }

    evaluateAtX(x) {
        if (this.isLineOfConstantX) {
            return null;
        }

        return (-this.a * x - this.c) / this.b;
    }

    evaluateAtY(y) {
        if (this.isLineOfConstantY) {
            return null;
        }

        return (-this.b * y - this.c) / this.a;
    }

    vertexAtX(x) {
        if (this.isLineOfConstantX) {
            return null;
        }

        return v(x, this.evaluateAtX(x));
    }

    vertexAtY(y) {
        if (this.isLineOfConstantY) {
            return null;
        }

        return v(this.evaluateAtY(y), y);
    }

    intersects(line) {
        return this.m != line.m;
    }

    getIntersectionPoint(line) {
        if (!this.intersects(line)) {
            return null;
        }

        var x = (this.b * line.c - this.c * line.b) / (this.a * line.b - this.b * line.a);
        var y = 0;

        if (this.isLineOfConstantX) {
            y = line.evaluateAtX(x);
        }
        else {
            y = this.evaluateAtX(x);
        }

        return v(x, y);
    }

    intersectsWithinXRange(line, x1, x2) {
        if (!this.intersects(line)) {
            return false;
        }

        var p = this.getIntersectionPoint(line);

        return p.x >= Math.min(x1, x2) && p.x <= Math.max(x1, x2);
    }

    intersectsWithinYRange(line, y1, y2) {
        if (!this.intersects(line)) {
            return false;
        }

        var p = this.getIntersectionPoint(line);

        return p.y >= Math.min(y1, y2) && p.y <= Math.max(y1, y2);
    }

    intersectsBetweenEndpoints(line) {
        if (!this.intersects(line)) {
            return false;
        }

        var p = this.getIntersectionPoint(line);

        return isBetween(p.x, this.e1.x, this.e2.x) && isBetween(p.y, this.e1.y, this.e2.y) && isBetween(p.x, line.e1.x, line.e2.x) && isBetween(p.y, line.e1.y, line.e2.y);
    }

    isPointAboveLine(point) {
        if (this.isLineOfConstantX) {
            return undefined;
        }

        var y = this.evaluateAtX(point.x);

        return point.y > y;
    }

    isPointBelowLine(point) {
        if (this.isLineOfConstantX) {
            return undefined;
        }

        var y = this.evaluateAtX(point.x);

        return point.y < y;
    }

    isPointLeftOfLine(point) {
        if (this.isLineOfConstantY) {
            return undefined;
        }

        var x = this.evaluateAtY(point.y);

        return point.x < x;
    }

    isPointRightOfLine(point) {
        if (this.isLineOfConstantY) {
            return undefined;
        }

        var x = this.evaluateAtY(point.y);

        return point.x > x;
    }

    isPointOnLine(point) {
        if (!this.isLineOfConstantX) {
            var y = this.evaluateAtX(point.x);

            return point.y == y;
        }
        else {
            var x = this.evaluateAtY(point.y);

            return point.x == x;
        }
    }
}

function quadraticFunction(a, b, c, root = 1) {
    return (-b + Math.sign(root) * Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}

// Characterises a function in the form (x - cx)^{2} + (y - cy)^{2} = r^{2}
// Useful for determining whether two circles, or a line and a circle, cross.
class GeneralArcFunction {
    constructor(centre, radius, angle1 = 0, angle2 = 360) {
        this.centre = centre;
        this.radius = radius;
        this.angle1 = angle1;
        this.angle2 = angle2;
    }

    get circumference() {
        return 2 * Math.PI * this.radius;
    }

    intersects(circle) {
        return separation(this.centre, circle.centre) < this.radius + circle.radius;
    }

    getIntersectionPoints(circle) {

    }

    intersectsLine(line) {
        return this.getIntersectionPointsWithLine(line).length > 0;
    }

    getIntersectionPointsWithLine(line) {
        var cx = this.centre.x;
        var cy = this.centre.y;
        var r = this.radius;

        var a = line.a;
        var b = line.b;
        var c = line.c;

        var aa = 1 + (a * a) / (b * b);
        var bb = (-2 * cx) + ((2 * a * c) / (b * b)) + ((2 * cy * a) / (b));
        var cc = cx * cx + cy * cy + (c * c) / (b * b) + (2 * cy * c) / (b) - r * r;

        var root = bb * bb - 4 * aa * cc;

        var intersections = [];

        if (root >= 0) {
            var x1 = quadraticFunction(aa, bb, cc, 1);
            var y1 = line.m * x1 + line.n;
            var p1 = v2(x1, y1);
            var p11 = from(this.centre).to(p1);

            if ((this.angle2 >= this.angle1 && p11.a >= this.angle1 && p11.a < this.angle2) ||
                (this.angle2 < this.angle1 && (p11.a >= this.angle1 || p11.a <= this.angle2))) {
                intersections.push(p1);
            }
        }

        if (root > 0) {
            var x2 = quadraticFunction(aa, bb, cc, -1);
            var y2 = line.m * x2 + line.n;
            var p2 = v2(x2, y2);
            var p22 = from(this.centre).to(p2);

            if ((this.angle2 >= this.angle1 && p22.a >= this.angle1 && p22.a < this.angle2) ||
                (this.angle2 < this.angle1 && (p22.a >= this.angle1 || p22.a <= this.angle2))) {
                intersections.push(p2);
            }
        }

        return intersections;
    }

    getIntersectionPointsWithLineWithinEndpoints(line) {
        var points = this.getIntersectionPointsWithLine(line);

        if (!line.isLineOfConstantX) {
            points = points.filter(p => p.x >= line.e1.x && p.x <= line.e2.x);
        }
        else {
            points = points.filter(p => p.y >= line.e1.y && p.y <= line.e2.y);
        }

        return points;
    }
}