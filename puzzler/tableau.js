class Tableau {
    constructor(x, y, shape) {
        this.pos = [x, y];
        this.shape = shape;
        this.labels = Array.range(Array.sum(this.shape))
    }

    draw(shadow=false) {
        
    }

    clone() {
        const t = Tableau(this.pos[0], this.pos[1], this.shape); //.copy
        t.labels = this.labels; //.copy
        return t;
    }
}

// cols first, rows second.

class TableauControl extends Tableau {
    constructor(x, y, shape) {
        this.pos = [x, y];
        this.shape = shape;
    }

    draw() {

    }
}