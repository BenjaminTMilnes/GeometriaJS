
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