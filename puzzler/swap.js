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

    map(x) {
        switch (x) {
            case this.n:
                return this.m;
            case this.m:
                return this.n;
            default:
                return x;
        }
    }

    get permForm() { return [this.n, this.m]; }

    // performs a * b
    // ie compose((1 2), (2 3)) = (1 2 3)
    //    compose((2 3), (1 2)) = (1 3 2)
    static compose(a, b) {
        let nums = 2;
        if (!a.includes(b.n)) nums++;
        if (!a.includes(b.m)) nums++;

        if (nums == 2) {
            return [[1]]
        }
        if (nums == 4) {
            return a.n < b.n ? [a.permForm, b.permForm] : [b.permForm, a.permForm];
        }
        const first = _min(a.n, b.n);
        let out = [first];
        let next = a.map(b.map(first));
        out.push(next);
        next = a.map(b.map(next));
        out.push(next);
        return [out];
    }

    // takes a perm
    // and returns an array of swaps that when composed,
    // returns the perm
    static intoSwaps(perm) {
        return perm.flatMap(simplePerm => {
            if (simplePerm.length == 1) return [];
            let out = [];
            for (let i = 0; i < simplePerm.length - 1; i++) {
                const a = simplePerm[i];
                const b = simplePerm[i + 1];
                out.push(new Swap(a, b));
            }
            return out;
        });
    }

    static applyAll(swaps, x) {
        return swaps.reduceRight((p, s) => s.map(p), x);
    }
    
    static composePerms(a, b) {
        const swaps = [...Swap.intoSwaps(a), ...Swap.intoSwaps(b)];
        const ord = max(swaps.map(s => s.m));
        const maps = Array.range(ord, 1).map(x => Swap.applyAll(swaps, x));

        let checked = new Array(ord).fill(false);
        let out = [];
        for (let i = 0; i < checked.length; i++) {
            if (checked[i]) continue;

            const start = i + 1;
            let simpleCycle = [start];
            
            let next = maps[start - 1];
            checked[next - 1] = true;
            
            if (next == start) continue; // reject identity
            out.push(simpleCycle);

            while (next != start) {
                simpleCycle.push(next);
                next = maps[next - 1];
                checked[next - 1] = true;
            }
        }

        return out.length > 0 ? out : [[1]];
    }
}