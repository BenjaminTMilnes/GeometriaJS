
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

function tan(degrees) {
    return Math.tan(toRadians(degrees));
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