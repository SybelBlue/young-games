class Tableau {
    static textSize = 36;
    static gridunit;
    constructor(x, y, shape) {
        Tableau.gridunit = Renderer.textWidth("0", Tableau.textSize) * 1.5;
        this.pos = [x, y];
        this.shape = shape;
        this.labels = Array.reshape(Array.range(Array.sum(this.shape)).map(x => x + 1), this.shape);
    }

    draw(shadow=false) { //todo
        Renderer.push(this);
        Renderer.translate(...this.pos);
        Renderer.newRenderable(Layers.Tableau, _stubs => {
            fill(color("#F6F4F3"));
            beginShape();
            vertex(0, 0);
            for (let i = 0; i < this.shape.length; i++) {
                const len = this.shape[i];
                vertex(len * Tableau.gridunit, i       * Tableau.gridunit);
                vertex(len * Tableau.gridunit, (i + 1) * Tableau.gridunit);
            }
            vertex(0, this.shape.length * Tableau.gridunit);
            endShape(CLOSE);

            fill("#102542");
            textSize(Tableau.textSize);
            for (let i = 0; i < this.labels.length; i++) {
                for (let j = 0; j < this.labels[i].length; j++) {
                    text("" + this.labels[i][j], 2 + j * Tableau.gridunit * 1.1, 2 + i * Tableau.gridunit + Renderer.textHeight(Tableau.textSize) * 0.85);
                }
            }
        });
        Renderer.pop(this);
    }

    clone() {
        const t = Tableau(this.pos[0], this.pos[1], this.shape); //.copy
        t.labels = this.labels; //.copy
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
    constructor(x, y, shape) {
        super(x, y, shape);
        TableauControl.gridPadded = Tableau.gridunit + 15;
        this.rowLabels = this.labels;
        this.colLabels = Tableau.labelTranspose(this.labels);
        this.colMode = true;

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

    draw() {
        Renderer.push(this);
        Renderer.translate(...this.pos);
        if (this.colMode) {
            Renderer.newRenderable(Layers.Controls, regions => {
                stroke(0);
                for (let i = 0; i < this.colLabels.length; i++) {
                    const col = this.colLabels[i];
                    fill(color("#DCD4D0"));
                    rect(i * TableauControl.gridPadded, 0, Tableau.gridunit, col.length * Tableau.gridunit);
                    fill("#102542");
                    textSize(Tableau.textSize);
                    for (let j = 0; j < col.length; j++) {
                        const l = "" + col[j];
                        text(l, 2 + i * TableauControl.gridPadded + Tableau.gridunit * 0.1, 2 + j * Tableau.gridunit + Renderer.textHeight(Tableau.textSize) * 0.85);
                    }
                }
            }, ...this.colRegions.map(r => Renderer.regionStub(r.name, r.x, r.y, r.width, r.height, r.blocking)))
        }
        Renderer.pop(this);
    }
}