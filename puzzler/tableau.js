class Tableau {
    static textSize = 36;
    static gridunit;
    get shadow() { return exists(this.onClick); }

    get gridunit() {
        return (this.shadow ? 0.75 : 1) * Tableau.gridunit;
    }

    get width() {
        return this.shape[0] * this.gridunit;
    }

    get height() {
        return this.shape.length * this.gridunit;
    }

    get hasNaturalLabels() {
        return this.labels.flatMap(id).every((x, i) => x == i + 1);
    }

    constructor(x, y, shape, onClick) {
        Tableau.gridunit = Renderer.textWidth("0", Tableau.textSize) * 1.5;
        this.pos = [x, y];
        this.shape = shape;
        this.ord = Array.sum(this.shape);
        this.labels = Array.reshape(Array.range(this.ord, 1), this.shape);
        this.cs = Array.cumsum(this.shape);
        this.onClick = onClick;
    }

    draw() {
        Renderer.push(this);
        Renderer.translate(...this.pos);
        Renderer.newRenderable(Layers.Tableau, regions => {
            fill(color(this.shadow ? "#CBBFB9" : "#F6F4F3"));
            if (this.shadow && regions.boundingBox.hovering) {
                stroke(255);
            } else {
                noStroke();
            }
            beginShape();
            vertex(0, 0);
            for (let i = 0; i < this.shape.length; i++) {
                const len = this.shape[i];
                vertex(len * this.gridunit, i       * this.gridunit);
                vertex(len * this.gridunit, (i + 1) * this.gridunit);
            }
            vertex(0, this.shape.length * this.gridunit);
            endShape(CLOSE);

            fill("#102542");
            const textsize = (this.shadow ? 0.75 : 1) * Tableau.textSize;
            textSize(textsize);
            for (let i = 0; i < this.labels.length; i++) {
                for (let j = 0; j < this.labels[i].length; j++) {
                    text("" + this.labels[i][j], 2 + j * this.gridunit * 1.1, 2 + i * this.gridunit + Renderer.textHeight(textsize) * 0.85);
                }
            }

            if (this.shadow && regions.boundingBox.clicked && exists(this.onClick)) {
                this.onClick();
            }
        }, Renderer.regionStub("boundingBox", 0, 0, this.width, this.height));
        Renderer.pop(this);
    }

    swap(s) {
        const x = s.n;
        const y = s.m;
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

    centerOn(x, y) {
        this.pos = [x - this.width/2, y - this.height/2];
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

    static randomRowSwap(labels) {
        if (!exists(labels) || !exists(labels.filter)) return null;

        const nonId = labels.filter(l => l && l.length && l.length > 1);
        
        if (!nonId.length) return null;
        
        const row = random(nonId.flatMap(r => Array(r.length).fill(r)));
        
        if (!row.length) return null;
        
        if (row.length == 2) return new Swap(row[0], row[1]);
        
        const a = random(row);
        const b = random(row.filter(x => x !== a));
        
        return new Swap(a, b);
    }
}
