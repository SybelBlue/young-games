let t, tc;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(color("#276FBF"));
    t = new Tableau(30, 30, [3, 2, 1]);
    tc = new TableauControl(80, 200, [3, 2, 1]);
}

function draw() {
    background(color("#276FBF"));
    t.draw();
    tc.draw();
    try {
        const focused = Renderer.renderAll().found;

        if (focused) {
            console.log(focused);
        }
    } catch (e) {
        console.error(e);
    } finally {
        Renderer.clearStack();
        Renderer.clickThisFrame = false;
    }
}

function windowResized() { 
    // resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
    Renderer.clickThisFrame = true;
}
