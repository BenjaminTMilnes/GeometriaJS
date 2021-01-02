
function square(number) {
    return Math.pow(number, 2);
}

function cube(number) {
    return Math.pow(number, 3);
}

function squareRoot(number) {
    return Math.sqrt(number);
}

function cubeRoot(number) {
    return Math.cbrt(number);
}

function toRadians(degrees) {
    return (degrees / 360) * 2 * Math.PI;
}

function toDegrees(radians) {
    return (radians / (2 * Math.PI)) * 360;
}

function sin(degrees) {
    return Math.sin(toRadians(degrees));
}

function cos(degrees) {
    return Math.cos(toRadians(degrees));
}

function asin(x) {
    return toDegrees(Math.asin(x));
}

function acos(x) {
    return toDegrees(Math.acos(x));
}

function atan(x) {
    return toDegrees(Math.atan(x));
}

function between(minimum, value, maximum) {
    if (value < minimum) {
        return minimum;
    }
    else if (value > maximum) {
        return maximum;
    }
    else {
        return value;
    }
}

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static fromRAndTheta(r, theta) {
        return new Vector2D(r * cos(theta), r * sin(theta));
    }

    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get m() {
        return this.magnitude;
    }

    get unitVector() {
        if (this.m == 0) {
            return this;
        }
        else {
            return this.times(1 / this.m);
        }
    }

    get u() {
        return this.unitVector;
    }

    // Anticlockwise normal vector
    get normalUnitVector() {
        return this.u.rotate(90);
    }

    // Anticlockwise normal vector
    get n() {
        return this.normalUnitVector;
    }

    get argument() {
        if (this.x == 0) {
            if (this.y == 0) {
                return 0;
            }
            else if (this.y > 0) {
                return 90;
            }
            else if (this.y < 0) {
                return 270;
            }
        }

        var theta = atan(Math.abs(this.y / this.x)); // the angle between the vector and the nearest side of the x-axis

        if (this.x > 0 && this.y >= 0) {
            return theta;
        }
        else if (this.x < 0 && this.y >= 0) {
            return 180 - theta;
        }
        else if (this.x < 0 && this.y < 0) {
            return 180 + theta;
        }
        else if (this.x > 0 && this.y < 0) {
            return 360 - theta;
        }
    }

    get a() {
        return this.argument;
    }

    argumentFromAxis(axis = "+x") {
        if (axis == "+y") {
            return (this.a + 360 - 90) % 360;
        }
        if (axis == "-x") {
            return (this.a + 360 - 180) % 360;
        }
        if (axis == "-y") {
            return (this.a + 360 - 270) % 360;
        }

        return this.a;
    }

    add(vector) {
        var v = new Vector2D();

        v.x = this.x + vector.x;
        v.y = this.y + vector.y;

        return v;
    }

    subtract(vector) {
        var v = new Vector2D();

        v.x = this.x - vector.x;
        v.y = this.y - vector.y;

        return v;
    }

    times(scalar) {
        return this.scale(scalar, scalar);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    translate(dx = 0, dy = 0) {
        var v = new Vector2D();

        v.x = this.x + dx;
        v.y = this.y + dy;

        return v;
    }

    translateX(dx) {
        return this.translate(dx, 0);
    }

    translateY(dy) {
        return this.translate(0, dy);
    }

    scale(sfx = 1, sfy = 1) {
        var v = new Vector2D();

        v.x = this.x * sfx;
        v.y = this.y * sfy;

        return v;
    }

    scaleX(sfx) {
        return this.scale(sfx, 1);
    }

    scaleY(sfy) {
        return this.scale(1, sfy);
    }

    reflect() {
        return this.scale(-1, -1);
    }

    reflectX() {
        return this.scaleX(-1);
    }

    reflectY() {
        return this.scaleY(-1);
    }

    // Positive angles rotate anticlockwise.
    rotate(theta) {
        var r = new RotationMatrix2D(theta);

        return r.times(this);
    }

    rotateAboutPoint(theta, point) {
        var v = this.subtract(point);
        v = v.rotate(theta);
        v = v.add(point);

        return v;
    }
}

