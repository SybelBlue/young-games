class SceneManager {
    moveLog = [];
    lastColMode = true;
    static get mainCenterPos() {
        return [windowWidth / 2, windowHeight / 3];
    }

    constructor(shape) {
        this.main = new Tableau(0, 0, shape);
        this.main.centerOn(...SceneManager.mainCenterPos);

        this.target = new Tableau(0, 0, shape);
        this.target.centerOn(windowWidth * 3 / 4, windowHeight / 3)

        this.control = new TableauControl(0, 0, shape, swap => this.log(swap));
        this.control.centerOn(windowWidth / 2, windowHeight * 2 / 3);

        let rowSwaps = [
            this.control.randomRowSwap(),
            this.control.randomRowSwap(),
            this.control.randomRowSwap()
        ];
        let colSwaps = [
            this.control.randomColSwap(),
            this.control.randomColSwap(),
            this.control.randomColSwap()
        ]

        rowSwaps.forEach(swap => this.main.swap(swap));
        colSwaps.forEach(swap => this.main.swap(swap));
        
        this.rho = Swap.composeSwaps(rowSwaps);
        this.gamma = Swap.composeSwaps(colSwaps);

        this.start = this.main.clone();
    }

    draw() {
        Renderer.temporary(this, 0, 0, () => background(color("#276FBF")));
        Renderer.push(this);
        if (!this.won) this.target.draw();
        Renderer.translate(this.won ? windowWidth / 4 : 0, 0);
        this.main.draw()
        Renderer.newRenderable(Layers.Background, () => {
            textSize(30);
            fill(255);
            noStroke();
            text(this.moveLog.length + " move" + (this.moveLog.length == 1 ? "" : "s"), 4, 4 + Renderer.textHeight(30) * 0.8);
            if (!this.won) {
                textSize(24);
                text("Target:", this.target.pos[0] - 4, this.target.pos[1] - 6);
                text("Current:", this.main.pos[0] - 4, this.main.pos[1] - 6);
                text("Controls:", this.control.pos[0] - 4, this.control.pos[1] - 6);
            }
        });
        let i = 0;
        for (const v of this.moveLog.slice().reverse()) {
            const tab = v.shadow;
            Renderer.translate(-1 * this.main.width, 0);
            v.indicator.draw();
            Renderer.translate(-0.8 * this.main.width, 0);
            tab.draw();
            Renderer.newRenderable(Layers.Tableau, _regions => {
                textSize(30);
                fill(255);
                noStroke();
                text("" + (this.moveLog.length - i++), tab.pos[0] - 4, tab.pos[1] - 4);
            });
            if (Renderer.xTranslation < -SceneManager.mainCenterPos[0]) {
                break;
            }
        }
        Renderer.pop(this);

        if (this.won) {
            Renderer.push(this);
            Renderer.translate(...this.control.pos);
            const button = Renderer.newUIButton("Play Again!", color(244, 20, 20), () => location.reload());
            
            Renderer.translate(button.width / 3, button.height + 20);
            const t0 = "Rho: " + Swap.permToString(this.rho);
            const t1 = "Gamma: " + Swap.permToString(this.gamma);
            const t2 = "Sign: " + (Swap.permSign(this.rho) ? "-" : "+") + "1";
            Renderer.newRenderable(Layers.UI, _regions => {
                textSize(20);
                text(t0, -Renderer.textWidth("Rho", 20), 0);
                text(t1, -Renderer.textWidth("Gamma", 20), 30);
                text(t2, -Renderer.textWidth("Sign", 20), 60);
            });
            Renderer.pop(this);
        } else {
            this.control.draw();
        }
    }

    log(swap) {
        const copy = this.main.clone();
        this.main.swap(swap);
        const colMode = this.lastColMode;
        this.lastColMode = this.control.colMode;

        const prev = this.moveLog.find(v => v.shadow.labels == this.main.labels);
        if (exists(prev)) {
            this.returnToPrevious(prev);
            return;
        }
        copy.onClick = () => this.returnToPrevious(copy);
        copy.centerOn(...SceneManager.mainCenterPos);
        
        const arr = new SwapArrow(0, 0, swap);
        arr.centerOn(...SceneManager.mainCenterPos);
        this.moveLog.push({ shadow: copy, indicator: arr, colMode: colMode });

        if (this.main.hasNaturalLabels) {
            this.won = true;
            return;
        }

        if (this.main.labels.every((v, i) => v.every((x, j) => this.start.labels[i][j] == x))) {
            this.moveLog = [];
            this.lastColMode = true;
        }
    }

    returnToPrevious(tab) {
        if (this.won) return;
        const i = this.moveLog.findIndex(v => v.shadow == tab);
        if (i < 0) return;
        this.control.colMode = this.moveLog[i].colMode;
        this.moveLog = this.moveLog.slice(0, i);
        this.main = tab;
        this.main.onClick = null;
        this.lastColMode = !Array.last(this.moveLog) || Array.last(this.moveLog).colMode;
    }
}