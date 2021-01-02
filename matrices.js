

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