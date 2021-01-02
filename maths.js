
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

function isBetween(value, limit1, limit2) {
    return value >= Math.min(limit1, limit2) && value <= Math.max(limit1, limit2);
}

class Angle {
    constructor(degrees = 0) {
        this.degrees = degrees;
    }

    get radians() {
        return toRadians(this.degrees);
    }

    get gradians() {
        return (this.degrees / 360) * 400;
    }

    get turns() {
        return (this.degrees / 360);
    }

    normalise() {
        if (this.degrees >= 360) {
            this.degrees = this.degrees % 360;
        }
        else if (this.degrees <= -360) {
            this.degrees = - ((-this.degrees) % 360);
        }
    }

    add(angle) {
        return new Angle(this.degrees + angle.degrees);
    }

    subtract(angle) {
        return new Angle(this.degrees - angle.degrees);
    }

    times(scalar) {
        return new Angle(this.degrees * scalar);
    }

    toString(unit = "degrees", ndp = 1, nsf = 0) {
        if (unit == "degrees") {
            if (ndp >= 0) {
                return this.degrees.toFixed(ndp) + "°";
            }
            else if (nsf >= 1) {
                return this.degrees.toPrecision(nsf) + "°";
            }
            else {
                return this.degrees.toString() + "°";
            }
        }
    }
}

function a2(degrees) {
    return new Angle(degrees);
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