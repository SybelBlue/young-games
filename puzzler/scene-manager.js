class SceneManager {
    log = [];
    static get mainCenterPos() {
        return [windowWidth * 2 / 3, windowHeight / 3];
    }

    constructor(shape) {
        this.main = new Tableau(0, 0, shape);
        this.main.centerOn(...SceneManager.mainCenterPos);
        // scramble main

        this.target = new Tableau(0, 0, shape);
        this.target.centerOn(windowWidth - this.target.width / 2 - 4, windowHeight / 3)

        this.control = new TableauControl(0, 0, shape, swap => this.logSwap(swap));
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
            text(this.log.length / 2 + " move" + (this.log.length == 2 ? "" : "s"), 4, 4 + Renderer.textHeight(30) * 0.8);
        });
        for (let i = this.log.length - 1; i > 0; i-=2) {
            const tab = this.log[i - 1];
            const arr = this.log[i];
            Renderer.translate(-0.5 * this.main.width, 0);
            arr.draw();
            Renderer.translate(-1.1 * this.main.width, 0);
            tab.draw();
            Renderer.newRenderable(Layers.Tableau, _regions => {
                textSize(30);
                fill(255);
                noStroke();
                text("" + ((i + 1) / 2), tab.pos[0] - 4, tab.pos[1] - 4);
            });
            if (Renderer.xTranslation < -SceneManager.mainCenterPos[0]) {
                break;
            }
        }
        Renderer.pop(this);

        this.control.draw();
    }

    logSwap(swap) {
        const copy = this.main.clone();
        this.main.swap(swap[0], swap[1]);
        if (this.main.hasNaturalLabels) {
            this.log = [];
            return;
        }
        const prev = this.log.find(tbOrArr => tbOrArr.labels == this.main.labels);
        if (exists(prev)) {
            this.returnToPrevious(prev);
            return;
        }
        copy.onClick = () => this.returnToPrevious(copy);
        copy.centerOn(...SceneManager.mainCenterPos);
        this.log.push(copy);
        const arr = new SwapArrow(0, 0, swap[0], swap[1]);
        arr.centerOn(...SceneManager.mainCenterPos);
        this.log.push(arr);
    }

    returnToPrevious(tab) {
        const i = this.log.indexOf(tab);
        if (i < 0) return;
        this.log = this.log.slice(0, i);
        this.main = tab;
        this.main.onClick = null;
    }
}