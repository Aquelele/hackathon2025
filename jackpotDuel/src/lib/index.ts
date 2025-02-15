// place files you want to import through the `$lib` alias in this folder.
import { GameState } from "./GameState";
import { FruitEnum } from "./FruitEnum";
export class GameManager {


    score: number = 0;
    time: number
    timeLeft: number;
    element: HTMLDivElement | undefined;

    isrolling: boolean = false;

    state: GameState = GameState.NOT_STARTED;

    lastSpin: number[] = [0, 0, 0];
    lastScore: number = 0;



    constructor(startTime: number) {
        this.timeLeft = startTime;
        this.time = startTime;
        console.log("GameManager created");
    }

    bindElement(element: HTMLDivElement) {
        this.element = element;
    }

    inscreseScore(amount: number) {
        this.score += amount;
        console.log("Score: ", this.score);
    }

    getScore() {
        return this.score;
    }

    startGame() {
        this.state = GameState.RUNNING;
        console.log("Game Started");
    }

    calculeteScore(socre: number[]): number {
        let total = 0;
        let multiplier = 1;
        let first = socre[0];
        let second = socre[1];
        let third = socre[2];

        if (first == second && second == third) {
            multiplier = 100;
            return multiplier * first;
        } else if (first == second || second == third || first == third) {
            multiplier = 10;
            if (first == second || first == third) {
                return multiplier * first;
            } else if (second == third) {
                return multiplier * second;
            } else {
                return multiplier * third;
            }
        }

        if (first > second && first > third) {
            return first;
        }
        if (second > first && second > third) {
            return second;
        }
        if (third > first && third > second) {
            return third;
        }

        return 0; // Default return value if no conditions are met
    }


    async spin() {
        //console.log("Spinning");
        this.isrolling = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let result = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
        console.log("Result: ", result);

        this.lastSpin = result;
        this.lastScore = this.calculeteScore(result);
        console.log("Score: ", this.lastScore);
        this.score += this.lastScore
        //this.score += Math.floor(Math.random() * 100);
        this.isrolling = false;
        //console.log("Spun");
    }

    reset() {
        this.score = 0;
        this.timeLeft = this.time;
        this.state = GameState.NOT_STARTED;
        this.isrolling = false;
        this.lastSpin = [0, 0, 0];
        this.lastScore = 0;
    }


}