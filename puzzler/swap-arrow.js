class SwapArrow {
    static arrowFlair = 4;
    static textSize = 24;
    constructor(x, y, swap) {
        this.x = x;
        this.y = y;
        this.swap = swap;
        this.text = swap.toString();
        this.textWidth = Renderer.textWidth(this.text, SwapArrow.textSize);
        this.textHeight = Renderer.textHeight(SwapArrow.textSize);
        this.bodyWidth = _max(this.textWidth + 4, 8);
        this.bodyHeight = 5;
        this.arrowWidth = this.bodyWidth * 6 / 5;
        this.arrowHeight = SwapArrow.arrowFlair * 2 + this.bodyHeight;
    }

    centerOn(x, y) {
        this.x = x - this.arrowWidth/2;
        this.y = y - this.arrowHeight/2;
    }

    draw() {
        Renderer.push(this);
        Renderer.translate(this.x, this.y);
        Renderer.newRenderable(Layers.Tableau, () => {
            fill(color("#F6F4F3"));
            noStroke();
            rect(0, SwapArrow.arrowFlair, this.bodyWidth + 1, this.bodyHeight);
            triangle(this.bodyWidth,  0,
                     this.bodyWidth,  this.arrowHeight,
                     this.arrowWidth, this.arrowHeight / 2);
            textSize(SwapArrow.textSize);
            fill(color("#102542"))
            text(this.text, 4, -2);
        });
        Renderer.pop(this);
    }
}