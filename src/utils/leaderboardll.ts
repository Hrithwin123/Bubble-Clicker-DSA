
class LeaderBoardNode {
    name: string;
    score: number;
    next: LeaderBoardNode | null;
    prev: LeaderBoardNode | null;

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
        this.next = null;
        this.prev = null;
    }
}

export default class LeaderBoard {
    private start: LeaderBoardNode | null = null;
    private end: LeaderBoardNode | null = null;

    addStart(name: string, score: number) {

        const newNode = new LeaderBoardNode(name, score);

        if (this.start == null) {
            this.start = newNode;
            this.end = newNode;
            return;
        }

        newNode.next = this.start;
        this.start.prev = newNode;
        this.start = newNode;

    }

    addEnd(name: string, score: number) {

        const newNode = new LeaderBoardNode(name, score);

        if (this.end == null) {
            this.start = this.end = newNode;
            return;
        }

        this.end.next = newNode;
        newNode.prev = this.end;
        this.end = newNode;

    }

    deleteStart() {

        if (this.start == null) {
            return;
        }

        if (this.start.next == null) {
            this.start = this.end = null;
            return;
        }

        this.start = this.start.next;
        this.start.prev = null;
    }

    deleteEnd() {
        if (this.end == null) {
            return;
        }

        if (this.end.prev == null) {
            this.start = this.end = null;
            return;
        }

        this.end = this.end.prev;
        this.end.next = null;

    }

    // Insert in sorted order (descending by score)
    insertSorted(name: string, score: number) {
        const newNode = new LeaderBoardNode(name, score);

        // Empty list
        if (this.start === null) {
            this.start = this.end = newNode;
            return;
        }

        // Insert at start if score is highest
        if (score >= this.start.score) {
            newNode.next = this.start;
            this.start.prev = newNode;
            this.start = newNode;
            return;
        }

        // Insert at end if score is lowest
        if (this.end && score <= this.end.score) {
            this.end.next = newNode;
            newNode.prev = this.end;
            this.end = newNode;
            return;
        }

        // Insert in middle - find correct position
        let current: LeaderBoardNode | null = this.start;
        while (current && current.score > score) {
            current = current.next;
        }

        if (current) {
            newNode.next = current;
            newNode.prev = current.prev;
            if (current.prev) {
                current.prev.next = newNode;
            }
            current.prev = newNode;
        }
    }

    // Load from array (from backend) - maintains sorted order
    loadFromArray(entries: Array<{ name: string; score: number }>) {
        this.start = null;
        this.end = null;

        entries.forEach(entry => {
            this.addEnd(entry.name, entry.score);
        });
    }

    getLeaderBoard() {
        let temp = this.start;
        const result = [];

        while (temp) {
            result.push({ name: temp.name, score: temp.score });
            temp = temp.next;
        }

        return result;
    }

    // Get size of leaderboard
    size() {
        let count = 0;
        let temp = this.start;
        while (temp) {
            count++;
            temp = temp.next;
        }
        return count;
    }
}
