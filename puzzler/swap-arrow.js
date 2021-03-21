class SwapArrow {
    static arrowWidth = 10;
    static bodyHeight = 3;
    static arrowFlair = 2;
    static arrowHeight = SwapArrow.arrowHeight + 2 * SwapArrow.arrowFlair;
    constructor(x, y, n, m) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.m = m;
    }

    centerOn(x, y) {
        this.pos = [x - SwapArrow.arrowWidth/2, y - SwapArrow.arrowHeight/2];
    }

    draw() {
        Renderer.temporary(this, this.x, this.y, () => {
            fill(color("#F6F4F3"));
            noStroke();
            rect(0, SwapArrow.arrowFlair, SwapArrow.arrowWidth - 4, SwapArrow.bodyHeight);
            triangle(SwapArrow.arrowWidth - 4, 0,
                     SwapArrow.arrowWidth - 4, SwapArrow.arrowHeight,
                     SwapArrow.arrowWidth,     SwapArrow.arrowHeight / 2);
            textSize(24);
            text(`(${this.n} ${this.m})`, 2, Renderer.textHeight(24) * 0.8 + 2);
        })
    }
}