import { SlotColumn } from "./SlotColumn";
import {StatusLight} from "./StatusLight";
import {SLOTWIDTH, HEIGHT} from "$lib/Consts";

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
        this.res = [0, 0, 0];
        this.slot1 = new SlotColumn(context, placement, 0, this.res[0], 30);
        this.slot2 = new SlotColumn(context, placement + SLOTWIDTH, 0, this.res[1], 45);
        this.slot3 = new SlotColumn(context, placement + 2 * SLOTWIDTH, 0, this.res[2], 60);
        this.cols = [this.slot1, this.slot2, this.slot3];
        this.spinning = false;
        this.statusLight = new StatusLight(context, placement + SLOTWIDTH * 1.5, HEIGHT - 250, 50);
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
        if (this.spinning){
            return [];
        }
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
        this.res = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
        //update each column
        this.cols.forEach((col, index) => {
            col.winningNumber = this.res[index];
            col.init()
        });
    }
}