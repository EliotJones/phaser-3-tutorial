export class CircularBuffer<T> {
    private buffer: T[];
    private buffLen: number;
    private ix = 0;
    private size = 0;

    constructor(length: number) {
        this.buffLen = length;
        this.buffer = new Array(length);
    }

    add(item: T) {
        this.buffer[this.ix] = item;
        this.ix = (this.ix + 1) % this.buffLen;
        this.size = Math.min(this.size + 1, this.buffLen);
    }

    getLast(): T | null {
        if (this.size === 0) {
            return null;
        }
        const lastIndex = (this.ix - 1 + this.buffLen) % this.buffLen;
        return this.buffer[lastIndex];
    }

    getAll(): T[] {
        if (this.size === 0) return [];
        
        const result: T[] = [];
        for (let i = 0; i < this.size; i++) {
            const index = (this.ix - this.size + i + this.buffLen) % this.buffLen;
            result.push(this.buffer[index]);
        }
        return result;
    }

    getSize(): number {
        return this.size;
    }
}