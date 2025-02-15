const SLOTWIDTH: number = 150;
const SLOTHEIGHT: number = 150;
const SLOTSPACING: number = 25;
const WIDTH: number = SLOTWIDTH * 3 + SLOTSPACING * 4;
const HEIGHT: number = SLOTHEIGHT * 4;
const N_SLOW: number = 8; // how many fruits before stop
const SPEED: number = 16;

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}


export class SlotColumn {
    context: CanvasRenderingContext2D;
    startX: number;
    startY: number;
    winningNumber: number;
    lengthOfWheel: number;
    symbols: string[];
    running: boolean;
    roller: string[];
    x: number;
    y: number;
    speed: number;

    constructor(context: CanvasRenderingContext2D, startX: number, startY: number, winningNumber: number, length: number) {
        this.context = context;
        this.startX = startX;
        this.startY = startY;
        this.winningNumber = winningNumber;
        this.lengthOfWheel = length;
        this.symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓', '⭐', '🔔', '🤠', '🤤'];
        this.running = false;
        this.roller = [];
        this.x = startX;
        this.y = startY;
        this.speed = SPEED;
        this.init();
    }

    init(): void {
        this.context.font = '100px Arial';
        for (let i = 0; i < this.lengthOfWheel; i++) {
            this.roller.push(this.symbols[getRandomInt(this.symbols.length)]);
        }
        this.roller.push(this.symbols[this.winningNumber]);
        this.roller.push(this.symbols[getRandomInt(this.symbols.length)]);
    }

    update(): void {
        if (!this.running) {
            return;
        }
        this.context.clearRect(this.x, 0, SLOTWIDTH, HEIGHT);
        this.y = this.y + this.speed;

        const stop_const: number = Math.floor(this.y - this.startY - SLOTHEIGHT * ((this.lengthOfWheel + 1) - N_SLOW) - 40);
        if (stop_const > 0 && stop_const < (N_SLOW + 1) * SLOTHEIGHT) {
            this.speed = Math.max((1 - Math.floor(stop_const / SLOTHEIGHT) / N_SLOW) * SPEED, 0);
        }

        for (let i = 0; i < this.lengthOfWheel + 2; i++) {
            if (this.y < SLOTHEIGHT * (2.5 + i) && this.y > (i - 1) * SLOTHEIGHT) {
                this.context.fillText(this.roller[i], this.x, this.y - SLOTHEIGHT * i);
            }
        }
        this.context.clearRect(this.x, 2 * SLOTHEIGHT, SLOTWIDTH, SLOTHEIGHT);
        if (this.speed === 0) {
            this.running = false;
        }
    }

    spin(): void {
        this.init()
        this.running = true;
    }
}