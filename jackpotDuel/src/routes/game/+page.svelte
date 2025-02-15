<style>
    .gameContainer {
        width: 100%;
        height: 70%;
        display: flex;
        flex-direction: row;
    }
    .gameWindow {
        width: 50%;
        height: 100%;
        flex: 1;
        margin: 10px 50px 0 50px;

    }
    #player1 {
        background-color: lightblue;
    }
    #player2 {
        background-color: orchid;
    }

    .overlay {
        display: none;
        flex-direction: column;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -15%);
        position: fixed;
        width: 50%;
        height: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 100;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
    }

</style>

<script lang="ts">
    import { onMount } from 'svelte';
    import { GameManager } from '$lib/index';
    import { GameState } from '$lib/GameState';
    import { writable } from 'svelte/store';
    import { SlotMachine } from '$lib/SlotMachine';



    const timeStep = 10;

    const gameTime = 30;

    class Game {
        p: GameManager[];
        p1: GameManager;
        p2: GameManager;

        currentGameState: GameState;

        constructor(m1: SlotMachine, m2: SlotMachine) {
            this.p1 = new GameManager(gameTime, m1);
            this.p2 = new GameManager(gameTime, m2);

            this.p = [this.p1, this.p2];

            this.currentGameState = GameState.NOT_STARTED;

            this.handleKeyPress = this.handleKeyPress.bind(this);
        }

        bind(p1: HTMLDivElement, p2: HTMLDivElement) {
            this.p1.bindElement(p1);
            this.p2.bindElement(p2);
        }

        async startGame() {
            overlay.style.display = "flex";
            overlay.innerHTML = "<h1>Game Starting in 3</h1>";

            await new Promise((resolve) => setTimeout(resolve, 1000));
            overlay.innerHTML = "<h1>Game Starting in 2</h1>";

            await new Promise((resolve) => setTimeout(resolve, 1000));
            overlay.innerHTML = "<h1>Game Starting in 1</h1>";

            await new Promise((resolve) => setTimeout(resolve, 1000));
            overlay.innerHTML = "<h1>Game Starting</h1>";

            this.currentGameState = GameState.RUNNING;
            for (let player of this.p) {
                player.startGame();
            }
            overlay.style.display = "none";
        }


        async handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'a') {
                if (!this.p1.isrolling && this.p1.state === GameState.RUNNING) {
                    p1Rolling.set(true);

                    await this.p1.spin();

                    p1Rolling.set(false);
                    p1Score.set(this.p1.score);
                    p1LastResult.set(this.p1.lastSpin);
                    p1LastScore.set(this.p1.lastScore);
                }
            } if (event.key === 'l') {
                if (!this.p2.isrolling && this.p2.state === GameState.RUNNING) {
                    p2Rolling.set(true);

                    await this.p2.spin();

                    p2Rolling.set(false);
                    p2Score.set(this.p2.score);
                    p2LastResult.set(this.p2.lastSpin);
                    p2LastScore.set(this.p2.lastScore);
                }
            }
        }

        resetGame() {
            this.p1.reset();
            this.p2.reset();

            p1Score.set(this.p1.score);
            p1Time.set(this.p1.timeLeft);
            p1Rolling.set(this.p1.isrolling);
            p1GameState.set("NOT STARTED");
            p1LastResult.set(this.p1.lastSpin);
            p1LastScore.set(this.p1.lastScore);

            p2Score.set(this.p2.score);
            p2Time.set(this.p2.timeLeft);
            p2Rolling.set(this.p2.isrolling);
            p2GameState.set("NOT STARTED");
            p2LastResult.set(this.p2.lastSpin);
            p2LastScore.set(this.p2.lastScore);

        }

        gameLoop() {
            if (this.currentGameState === GameState.RUNNING) {
                this.p.forEach(player => {
                   if (player.timeLeft <= 0 && !player.isrolling) {
                        console.log("Player Time is up");
                        player.state = GameState.OVER;
                   } else if (player.timeLeft > 0) {
                        player.timeLeft -= 1/(10*timeStep);
                   }
                });
                if (this.p1.state === GameState.OVER && this.p2.state === GameState.OVER) {
                    overlay.style.display = "flex";
                    let gameover = document.createElement('h1');
                    gameover.innerHTML = "Game Over";
                    overlay.appendChild(gameover);
                    let p1Score = document.createElement('h2');
                    p1Score.innerHTML = "P1 Score: " + this.p1.score;
                    overlay.appendChild(p1Score);
                    let p2Score = document.createElement('h2');
                    p2Score.innerHTML = "P2 Score: " + this.p2.score;
                    overlay.appendChild(p2Score);
                    let winner = document.createElement('h2');
                    winner.innerHTML = "Winner is: " + (this.p1.score > this.p2.score ? "P1" : "P2");
                    overlay.appendChild(winner);
                    let restart = document.createElement('button');
                    restart.innerHTML = "Restart";
                    restart.onclick = () => {
                        this.resetGame();
                        overlay.innerHTML = "";
                        this.startGame();
                    }
                    overlay.appendChild(restart);

                    console.log("Game Over");
                    console.log("P1 Score: " + this.p1.score);
                    console.log("P2 Score: " + this.p2.score);
                    console.log("Winner is: " + (this.p1.score > this.p2.score ? "P1" : "P2"));
                    this.currentGameState = GameState.OVER;
                }

                p1Time.set(Math.floor(this.p1.timeLeft));
                p2Time.set(Math.floor(this.p2.timeLeft));
                p1GameState.set((this.p1.state === GameState.OVER ? "OVER" : "GAMIN"));
                p2GameState.set((this.p2.state === GameState.OVER ? "OVER" : "GAMIN"));
            }
            // Update the score in the HTML
        }
    }

    let p1Score = writable(0);
    let p1Time = writable(0);
    let p1Rolling = writable(false);
    let p1GameState = writable("NOT STARTED");
    let p1LastResult = writable([0]);
    let p1LastScore = writable(0);

    let p2Score = writable(0);
    let p2Time = writable(0);
    let p2Rolling = writable(false);
    let p2GameState = writable("NOT STARTED");
    let p2LastResult = writable([0]);
    let p2LastScore = writable(0);

    let overlay: HTMLDivElement



    let game = new Game();

    let p: NodeListOf<HTMLElement>


    onMount(() => {
        p = document.querySelectorAll(".Player");

        p.forEach((canvas: HTMLElement, index: number) => {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d')!;
            const button: string = context.canvas.id;
            context.canvas.width = WIDTH;
            context.canvas.height = HEIGHT;
            machines.push(new SlotMachine(context, 0));
            btns.push(button);
        });


        let player1 = document.getElementById('player1') as HTMLDivElement;
        let player2 = document.getElementById('player2') as HTMLDivElement;

        overlay = document.getElementById('overlay') as HTMLDivElement;

        game.bind(player1, player2);

        game.startGame();



        window.addEventListener('keyup', game.handleKeyPress);
        setInterval(() => {
            machines.forEach(machine => {
                machine.update();
            });

            game.gameLoop();
        }, timeStep);

        // Load PayPal SDK
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=ATbaGjuzdgH-5iIoHHgXu66wqjCQmWXF8WQyWE0dh0SFifPujo7XfOwH3L6gTx_6ExMnJ_F8TUQMGQck&currency=USD`;
        script.onload = () => {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '10.00' // Set the payment amount
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                        // You can add additional logic here, like updating your database
                    });
                }
            }).render('#paypal-button-container');
        };
        document.body.appendChild(script)



    });

    const SLOTWIDTH: number = 150;
    const SLOTHEIGHT: number = 150;
    const SLOTSPACING: number = 25;
    const WIDTH: number = SLOTWIDTH * 3 + SLOTSPACING * 4;
    const HEIGHT: number = SLOTHEIGHT * 4;
    const N_SLOW: number = 8; // how many fruits before stop
    const SPEED: number = 16;


    const machines: SlotMachine[] = [];
    const btns: string[] = [];



</script>



<div class="overlay" id="overlay">
</div>
<div class="gameContainer">
    <div class="gameWindow" id="player1">
        <h1>P1 SCORE IS {$p1Score}</h1> 
        <h2>P1 time {$p1Time}</h2>
        <h1>ROLLING {$p1Rolling}</h1>
        <h1>GameState {$p1GameState}</h1>
        <h1>last result: {$p1LastResult}, Score: {$p1LastScore}</h1>
        <canvas class="Player" id="a"></canvas>
    </div>
    <div class="gameWindow" id="player2">
        <h1>P2 SCORE IS {$p2Score}</h1>
        <h2>P2 time {$p2Time}</h2>
        <h1>ROLLING {$p2Rolling}</h1>
        <h1>GameState {$p2GameState}</h1>
        <h1>last result: {$p2LastResult}, Score: {$p2LastScore}</h1>
        <canvas class="Player" id="l"></canvas>
    </div>
    
</div>
<div class="payments">
    <!-- PayPal Button Container -->
    <div class="paypal-button-container">
        <div id="paypal-button-container"></div>
    </div>
</div>
