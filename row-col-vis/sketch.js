let grid;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);
    grid = new Grid(500, 200);
    
    grid.draw();
}

function draw() {
    try {
        const focused = Renderer.renderAll().found;

        // if (clickThisFrame) {
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
