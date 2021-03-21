class Swap {
    constructor(n, m) {
        this.n = _min(n, m);
        this.m = _max(m, m);
    }

    toString() {
        return `(${this.n}${this.m})`
    }
}