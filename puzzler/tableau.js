class Tableau {
    static textSize = 36;
    static gridunit;
    shadow = false;
    constructor(x, y, shape) {
        Tableau.gridunit = Renderer.textWidth("0", Tableau.textSize) * 1.5;
        this.pos = [x, y];
        this.shape = shape;
        this.ord = Array.sum(this.shape);
        this.labels = Array.reshape(Array.range(this.ord, 1), this.shape);
    }

    draw() {
        Renderer.push(this);
        Renderer.translate(...this.pos);
        const gridunit = (this.shadow ? 0.75 : 1) * Tableau.gridunit;
        Renderer.newRenderable(Layers.Tableau, regions => {
            fill(color(this.shadow ? "#CBBFB9" : "#F6F4F3"));
            beginShape();
            vertex(0, 0);
            for (let i = 0; i < this.shape.length; i++) {
                const len = this.shape[i];
                vertex(len * gridunit, i       * gridunit);
                vertex(len * gridunit, (i + 1) * gridunit);
            }
            vertex(0, this.shape.length * gridunit);
            endShape(CLOSE);

            fill("#102542");
            const textsize = (this.shadow ? 0.75 : 1) * Tableau.textSize;
            textSize(textsize);
            for (let i = 0; i < this.labels.length; i++) {
                for (let j = 0; j < this.labels[i].length; j++) {
                    text("" + this.labels[i][j], 2 + j * gridunit * 1.1, 2 + i * gridunit + Renderer.textHeight(textsize) * 0.85);
                }
            }

            if (this.shadow && regions.boundingBox.clicked) {
                console.log("clicked shadow");
            }
        }, Renderer.regionStub("boundingBox", 0, 0, this.shape[0] * gridunit, this.shape.length * gridunit));
        Renderer.pop(this);
    }

    swap(x, y) {
        if (x == y) return false;
        if (x > this.ord || x <= 0 || y > this.ord || y <= 0) {
            console.error("Cannot swap xy with ord:", x, y, this.ord);
            return false;
        }
        for (const row of this.labels) {
            for (let i = 0; i < row.length; i++) {
                const n = row[i];
                if (n == x) {
                    row[i] = y;
                } else if (n == y) {
                    row[i] = x;
                }
            }
        }
        return true;
    }

    clone() {
        const t = new Tableau(this.pos[0], this.pos[1], [...this.shape]);
        t.labels = this.labels.map(l => [...l]);
        return t;
    }

    static labelTranspose(shape) {
        if (!shape || !shape.length) return [];

        let out = shape[0].map(_ => []);
        for (const row of shape) {
            for (let i = 0; i < row.length; i++) {
                const e = row[i];
                out[i].push(e);
            }    
        }
        return out;
    }
}
