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
        for (let i = this.log.length - 1; i >= 0; i--) {
            const e = this.log[i];
            if (exists(e.draw)) { // tableau
                Renderer.translate(-1.5 * this.main.width, 0);
                e.draw();
            }
            if (Renderer.xTranslation < -SceneManager.mainCenterPos[0]) {
                break;
            }
        }
        Renderer.pop(this);

        this.control.draw();
    }

    logSwap(swap) {
        const copy = this.main.clone();
        copy.shadow = true;
        copy.centerOn(...SceneManager.mainCenterPos);
        this.log.push(copy);
        this.log.push(swap); // replace with arrow object
        this.main.swap(swap[0], swap[1]);
    }
}