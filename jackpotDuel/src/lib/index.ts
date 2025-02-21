// place files you want to import through the `$lib` alias in this folder.
import { GameState } from "./GameState";
import { SlotMachine } from "./SlotMachine";
import { Fireworks } from 'fireworks-js'
import {SYMBOLS} from "$lib/Consts";
import type { Writable } from "svelte/store";


export class GameManager {

    score: number = 0;
    time: number
    timeLeft: number;
    element: HTMLDivElement | undefined;
    animation: HTMLDivElement | undefined;
    isrolling: boolean = false;
    state: GameState = GameState.NOT_STARTED;
    fabio_mul : number = 1;
    lastSpin: number[] = [0, 0, 0];
    lastScore: number = 0;
    machine: SlotMachine;
    fireworksCanvas: HTMLCanvasElement | undefined;
    fireworks: Fireworks | undefined;
    button : string;
    player_obj : Writable;


    constructor(startTime: number, machine: SlotMachine, button : string, player_obj : writable) {
        this.machine = machine
        this.timeLeft = startTime;
        this.time = startTime;
        this.button = button;
        this.player_obj = player_obj;
    }

    bindElement(element: HTMLDivElement) {
        this.element = element;
    }

    bindFireworks(element: HTMLCanvasElement) {
        this.fireworksCanvas = element;

        this.fireworks = new Fireworks(this.fireworksCanvas, { /* options */ });
    }

    inscreseScore(amount: number) {
        this.score += amount;
    }

    getScore() {
        return this.score;
    }

    startGame() {
        this.state = GameState.RUNNING;
    }

    number(score : number[]) {
        let hist = new Array(SYMBOLS.length).fill(0);
        score.forEach(n => {
            hist[n] += 1;
        });
        return hist;
    }

    double(score : number[]) {
        let hist = this.number(score);
        let n = Math.max(...hist)
        return n === 2;
    }

    triple(score : number[]) {
        let hist = this.number(score);
        let n = Math.max(...hist)
        return n === 3;
    }

    multiplier(n : number){
        return this.fabio_mul*Math.pow(10,n-1);
    }

    calculeteScore(score: number[]): number {
        let hist = this.number(score);
        let n = Math.max(...hist);
        if (n>1){
            return this.multiplier(n)*hist.indexOf(n);
        }
        return this.multiplier(n)*Math.max(...score, 0);
    }


    async spin() {
        this.isrolling = true;
        this.machine.reset();
        let result = await this.machine.spin()
        this.isrolling = false;

        this.lastSpin = result;
        this.lastScore = this.calculeteScore(result);
        this.score += this.lastScore

        // 2 x combo
        if (this.lastScore > 9 && this.lastScore < 100 && this.double(this.lastSpin)) {
            this.triggerFlashEffect('flash'); // For 2x flash
        }

        // 3 x combo
        if (this.lastScore > 100 && this.triple(this.lastSpin)) {
            this.triggerFlashEffect('partical'); // For 3x partical
        }

    }

    triggerFlashEffect(type: 'flash' | 'partical') {
        if (this.fireworks) {
            this.fireworks.start();
        }
        if (this.animation) {
            // Add the respective class for the effect
            this.animation.classList.add(type);
    
            // Determine the duration based on the effect type (1.5s * 2 for flash, 1.5s * 3 for partical)
            const duration = type === 'flash' ? 3000 : 4500; // 3s for flash, 4.5s for partical
    
            // Remove the class after the animation completes
            setTimeout(() => {
                this.animation?.classList.remove(type);
            }, duration);
        }
    }

    reset() {
        this.score = 0;
        this.timeLeft = Math.max(this.time,0);
        this.state = GameState.NOT_STARTED;
        this.isrolling = false;
        this.lastSpin = [0, 0, 0];
        this.lastScore = 0;
        if (this.fireworks) {
            this.fireworks.stop(true)
        }
    }
}