class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    get m() {
        return this.magnitude;
    }

    get unitVector() {
        if (this.m == 0) {
            return this;
        }
        else {
            return this.scale(1 / this.m);
        }
    }

    get u() {
        return this.unitVector;
    }

    add(vector) {
        var v = new Vector3D();

        v.x = this.x + vector.x;
        v.y = this.y + vector.y;
        v.z = this.z + vector.z;

        return v;
    }

    subtract(vector) {
        var v = new Vector3D();

        v.x = this.x - vector.x;
        v.y = this.y - vector.y;
        v.z = this.z - vector.z;

        return v;
    }

    times(scalar) {
        return this.scale(scalar, scalar, scalar);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    translate(dx = 0, dy = 0, dz = 0) {
        var v = new Vector3D();

        v.x = this.x + dx;
        v.y = this.y + dy;
        v.z = this.z + dz;

        return v;
    }

    translateX(dx) {
        return this.translate(dx, 0, 0);
    }

    translateY(dy) {
        return this.translate(0, dy, 0);
    }

    translateZ(dz) {
        return this.translate(0, 0, dz);
    }

    scale(sfx = 1, sfy = 1, sfz = 1) {
        var v = new Vector3D();

        v.x = this.x * sfx;
        v.y = this.y * sfy;
        v.z = this.z * sfz;

        return v;
    }

    scaleX(sfx) {
        return this.scale(sfx, 1, 1);
    }

    scaleY(sfy) {
        return this.scale(1, sfy, 1);
    }

    scaleZ(sfz) {
        return this.scale(1, 1, sfz);
    }

    reflect() {
        return this.scale(-1, -1, -1);
    }

    reflectX() {
        return this.scaleX(-1);
    }

    reflectY() {
        return this.scaleY(-1);
    }

    reflectZ() {
        return this.scaleZ(-1);
    }
}

function v2(x = 0, y = 0) {
    return new Vector2D(x, y);
}

var v = v2;

function v3(x = 0, y = 0, z = 0) {
    return new Vector3D(x, y, z);
}

const zz = v2(0, 0);
const zzz = v3(0, 0, 0);

function separation(point1, point2) {
    return point2.subtract(point1).m;
}

function midpoint(point1, point2) {
    return point1.add(point2.subtract(point1).times(0.5));
}

function normal(point1, point2) {
    return point2.subtract(point1).n;
}

function scalarProduct(vector1, vector2) {
    if (vector1.z !== undefined && vector2.z !== undefined) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }
    else {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
}

function vectorProduct(vector1, vector2) {
    if (vector1.z !== undefined && vector2.z !== undefined) {
        var vector3 = v3();

        vector3.x = vector1.y * vector2.z - vector1.z * vector2.y;
        vector3.y = vector1.z * vector2.x - vector1.x * vector2.z;
        vector3.z = vector1.x * vector2.y - vector1.y * vector2.x;

        return vector3;
    }
    else {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }
}

function angleBetween(vector1, vector2) {
    return acos(scalarProduct(vector1, vector2) / (vector1.m * vector2.m));
}

function centreOfBoundingRectangle(points) {
    var minimumX = Math.min(...points.map(p => p.x));
    var maximumX = Math.max(...points.map(p => p.x));
    var minimumY = Math.min(...points.map(p => p.y));
    var maximumY = Math.max(...points.map(p => p.y));

    return v2((maximumX + minimumX) / 2, (maximumY + minimumY) / 2);
}

function from(vector1) {
    return {
        to: function (vector2) {
            return vector2.subtract(vector1);
        }
    }
}

function transformToUNCoordinates(v, u, n) {
    var alpha = (v.x * n.y - v.y * n.x) / (u.x * n.y - u.y * n.x);
    var beta = (n.x == 0) ? (v.y - alpha * u.y) / n.y : (v.x - alpha * u.x) / n.x;

    return v2(alpha, beta);
}

function getSeparationInTermsOfUAndN(point1, point2, u, n) {
    var e1 = transformToUNCoordinates(point1, u, n);
    var e2 = transformToUNCoordinates(point2, u, n);
    var e3 = e2.subtract(e1);

    return { "u": e3.x, "n": e3.y };
}

function sumVectors(vectors) {
    var sum = zz;

    for (let vector of vectors) {
        sum = sum.add(vector);
    }

    return sum;
}

class Matrix2D {
    constructor(a11 = 0, a12 = 0, a21 = 0, a22 = 0) {
        this.a11 = a11;
        this.a12 = a12;
        this.a21 = a21;
        this.a22 = a22;
    }

