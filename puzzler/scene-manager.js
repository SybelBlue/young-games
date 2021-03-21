class SceneManager {
    constructor(shape) {
        this.main = new Tableau(0, 0, shape);
        this.main.centerOn(windowWidth * 2 / 3, windowHeight / 3);
        // scramble main

        this.target = new Tableau(0, 0, shape);
        this.target.centerOn(windowWidth - this.target.width / 2 - 4, windowHeight / 3)

        this.control = new TableauControl(0, 0, shape, swap => this.main.swap(...swap));
        this.control.centerOn(windowWidth / 2, windowHeight * 2 / 3)
    }

    draw() {
        background(color("#276FBF"));
        this.main.draw();
        this.target.draw();
        this.control.draw();
    }
}