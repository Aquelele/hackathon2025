import { SlotColumn } from "./SlotColumn";

const SLOTWIDTH: number = 150;
const SLOTHEIGHT: number = 150;
const SLOTSPACING: number = 25;
const WIDTH: number = SLOTWIDTH * 3 + SLOTSPACING * 4;
const HEIGHT: number = SLOTHEIGHT * 4;
const N_SLOW: number = 8; // how many fruits before stop
const SPEED: number = 16;


export class SlotMachine {
    res: number[];
    slot1: SlotColumn;
    slot2: SlotColumn;
    slot3: SlotColumn;
    cols: SlotColumn[];
    interval?: number;
    spinning: boolean;
    //statusLight: StatusLight;

    constructor(context: CanvasRenderingContext2D, placement: number) {
        this.res = [2, 0, 1];
        this.slot1 = new SlotColumn(context, placement, 0, this.res[0], 30);
        this.slot2 = new SlotColumn(context, placement + SLOTWIDTH, 0, this.res[1], 45);
        this.slot3 = new SlotColumn(context, placement + 2 * SLOTWIDTH, 0, this.res[2], 60);
        this.cols = [this.slot1, this.slot2, this.slot3];
        this.spinning = false;
        //this.statusLight = new StatusLight(context, placement + SLOTWIDTH * 1.5, HEIGHT - 250, 50);
    }

    isDone(): boolean {
        return this.cols.every(slot => slot.speed === 0);
    }

    async spin(): Promise<void> {
        if (!this.spinning) {
            for (const item of this.cols) {
                //this.statusLight.status = 1;
                item.spin();
                //this.statusLight.update(this.slot1.context);
            }
        }
        const checkInterval: number = window.setInterval(() => {
            this.spinning = !this.isDone();
            if (this.isDone()) {
                //this.statusLight.status = 0;
                //this.statusLight.update(this.slot1.context);
                clearInterval(checkInterval);
            }
        }, 50);
        return
    }

    update(): void {
        this.slot1.update();
        this.slot2.update();
        this.slot3.update();
        //this.statusLight.update(this.slot1.context);
    }
}