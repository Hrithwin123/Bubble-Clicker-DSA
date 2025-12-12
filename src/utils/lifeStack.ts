
export default class LifeStack {

    private stack : Uint8Array;
    private top : number;


    constructor(size : number) {
        this.stack = new Uint8Array(size);
        this.top = 2;
    }

    addLife(a : number) { 
        this.top++;
        this.stack[this.top] = a;
    }

    removeLife() { 
        this.top--;
    }

    currentLife() { 
        return this.stack[this.top];
    }


}