    times(vector) {
        var v1 = new Vector2D();

        v1.x = this.a11 * vector.x + this.a12 * vector.y;
        v1.y = this.a21 * vector.x + this.a22 * vector.y

        return v1;
    }
}

// Positive angles rotate anticlockwise.
class RotationMatrix2D extends Matrix2D {
    constructor(theta = 0) {
        super(cos(theta), -sin(theta), sin(theta), cos(theta));

        this.theta = theta;
        this.thetaR = toRadians(theta);
    }
}

class Matrix3D {
    constructor(a11 = 0, a12 = 0, a13 = 0, a21 = 0, a22 = 0, a23 = 0, a31 = 0, a32 = 0, a33 = 0) {
        this.a11 = a11;
        this.a12 = a12;
        this.a13 = a13;
        this.a21 = a21;
        this.a22 = a22;
        this.a23 = a23;
        this.a31 = a31;
        this.a32 = a32;
        this.a33 = a33;
    }

    timesVector(vector) {
        var x = this.a11 * vector.x + this.a12 * vector.y + this.a13 * vector.z;
        var y = this.a21 * vector.x + this.a22 * vector.y + this.a23 * vector.z;
        var z = this.a31 * vector.x + this.a32 * vector.y + this.a33 * vector.z;

        return v3(x, y, z);
    }

    timesMatrix(matrix) {
        var m = new Matrix3D();

        m.a11 = this.a11 * matrix.a11 + this.a12 * matrix.a21 + this.a13 * matrix.a31;
        m.a12 = this.a11 * matrix.a12 + this.a12 * matrix.a22 + this.a13 * matrix.a32;
        m.a13 = this.a11 * matrix.a13 + this.a12 * matrix.a23 + this.a13 * matrix.a33;
        m.a21 = this.a21 * matrix.a11 + this.a22 * matrix.a21 + this.a23 * matrix.a31;
        m.a22 = this.a21 * matrix.a12 + this.a22 * matrix.a22 + this.a23 * matrix.a32;
        m.a23 = this.a21 * matrix.a13 + this.a22 * matrix.a23 + this.a23 * matrix.a33;
        m.a31 = this.a31 * matrix.a11 + this.a32 * matrix.a21 + this.a33 * matrix.a31;
        m.a32 = this.a31 * matrix.a12 + this.a32 * matrix.a22 + this.a33 * matrix.a32;
        m.a33 = this.a31 * matrix.a13 + this.a32 * matrix.a23 + this.a33 * matrix.a33;

        return m;
    }
}

function isometricProjectionMatrix(alpha = 33, beta = 45) {
    var m1 = new Matrix3D(1, 0, 0, 0, cos(alpha), sin(alpha), 0, -sin(alpha), cos(alpha));
    var m2 = new Matrix3D(cos(beta), 0, -sin(beta), 0, 1, 0, sin(beta), 0, cos(beta));
    var m3 = m1.timesMatrix(m2);

    return m3;
}

function perspectiveProjectionMatrix(thetaX = 0, thetaY = 0, thetaZ = 0) {
    var m1 = new Matrix3D(1, 0, 0, 0, cos(thetaX), sin(thetaX), 0, -sin(thetaX), cos(thetaX));
    var m2 = new Matrix3D(cos(thetaY), 0, -sin(thetaY), 0, 1, 0, sin(thetaY), 0, cos(thetaY));
    var m3 = new Matrix3D(cos(thetaZ), sin(thetaZ), 0, -sin(thetaZ), cos(thetaZ), 0, 0, 0, 1);
    var m4 = m1.timesMatrix(m2).timesMatrix(m3);

    return m4;
}

function perspectiveProjectPoint(point, cameraPosition, cameraOrientation, displaySurfacePosition) {
    var m = perspectiveProjectionMatrix(cameraOrientation.x, cameraOrientation.y, cameraOrientation.z);
    var a = point.subtract(cameraPosition);
    var b = m.timesVector(a);

    var x = (displaySurfacePosition.z / b.z) * b.x + displaySurfacePosition.x;
    var y = (displaySurfacePosition.z / b.z) * b.y + displaySurfacePosition.y;

    return v2(x, y);
}

function isBetween(value, limit1, limit2) {
    return value >= Math.min(limit1, limit2) && value <= Math.max(limit1, limit2);
}

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