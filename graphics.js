
function getPositioningDelta(positioning, width, height) {
    var delta = new Vector2D();

    if (positioning == "topcentre") {
        delta.x = - width / 2;
    }
    if (positioning == "topright") {
        delta.x = - width;
    }
    if (positioning == "middleleft") {
        delta.y = -height / 2;
    }
    if (positioning == "middlecentre") {
        delta.x = - width / 2;
        delta.y = -height / 2;
    }
    if (positioning == "middleright") {
        delta.x = - width;
        delta.y = -height / 2;
    }
    if (positioning == "bottomleft") {
        delta.y = -height;
    }
    if (positioning == "bottomcentre") {
        delta.x = - width / 2;
        delta.y = -height;
    }
    if (positioning == "bottomright") {
        delta.x = - width;
        delta.y = -height;
    }

    delta.y += height;

    return delta;
}

function hueToRGB(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }

    if (t < 1 / 6) { return p + (q - p) * 6 * t; }
    if (t < 1 / 2) { return q; }
    if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }

    return p;
}

function decimalToByte(d) {
    return parseInt(Math.round(d * 255));
}

function HSLToRGB(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hueToRGB(p, q, h + 1 / 3);
        g = hueToRGB(p, q, h);
        b = hueToRGB(p, q, h - 1 / 3);
    }

    return { "r": decimalToByte(r), "g": decimalToByte(g), "b": decimalToByte(b) };
}

function setPixel(imageData, x, y, r, g, b, a) {
    var i = (x + y * imageData.width);

    imageData.data[i * 4 + 0] = r;
    imageData.data[i * 4 + 1] = g;
    imageData.data[i * 4 + 2] = b;
    imageData.data[i * 4 + 3] = a;
}

class GraphicsContext {
    constructor(context) {
        this.context = context;
        this.resolutionFactor = 4;

        this._scale = 1;
        this._offset = zz;
    }

    _setContextTransform() {
        this.context.setTransform(this.resolutionFactor * this._scale, 0, 0, this.resolutionFactor * this._scale, this._offset.x, this._offset.y);
    }

    setScale(scale = 1) {
        this._scale = scale;
        this._setContextTransform();
    }

    setOffset(offset) {
        this._offset = offset;
        this._setContextTransform();
    }

    get offset() {
        return this._offset;
    }

    set offset(value) {
        this.setOffset(value);
    }

    _convertClippingPath(clippingPath) {
        if (clippingPath === null || clippingPath.length < 2) {
            return null;
        }

        var path = new Path2D();

        path.moveTo(clippingPath[0].x, clippingPath[0].y);

        for (var i = 1; i < clippingPath.length; i++) {
            path.lineTo(clippingPath[i].x, clippingPath[i].y);
        }

        return path;
    }

    clear(width, height, fillColour = "white") {
        this.context.setTransform(this.resolutionFactor, 0, 0, this.resolutionFactor, 0, 0);
        this.context.fillStyle = fillColour;
        this.context.fillRect(0, 0, width, height);
        this._setContextTransform();
    }

    drawCircle(centre, radius, fillColour = "none", lineColour = "black", lineWidth = 1, lineDashStyle = [], clippingPath = null) {
        this.drawCircularArc(centre, radius, 0, 360, fillColour, lineColour, lineWidth, lineDashStyle, clippingPath);
    }

    drawCircularArc(centre, radius, fromAngle, toAngle, fillColour = "none", lineColour = "black", lineWidth = 1, lineDashStyle = [], drawAnticlockwise = false, clippingPath = null) {
        this.context.fillStyle = fillColour;

        this.context.save();

        this.context.strokeStyle = lineColour;
        this.context.lineWidth = lineWidth;
        this.context.setLineDash(lineDashStyle);

        this.context.beginPath();

        clippingPath = this._convertClippingPath(clippingPath);
        if (clippingPath != null) {
            this.context.clip(clippingPath);
        }

        this.context.arc(centre.x, centre.y, radius, toRadians(fromAngle), toRadians(toAngle), drawAnticlockwise);

        if (fillColour != "none") {
            this.context.fill();
        }

        if (lineColour != "none" && lineWidth > 0) {
            this.context.stroke();
        }

        this.context.strokeStyle = "none";
        this.context.setLineDash([]);

        this.context.restore();
    }

