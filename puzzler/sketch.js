let sm;

function setup() {
    createCanvas(windowWidth, windowHeight);

    const shapes = [
        [3, 2, 1],
        [4, 4],
        [3, 3],
        [2, 2, 2, 2]
    ];
    
    sm = new SceneManager(random(shapes));
}

function draw() {
    sm.draw();
    
    try {
        const focused = Renderer.renderAll().found;
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
