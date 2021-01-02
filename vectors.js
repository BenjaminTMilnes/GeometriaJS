
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

    of(vector) {
        var sign = Math.sign(vectorProduct(vector, this));
        var theta = Math.abs(angleBetween(vector, this));

        return a2(sign * theta);
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

    cross(vector) {
        var v = new Vector3D();

        v.x = this.y * vector.z - this.z * vector.y;
        v.y = this.z * vector.x - this.x * vector.z;
        v.z = this.x * vector.y - this.y * vector.x;

        return v;
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

function sumVectors(vectors) {
    var sum = zz;

    vectors.forEach(v => {
        sum = sum.add(v);
    });

    return sum;
}

function averageVector(vectors) {
    return sumVectors(vectors).times(1 / vectors.length);
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
    return vector1.dot(vector2);
}

function vectorProduct(vector1, vector2) {
    if (vector1 instanceof Vector3D && vector2 instanceof Vector3D) {
        return vector1.cross(vector2);
    }
    else if (vector1 instanceof Vector2D && vector2 instanceof Vector2D) {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }
}

function angleBetween(vector1, vector2) {
    return acos(scalarProduct(vector1, vector2) / (vector1.m * vector2.m));
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