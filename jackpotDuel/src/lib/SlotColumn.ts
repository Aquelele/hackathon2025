import {WIDTH, HEIGHT, SPEED, SLOTHEIGHT, SLOTSPACING,SLOTWIDTH,N_SLOW, SYMBOLS} from "$lib/Consts";

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}


export class SlotColumn {
    context: CanvasRenderingContext2D;
    startX: number;
    startY: number;
    winningNumber: number;
    lengthOfWheel: number;
    running: boolean;
    roller: string[] = [];
    x: number = 0;
    y: number = 0;
    speed: number = 0;

    constructor(context: CanvasRenderingContext2D, startX: number, startY: number, winningNumber: number, length: number) {
        this.context = context;
        this.startX = startX;
        this.startY = startY;
        this.winningNumber = winningNumber;
        this.lengthOfWheel = length;
        this.running = false;
        this.roller;
        this.init();
        for (let i = 0; i < 3; i++) {
            this.context.fillText(this.roller[i], this.x, this.y - SLOTHEIGHT * (i-2));
        }
        this.context.clearRect(this.x, 2 * SLOTHEIGHT, SLOTWIDTH, SLOTHEIGHT);
    }

    init(): void {
        this.roller = [];
        this.x = this.startX;
        this.y = this.startY;
        this.speed = SPEED;
        this.context.font = '100px Arial';
        for (let i = 0; i < this.lengthOfWheel; i++) {
            this.roller.push(SYMBOLS[getRandomInt(SYMBOLS.length)]);
        }
        this.roller.push(SYMBOLS[this.winningNumber]);
        this.roller.push(SYMBOLS[getRandomInt(SYMBOLS.length)]);
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