import { SlotColumn } from "./SlotColumn";
import {StatusLight} from "./StatusLight";
import {SLOTWIDTH, HEIGHT, SYMBOLS, RIGGING} from "$lib/Consts";

export class SlotMachine {
    res: number[];
    slot1: SlotColumn;
    slot2: SlotColumn;
    slot3: SlotColumn;
    cols: SlotColumn[];
    interval?: number;
    spinning: boolean;
    statusLight: StatusLight;

    constructor(context: CanvasRenderingContext2D, placement: number) {

        // Generate 3 random numbers between 20 and 90 and store them in a new variable
        this.res = this.generateRandomNumbers();

        // Sort the random numbers so the lowest is first, mid is second, and largest is third
        this.res.sort((a, b) => a - b);

        this.slot1 = new SlotColumn(context, placement, 0, this.res[0], this.res[0]);
        this.slot2 = new SlotColumn(context, placement + SLOTWIDTH, 0, this.res[1], this.res[1]);
        this.slot3 = new SlotColumn(context, placement + 2 * SLOTWIDTH, 0, this.res[2], this.res[2]);

        this.cols = [this.slot1, this.slot2, this.slot3];
        this.spinning = false;
        this.statusLight = new StatusLight(context, placement + SLOTWIDTH * 1.5, HEIGHT - 250, 50);
    }

    // Helper function to generate 3 random numbers between 20 and 90
    private generateRandomNumbers(): number[] {
        const numbers: number[] = [];
        for (let i = 0; i < 3; i++) {
            numbers.push(this.getRandomNumber(20, 90));
        }
        return numbers;
    }

    // Helper function to generate a random number between min and max (inclusive)
    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    not_spinning(): boolean {
        return this.cols.every(slot => slot.speed === 0);
    }

    init_spin_checker() : void {
        let checkInterval: number = window.setInterval(() => {
            this.spinning = !this.not_spinning();
            if (this.not_spinning()) {
                this.statusLight.toggle();
                clearInterval(checkInterval);
            }
        }, 50);
    }

    async spin(): Promise<number[]> {
        //initialize to know when done
        this.init_spin_checker();
        this.statusLight.toggle();
        //spin each wheel
        this.cols.forEach(col => {
            col.spin();
        });
        //wait till stop spinning
        while (!this.not_spinning()) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        //return result
        return this.res;
    }

    update(): void {
        //update columns each tick
        this.cols.forEach(col => {
            col.update()
        });
        //update statuslight
        this.statusLight.update();
    }

    reset(): void {
        //get new result
        this.res = RIGGING[Math.floor(Math.random() * RIGGING.length)];
        //this.res = [this.getRandomNumber(0, SYMBOLS.length -1), this.getRandomNumber(0, SYMBOLS.length -1), this.getRandomNumber(0, SYMBOLS.length -1)]
        //this.res = [Math.floor(Math.random() * SYMBOLS.length), Math.floor(Math.random() * SYMBOLS.length), Math.floor(Math.random() * SYMBOLS.length)];
        //update each column
        this.cols.forEach((col, index) => {
            col.winningNumber = this.res[index];
            col.init()
        });
    }
}