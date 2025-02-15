export class StatusLight {
    x : number;
    y : number;
    size : number;
    status : boolean;
    context : CanvasRenderingContext2D;

    constructor(context : CanvasRenderingContext2D, startX : number, startY : number, size : number) {
        this.x = startX;
        this.y = startY;
        this.size = size
        this.context = context;
        this.status = false;
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y, size, size);
    }

    update() : void {
        this.context.clearRect(this.x, this.y, this.size, this.size);
        this.context.fillStyle = this.status ? 'red' : 'green';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size/2, 0, 2 * Math.PI);
        this.context.fill();
    }

    toggle() : void {
        this.status = !this.status;
        this.update();
    }
}