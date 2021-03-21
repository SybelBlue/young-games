let sm;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    sm = new SceneManager([3, 2, 1]);
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
