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