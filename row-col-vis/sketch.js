let grid;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(20);

    Renderer.newRenderable(Layers.Debug, function(regions) {
        fill(regions.box.hovering ? 80 : 200);
        rect(20, 20, 20, 20);
    }, Renderer.regionStub("box", 20, 20, 20, 20));
    try {
        const focused = Renderer.renderAll().found;

        // if (Renderer.clickThisFrame) {
        //     if (this.lastFocused && this.lastFocused != focused) {
        //         this.lastFocused.loseFocus && this.lastFocused.loseFocus();
        //     }

        //     this.lastFocused = focused;

        //     if (focused) {
        //         focused.gainFocus && focused.gainFocus();
        //     } else {
        //         SceneManager.tray.loadMachineOptions();
        //     }
        // }
    } catch (e) {
        console.error(e);
    } finally {
        Renderer.clearStack();
    }
}

function windowResized() { 
    // resizeCanvas(windowWidth, windowHeight);
}
