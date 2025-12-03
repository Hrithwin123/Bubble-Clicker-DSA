export default class PowerupQueue {

    private front : number;
    private back : number;
    private queue : Array<string>;

    constructor(){
        this.front = 0;
        this.back = -1;
        this.queue = new Array();
    }

    addPowerup(powerup : string){ //enqueue
        this.back++;
        this.queue[this.back] = powerup
    }

    removePowerup(){ //dequeue
        this.front++;
    }

    currentPowerup(){ //the front powerup
        return this.queue[this.front]
    }

    getQueuedPowerups(): string[] {
        // Return all powerups from front+1 to back (excluding current)
        if (this.back < this.front) return [];
        return this.queue.slice(this.front + 1, this.back + 1);
    }

    isEmpty(): boolean {
        return this.back < this.front;
    }
}

