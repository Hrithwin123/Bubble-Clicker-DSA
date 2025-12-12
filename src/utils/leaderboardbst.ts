class TreeNode {
    name: string;
    score: number;
    right: TreeNode | null;
    left: TreeNode | null;

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
        this.right = null;
        this.left = null;
    }
}

export default class LeaderBoard {
    private root: TreeNode | null = null;

    addPerson(name: string, score: number): void {
        const newNode = new TreeNode(name, score);
        
        if (this.root === null) {
            this.root = newNode;
            return;
        }
        
        let current: TreeNode | null = this.root;
        let parent: TreeNode | null = null;

        while (current !== null) {
            parent = current;
            if (score < current.score) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        if (parent) {
            if (score < parent.score) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
        }
    }

    private reverseInOrder(node: TreeNode | null, result: Array<{ name: string; score: number }>): void {
        if (node === null) {
            return;
        }
        
        this.reverseInOrder(node.right, result);
        result.push({ name: node.name, score: node.score });
        this.reverseInOrder(node.left, result);
    }

    getLeaderBoard(): Array<{ name: string; score: number }> {
        const result: Array<{ name: string; score: number }> = [];
        this.reverseInOrder(this.root, result);
        return result;
    }
}