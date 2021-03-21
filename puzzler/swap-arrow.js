class SwapArrow {
    static arrowFlair = 4;
    static textSize = 24;
    constructor(x, y, n, m) {
        this.x = x;
        this.y = y;
        this.n = _min(n, m);
        this.m = _max(n, m);
        this.text = "(" + this.n + " " + this.m + ")";
        this.textWidth = Renderer.textWidth(text, SwapArrow.textSize);
        this.textHeight = Renderer.textHeight(SwapArrow.textSize);
        this.bodyWidth = _max(this.textWidth + 4, 8);
        this.bodyHeight = _max(this.textHeight + 4, 3);
        this.arrowWidth = this.bodyWidth + 4;
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
            // fill(color("#F6F4F3"));
            noStroke();
            // rect(0, SwapArrow.arrowFlair, this.bodyWidth, this.bodyHeight);
            // triangle(this.bodyWidth,  0,
            //          this.bodyWidth,  this.arrowHeight,
            //          this.arrowWidth, this.arrowHeight / 2);
            textSize(SwapArrow.textSize);
            fill(color("#102542"))
            text(this.text, 2,this.textHeight * 0.8 + 2);
        });
        Renderer.pop(this);
    }
}