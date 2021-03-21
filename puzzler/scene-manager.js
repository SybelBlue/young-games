class SceneManager {
    moveLog = [];
    static get mainCenterPos() {
        return [windowWidth * 2 / 3, windowHeight / 3];
    }

    constructor(shape) {
        this.main = new Tableau(0, 0, shape);
        this.main.centerOn(...SceneManager.mainCenterPos);
        // scramble main

        this.target = new Tableau(0, 0, shape);
        this.target.centerOn(windowWidth - this.target.width / 2 - 4, windowHeight / 3)

        this.control = new TableauControl(0, 0, shape, swap => this.log(swap));
        this.control.centerOn(windowWidth / 2, windowHeight * 2 / 3)
    }

    draw() {
        background(color("#276FBF"));
        this.main.draw();
        this.target.draw();

        Renderer.push(this);
        Renderer.newRenderable(Layers.Background, () => {
            textSize(30);
            fill(255);
            noStroke();
            text(this.moveLog.length / 2 + " move" + (this.moveLog.length == 2 ? "" : "s"), 4, 4 + Renderer.textHeight(30) * 0.8);
        });
        let i = 1;
        for (const v of this.moveLog.slice().reverse()) {
            const tab = v.shadow;
            Renderer.translate(-0.5 * this.main.width, 0);
            v.indicator.draw();
            Renderer.translate(-1.1 * this.main.width, 0);
            tab.draw();
            Renderer.newRenderable(Layers.Tableau, _regions => {
                textSize(30);
                fill(255);
                noStroke();
                text("" + i++, tab.pos[0] - 4, tab.pos[1] - 4);
            });
            if (Renderer.xTranslation < -SceneManager.mainCenterPos[0]) {
                break;
            }
        }
        Renderer.pop(this);

        this.control.draw();
    }

    log(swap) {
        const copy = this.main.clone();
        const colMode = this.main.colMode;
        this.main.swap(swap[0], swap[1]);
        if (this.main.hasNaturalLabels) {
            this.moveLog = [];
            return;
        }
        const prev = this.moveLog.find(v => v.shadow.labels == this.main.labels);
        if (exists(prev)) {
            this.returnToPrevious(prev);
            return;
        }
        copy.onClick = () => this.returnToPrevious(copy);
        copy.centerOn(...SceneManager.mainCenterPos);
        
        const arr = new SwapArrow(0, 0, swap[0], swap[1]);
        arr.centerOn(...SceneManager.mainCenterPos);
        this.moveLog.push({ shadow: copy, indicator: arr, colMode: colMode });
    }

    returnToPrevious(tab) {
        const i = this.moveLog.findIndex(v => v.shadow == tab);
        if (i < 0) return;
        this.moveLog = this.moveLog.slice(0, i);
        this.main = tab;
        this.main.onClick = null;
    }
}