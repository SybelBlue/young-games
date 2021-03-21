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

    draw() { //todo
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

// cols first, rows second.

class TableauControl extends Tableau {
    static gridPadded;
    get modeLabels() {
        return this.colMode ? this.colLabels : this.rowLabels;
    }
    constructor(x, y, shape) {
        super(x, y, shape);
        TableauControl.gridPadded = Tableau.gridunit + 15;
        this.rowLabels = this.labels;
        this.colLabels = Tableau.labelTranspose(this.labels);
        this.colMode = true;
        this.lastClickData = this.makeClickData(null);

        this.colRegions = this.colLabels.flatMap((col, i) => col.map(function(v, j) {
            return {
                name: "" + v,
                x: TableauControl.gridPadded * i,
                y: Tableau.gridunit * j,
                width: Tableau.gridunit,
                height: Tableau.gridunit,
            }
        }));

        this.rowRegions = this.colLabels.flatMap((col, i) => col.map(function(v, j) {
            return {
                name: "" + v,
                x: Tableau.gridunit * i,
                y: TableauControl.gridPadded * j,
                width: Tableau.gridunit,
                height: Tableau.gridunit,
                blocking: true,
            }
        }));
    }

    makeClickData(clickStr) {
        if (!exists(clickStr)) {
            return { cancel: null, acceptable: [], transition: [], state: "neutral", swap: null };
        }
        if (clickStr == this.lastClickData.cancel) {
            return { cancel: null, acceptable: [], transition: [], state: "cancelled", swap: null };
        }
        const n = parseInt(clickStr);
        exists(n, true); // throw if n isn't parsed properly
        if (this.lastClickData.acceptable.includes(n)) {
            return { cancel: null, acceptable: [], transition: [], state: "accept", swap: [parseInt(this.lastClickData.cancel), n] };
        }
        if (this.lastClickData.transition.includes(n)) {
            return { cancel: null, acceptable: [], transition: [], state: "transition", swap: [parseInt(this.lastClickData.cancel), n] };
        }
        const secondary = this.colMode ? this.rowLabels : this.colLabels;
        return {
            cancel: clickStr,
            acceptable: this.modeLabels.find(l => l.includes(n)),
            transition: secondary.find(l => l.includes(n)),
            state: "waiting"
        };
    }

    draw() {
        Renderer.push(this);
        Renderer.translate(...this.pos);
        Renderer.newRenderable(Layers.Controls, regions => {
            stroke(0);
            for (let i = 0; i < this.modeLabels.length; i++) {
                const axis = this.modeLabels[i];
                if (this.lastClickData.acceptable == axis) {
                    fill(color("#8CB369"));
                } else if (!this.colMode && this.lastClickData.cancel) {
                    fill(color("#465C69"))
                } else {
                    fill(color("#DCD4D0"));
                }

                if (this.colMode) {
                    rect(i * TableauControl.gridPadded, 0, Tableau.gridunit, axis.length * Tableau.gridunit);
                } else {
                    rect(0, i * TableauControl.gridPadded, axis.length * Tableau.gridunit, Tableau.gridunit);
                }
                textSize(Tableau.textSize);
                noStroke();
                for (let j = 0; j < axis.length; j++) {
                    const n = axis[j];
                    const l = "" + n;
                    if (this.lastClickData.cancel == l) {
                        fill("#F03A47");
                    } else if (this.colMode && this.lastClickData.transition.includes(n)) {
                        fill("#8CB369")
                    } else {
                        fill("#102542");
                    }
                    if (this.colMode) {
                        text(l, 2 + i * TableauControl.gridPadded + Tableau.gridunit * 0.1, 2 + j * Tableau.gridunit + Renderer.textHeight(Tableau.textSize) * 0.85);
                    } else {
                        text(l, 2 + j * Tableau.gridunit + Tableau.gridunit * 0.1, 2 + i * TableauControl.gridPadded + Renderer.textHeight(Tableau.textSize) * 0.85);
                    }
                }
            }

            for (const key in regions) {
                const data = regions[key];
                if (data.clicked) {
                    this.lastClickData = this.makeClickData(key);
                    if (this.lastClickData.state == "transition") {
                        if (this.colMode) {
                            this.colMode = false;
                        } else {
                            this.lastClickData = this.makeClickData(null);
                        }
                    }
                }
            }
        }, ...(this.colMode ? this.colRegions : this.rowRegions).map(r => Renderer.regionStub(r.name, r.x, r.y, r.width, r.height, r.blocking)));
        Renderer.pop(this);
    }
}