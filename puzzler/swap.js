class Swap {
    constructor(n, m) {
        this.n = _min(n, m);
        this.m = _max(n, m);
    }

    includes(x) {
        return this.n == x || this.m == x;
    }

    toString() {
        return `(${this.n}${this.m})`
    }
}