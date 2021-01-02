
class Application {
    constructor(canvasId) {
        var that = this;

        this.lastDraw = 0;

        window.addEventListener("mousedown", function (e) { that.mouseDown(e); });
        window.addEventListener("mouseup", function (e) { that.mouseUp(e); });
        window.addEventListener("mousemove", function (e) { that.mouseMove(e); });

        window.addEventListener("keydown", function (e) { that.keyDown(e); });
        window.addEventListener("keyup", function (e) { that.keyUp(e); });

        window.addEventListener("wheel", function (e) { that.scroll(e); });

        window.addEventListener("resize", function (e) { that.resize(e); });

        window.addEventListener("DOMContentLoaded", function () { that.__startApp__(); });

        this.canvasId = canvasId;
        this.resolutionFactor = 4;

        this.time = 0;

        this.canvasSizingWidth = "window";
        this.canvasSizingHeight = "window";

        this.fixedWidth = 500;
        this.fixedHeight = 500;
    }

    __startApp__() {
        this.initialise();

        var that = this;

        requestAnimationFrame(function (timestamp) { that.__mainLoop__(timestamp); });
    }

    __mainLoop__(timestamp) {
        var timeDelta = timestamp - this.lastDraw;

        if (timeDelta > 30) {
            this.update(timeDelta);
            this.draw();

            this.lastDraw = timestamp;
        }

        var that = this;

        requestAnimationFrame(function (timestamp) { that.__mainLoop__(timestamp); });
    }

    get windowInnerWidth() { return window.innerWidth; }
    get windowInnerHeight() { return window.innerHeight; }

    get canvasLeft() { return this.canvas.getBoundingClientRect().left; }
    get canvasRight() { return this.canvas.getBoundingClientRect().right; }
    get canvasTop() { return this.canvas.getBoundingClientRect().top; }
    get canvasBottom() { return this.canvas.getBoundingClientRect().bottom; }

    set canvasWidth(value) { this.canvas.style.width = value + "px"; }
    set canvasHeight(value) { this.canvas.style.height = value + "px"; }

    get width() { return this.canvas.width; }
    set width(value) { this.canvas.width = value; }

    get height() { return this.canvas.height; }
    set height(value) { this.canvas.height = value; }

    updateCanvasProperties() {
        if (this.context == null || this.context == undefined) {
            return;
        }

        if (this.canvasSizingWidth == "fixed") {
            this.width = this.fixedWidth * this.resolutionFactor;
            this.canvasWidth = this.fixedWidth;
        }
        else {
            this.width = this.windowInnerWidth * this.resolutionFactor;
            this.canvasWidth = this.windowInnerWidth;
        }

        if (this.canvasSizingHeight == "fixed") {
            this.height = this.fixedHeight * this.resolutionFactor;
            this.canvasHeight = this.fixedHeight;
        }
        else {
            this.height = this.windowInnerHeight * this.resolutionFactor;
            this.canvasHeight = this.windowInnerHeight;
        }

        this.context.scale(this.resolutionFactor, this.resolutionFactor);
        this.context.resolutionFactor = this.resolutionFactor;
    }

    initialise() {
        this.canvas = document.getElementById(this.canvasId);

        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingQuality = "high";

        this.updateCanvasProperties();
    }

    getPointOnCanvas(e) {
        var x = e.clientX - this.canvasLeft;
        var y = e.clientY - this.canvasTop;

        return v(x, y);
    }

    mouseDown(e) { }

    mouseUp(e) { }

    mouseMove(e) { }

    keyDown(e) { }

    keyUp(e) { }

    scroll(e) { }

    resize(e) { this.updateCanvasProperties(); }

    update(timeDelta) {
        this.time += timeDelta;
        this.context.resolutionFactor = this.resolutionFactor;
    }

    draw() { }
}