    drawEllipse(centre, majorAxis, minorAxis, rotation, fillColour = "none", lineColour = "black", lineWidth = 1, lineDashStyle = [], clippingPath = null) {
        this.drawEllipticalArc(centre, majorAxis, minorAxis, rotation, 0, 360, fillColour, lineColour, lineWidth, lineDashStyle, clippingPath);
    }

    drawEllipticalArc(centre, majorAxis, minorAxis, rotation, fromAngle, toAngle, fillColour = "none", lineColour = "black", lineWidth = 1, lineDashStyle = [], clippingPath = null) {
        var semiMajorAxis = majorAxis / 2;
        var semiMinorAxis = minorAxis / 2;

        this.context.save();

        this.context.fillStyle = fillColour;

        this.context.strokeStyle = lineColour;
        this.context.lineWidth = lineWidth;
        this.context.setLineDash(lineDashStyle);

        this.context.beginPath();

        clippingPath = this._convertClippingPath(clippingPath);
        if (clippingPath != null) {
            this.context.clip(clippingPath);
        }

        this.context.ellipse(centre.x, centre.y, semiMajorAxis, semiMinorAxis, toRadians(rotation), toRadians(fromAngle), toRadians(toAngle));

        if (fillColour != "none") {
            this.context.fill();
        }

        if (lineColour != "none" && lineWidth > 0) {
            this.context.stroke();
        }

        this.context.strokeStyle = "none";
        this.context.setLineDash([]);

        this.context.restore();
    }

    drawPath(vertices, fillColour = "none", lineColour = "black", lineWidth = 1, lineDashStyle = [], clippingPath = null) {

        if (vertices == undefined || vertices.length < 2) {
            return;
        }

        this.context.save();

        this.context.fillStyle = fillColour;

        this.context.strokeStyle = lineColour;
        this.context.lineWidth = lineWidth;
        this.context.setLineDash(lineDashStyle);

        this.context.beginPath();

        clippingPath = this._convertClippingPath(clippingPath);
        if (clippingPath != null) {
            this.context.clip(clippingPath);
        }

        this.context.moveTo(vertices[0].x, vertices[0].y);

        for (var i = 1; i < vertices.length; i++) {
            var vertex = vertices[i];

            this.context.lineTo(vertex.x, vertex.y);
        }

        if (fillColour != "none") {
            this.context.fill();
        }

        if (lineColour != "none" && lineWidth > 0) {
            this.context.stroke();
        }

        this.context.strokeStyle = "none";
        this.context.setLineDash([]);

        this.context.restore();
    }

    drawLine(vertex1, vertex2, lineColour = "black", lineWidth = 1, lineDashStyle = [], clippingPath = null) {
        this.drawPath([vertex1, vertex2], "none", lineColour, lineWidth, lineDashStyle, clippingPath);
    }

    drawText(text, position, positioning = "middlecentre", rotation = 0, fontFamily = "Times New Roman", fontSize = 20, fontWeight = "normal", fontStyle = "normal", fontColour = "black", clippingPath = null) {
        fontWeight = (fontWeight == "bold") ? fontWeight : "";
        fontStyle = (fontStyle == "italic") ? fontStyle : "";

        this.context.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
        this.context.fillStyle = fontColour;

        var size = this.measureText(text, fontFamily, fontSize, fontWeight, fontStyle);
        var delta = getPositioningDelta(positioning, size.width, fontSize * 0.7);

        this.context.save();

        this._setContextTransform();

        clippingPath = this._convertClippingPath(clippingPath);
        if (clippingPath != null) {
            this.context.clip(clippingPath);
        }

        this.context.translate(position.x, position.y);
        this.context.rotate(toRadians(rotation));
        this.context.translate(delta.x, delta.y);

        this.context.fillText(text, 0, 0);

        this._setContextTransform();

        this.context.restore();
    }

    measureText(text, fontFamily, fontSize, fontWeight, fontStyle) {
        var currentFont = this.context.font;

        this.context.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

        var size = this.context.measureText(text);

        this.context.font = currentFont;

        return size;
    }
}