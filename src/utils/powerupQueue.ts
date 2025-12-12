export default class PowerupQueue {
    private front: number;
    private back: number;
    private queue: Array<string | undefined>;
    private count: number;
    private size: number;

    constructor(capacity: number = 5) {
        this.size = capacity;
        this.front = 0;
        this.back = -1;
        this.count = 0;

        this.queue = new Array(this.size);
    }


    addPowerup(powerup: string): boolean {

        if (this.isFull()) {
            console.warn('Powerup queue is full!');
            return false;
        }

        this.back = (this.back + 1) % this.size;
        this.queue[this.back] = powerup;
        this.count++;
        return true;
    }


    removePowerup(): string | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const powerup = this.queue[this.front];
        this.queue[this.front] = undefined;
        this.front = (this.front + 1) % this.size;
        this.count--;
        return powerup;
    }


    currentPowerup(): string | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.queue[this.front];
    }


    getQueuedPowerups(): string[] {
        if (this.count <= 1) {
            return [];
        }

        const queued: string[] = [];
        let index = (this.front + 1) % this.size; // Skip the first item (currently active)
        let itemsToCheck = this.count - 1; // Don't include the first item

        while (itemsToCheck > 0) {
            const powerup = this.queue[index];
            if (powerup !== undefined) {
                queued.push(powerup);
            }
            index = (index + 1) % this.size;
            itemsToCheck--;
        }

        return queued;
    }


    isEmpty(): boolean {
        return this.count === 0;
    }


    isFull(): boolean {
        return this.count === this.size;
    }


    getCount(): number {
        return this.count;
    }


    getCapacity(): number {
        return this.size;
    }


    clear(): void {
        this.front = 0;
        this.back = -1;
        this.count = 0;
        this.queue = new Array(this.size);
    }


    getQueueState(): {
        front: number;
        back: number;
        count: number;
        size: number;
        items: (string | undefined)[];
    } {
        return {
            front: this.front,
            back: this.back,
            count: this.count,
            size: this.size,
            items: [...this.queue],
        };
    }
}
