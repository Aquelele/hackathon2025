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
        background-image: url("casino.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-position-y: -70px;
        color: white;
        
    }

    #fabio {
        width: 10%;
        height: 20%;
        position: absolute;
        left : 45%;
        top : 25%;
        background-image: url("fabio_caged.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        z-index: 30;
    }

    #fabio_uncaged {
        width: 10%;
        height: 20%;
        position: absolute;
        left : 45%;
        top : 25%;
        background-image: url("fabio_uncaged.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        z-index: 31;
    }

    .overlay {
        color: white;
        display: none;
        flex-direction: column;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -15%);
        position: fixed;
        width: 50%;
        height: 50%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 100;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
    }

    /* Flash: 2 cycles */
    :global(.flash) {
        animation: flashAnimation 1.5s ease 0s 2;
    }

    /* Partical: 3 cycles */
    :global(.partical) {
        animation: particalAnimation 1.5s ease 0s 3;
    }

    @keyframes flashAnimation {
    0% { background-color: rgb(58, 65, 72); background-color: rgb(28, 127, 51);}
    25% { background-color: rgb(28, 127, 51); background-color: rgb(58, 65, 72);}
    75% { background-color: rgb(58, 65, 72); background-color:rgb(28, 127, 51);}
    100% { background-color: rgb(28, 127, 51); background-color:rgb(58, 65, 72);}
    }

    @keyframes particalAnimation {
        0% { background-color: rgb(58, 65, 72); background-color: black;}
        25% { background-color: black; background-color: white;}
        50% { background-color: white; background-color: black;}
        75% { background-color: black; background-color: red;}
        100% { background-color: red; background-color: rgb(58, 65, 72);}
    }

    .fireworksContainer {
        position: fixed;
        display: flex;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .fireworks {
        width: 50%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .canvasHolder {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .background {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -10;
    }

    .comboAnimtion {
        position: absolute;
        width: 50%;
        height: 50%;
        top: 0;
        left: 0;
        z-index: -20;
    }

    #p2Animation {
        left: 50%;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';
    import { GameManager } from '$lib/index';
    import { GameState } from '$lib/GameState';
    import { writable, type Writable } from 'svelte/store';
    import { SlotMachine } from '$lib/SlotMachine';
    import {WIDTH, HEIGHT, TIMESTEP, SYMBOLS, GAMETIME,
        JACKPOT2XVOL,JACKPOT3XVOL, WINSOUNDVOL, BACKGROUNDVOL
    } from "$lib/Consts";
    import { Confetti } from "svelte-confetti"
    // Sound variables
    let backgroundMusic: HTMLAudioElement;
    let winSound: HTMLAudioElement;
    let jackpot2x: HTMLAudioElement;
    let jackpot3x: HTMLAudioElement;
    let fabio_sound: HTMLAudioElement;

    let showConfetti = false;


    let p1Score = writable(0);
    let p1Time = writable(0);
    let p1Rolling = writable(false);
    let p1GameState = writable("NOT STARTED");
    let p1LastResult = writable("[ __ __ __ ]");
    let p1LastScore = writable(0);

    let p2Score = writable(0);
    let p2Time = writable(0);
    let p2Rolling = writable(false);
    let p2GameState = writable("NOT STARTED");
    let p2LastResult = writable("[ __ __ __ ]");
    let p2LastScore = writable(0);
    
    let overlay: HTMLDivElement;
    let p1fireworks: HTMLCanvasElement;
    let p2fireworks: HTMLCanvasElement;
    let players: NodeListOf<HTMLElement>;

    let fabioUnCaged: boolean = false;
    let fabioElement : HTMLElement;

    let fabioId = writable("fabio");

    class Game {
        playerList: GameManager[];
        currentGameState: GameState;

        async handleKey(
            gm :  GameManager, 
            score : Writable,
            time : Writable,
            rolling : Writable,
            gameState : Writable,
            lastResult : Writable,
            lastScore : Writable,
            ) {
            if (!gm.isrolling && gm.state === GameState.RUNNING) {
                rolling.set(true);
                await gm.spin();
                rolling.set(false);

                // 2 x combo
                if (gm.double(gm.lastSpin)) {
                    winSound.play();
                    jackpot2x.play();
                }

                // 3 x combo
                if (gm.triple(gm.lastSpin)) {
                    winSound.play();
                    jackpot3x.play();
                }

                //Fabio
                if(gm.score >= 20){
                    if(!(fabioUnCaged)){
                        fabio_sound.play();
                        fabioId.set("fabio_uncaged");
                        fabioUnCaged = true;
                        gm.fabio_mul = 2;
                        fabio_sound.play();

                        showConfetti = true;
                        // Optionally, hide confetti after a duration
                        setTimeout(() => {
                        showConfetti = false;
                        }, 3000); // Confetti will be visible for 3 seconds

                    }
                }

                score.set(gm.score);
                let spin_emojis = "[";
                gm.lastSpin.forEach(element => {
                    spin_emojis += SYMBOLS[element];
                });
                spin_emojis += "]";
                lastResult.set(spin_emojis);
                lastScore.set(gm.lastScore);
            }
        }
        
        async handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'a') {
                let pl = this.playerList[0];
                this.handleKey(pl, p1Score,p1Time,p1Rolling,p1GameState,p1LastResult,p1LastScore);
            } if (event.key === 'l') {
                let pl = this.playerList[1];
                this.handleKey(pl, p2Score,p2Time,p2Rolling,p2GameState,p2LastResult,p2LastScore);
            }
        }

        constructor(players : NodeListOf<HTMLElement>) {
            this.playerList = [];
            players.forEach((canvas: HTMLElement, index: number) => {
                const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d')!;
                const button: string = context.canvas.id;
                context.canvas.width = WIDTH;
                context.canvas.height = HEIGHT;
                let sl = new SlotMachine(context, 25);
                this.playerList.push(new GameManager(GAMETIME,sl))
            });
            
            this.handleKeyPress = this.handleKeyPress.bind(this);
            window.addEventListener('keyup', this.handleKeyPress);
            
            setInterval(() => {
                this.playerList.forEach(machine => {
                    machine.machine.update();
                });
                this.gameLoop();
            }, TIMESTEP);
            this.currentGameState = GameState.NOT_STARTED;
        }

        bind(p1: HTMLDivElement, p2: HTMLDivElement, p1fireworks: HTMLCanvasElement, p2fireworks: HTMLCanvasElement) {
            this.playerList[0].bindElement(p1);
            this.playerList[1].bindElement(p2);
            this.playerList[0].bindFireworks(p1fireworks);
            this.playerList[1].bindFireworks(p2fireworks);

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
            for (let player of this.playerList) {
                player.startGame();
            }
            overlay.style.display = "none";

            // Play background music
            backgroundMusic.play();
        }

        resetGame() {
            this.playerList[0].reset();
            this.playerList[1].reset();
            fabioUnCaged = false;

            p1Score.set(this.playerList[0].score);
            p1Time.set(this.playerList[0].timeLeft);
            p1Rolling.set(this.playerList[0].isrolling);
            p1GameState.set("NOT STARTED");
            p1LastResult.set("[ __ __ __ ]");
            p1LastScore.set(this.playerList[0].lastScore);

            p2Score.set(this.playerList[1].score);
            p2Time.set(this.playerList[1].timeLeft);
            p2Rolling.set(this.playerList[1].isrolling);
            p2GameState.set("NOT STARTED");
            p2LastResult.set("[ __ __ __ ]");
            p2LastScore.set(this.playerList[1].lastScore);

            // Stop and reset background music
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }

        gameLoop() {
            if (this.currentGameState === GameState.RUNNING) {
                this.playerList.forEach(player => {
                   if (player.timeLeft <= 0 && !player.isrolling) {
                        player.state = GameState.OVER;
                   } else if (player.timeLeft > 0) {
                        player.timeLeft -= 1/(10*TIMESTEP);
                   }
                });
                if (this.playerList[0].state === GameState.OVER && this.playerList[1].state === GameState.OVER) {
                    winSound.play();
                    overlay.style.display = "flex";
                    let gameover = document.createElement('h1');
                    gameover.innerHTML = "Game Over";
                    overlay.appendChild(gameover);
                    let p1Score = document.createElement('h2');
                    p1Score.innerHTML = "P1 Score: " + this.playerList[0].score;
                    overlay.appendChild(p1Score);
                    let p2Score = document.createElement('h2');
                    p2Score.innerHTML = "P2 Score: " + this.playerList[1].score;
                    overlay.appendChild(p2Score);
                    let winner = document.createElement('h2');
                    winner.innerHTML = "Winner is: " + (this.playerList[0].score > this.playerList[1].score ? "P1" : "P2");
                    overlay.appendChild(winner);
                    let restart = document.createElement('button');
                    restart.innerHTML = "Restart";
                    restart.onclick = () => {
                        this.resetGame();
                        overlay.innerHTML = "";
                        this.startGame();
                    }
                    overlay.appendChild(restart);
                    this.currentGameState = GameState.OVER;
                }

                p1Time.set(Math.floor(this.playerList[0].timeLeft));
                p2Time.set(Math.floor(this.playerList[1].timeLeft));
                p1GameState.set((this.playerList[0].state === GameState.OVER ? "OVER" : "GAMIN"));
                p2GameState.set((this.playerList[1].state === GameState.OVER ? "OVER" : "GAMIN"));
            }
            // Update the score in the HTML
        }
    }




    onMount(() => {

        // Initialize sounds 
        backgroundMusic = new Audio("bg.mp3");
        backgroundMusic.loop = true;
        winSound = new Audio("jackpot.mp3"); 
        jackpot2x = new Audio("2x.mp3");
        jackpot3x = new Audio("3x.mp3");
        fabio_sound = new Audio("fabio.mp3");

        // Boost volume
        backgroundMusic.volume = BACKGROUNDVOL; // 1.5x volume
        winSound.volume = WINSOUNDVOL; // 2x volume
        jackpot2x.volume = JACKPOT2XVOL;
        jackpot3x.volume = JACKPOT3XVOL;
        
        p1fireworks = document.getElementById('p1fireworks') as HTMLCanvasElement;
        p2fireworks = document.getElementById('p2fireworks') as HTMLCanvasElement;
        
        let player1 = document.getElementById('player1') as HTMLDivElement;
        let player2 = document.getElementById('player2') as HTMLDivElement;
        
        let p1Animation = document.getElementById('p1Animation') as HTMLDivElement;
        let p2Animation = document.getElementById('p2Animation') as HTMLDivElement;
        
        overlay = document.getElementById('overlay') as HTMLDivElement;
        
        players = document.querySelectorAll(".Player");
        let game = new Game(players);
        
        game.bind(player1, player2, p1fireworks, p2fireworks);
        
        game.playerList[0].animation = p1Animation;
        game.playerList[1].animation = p2Animation;

        game.startGame();

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
        document.body.appendChild(script);


    });
</script>


<div class="overlay" id="overlay">
</div>
<div class="fireworksContainer">
    <canvas class="fireworks" id="p1fireworks"></canvas>
    <canvas class="fireworks" id="p2fireworks"></canvas>
</div>
<div style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;">
 <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration=5000 amount=100 fallDistance="100vh" />
</div>

{#if showConfetti}
<div
style="
position: absolute;
top: 45vh;
left: 45%;
height: 10vh;
width: 10vw;">
<Confetti noGravity x={[-1, 1]} y={[-1, 1]} delay={[0, 50]} duration=1000 colorRange={[0, 120]} />
<Confetti noGravity x={[-1, 1]} y={[-1, 1]} delay={[550, 550]} duration=1000 colorRange={[120, 240]} />
<Confetti noGravity x={[-1, 1]} y={[-1, 1]} delay={[1000, 1050]} duration=1000 colorRange={[240, 360]} />
</div>
{/if}


<div class="gameContainer">
    <div class="gameWindow" id="player1">
        <div class="comboAnimtion" id="p1Animation"></div>
        <h1>Money :  {$p1Score} SEK</h1> 
        <h2>Time {$p1Time}</h2>
        <h1>Last result: {$p1LastResult} : {$p1LastScore} SEK</h1>
        <div class="canvasHolder">
            <canvas class="Player" id="a"></canvas>
        </div>
        
    </div>
    <div class="gameWindow" id="player2">
        <div class="comboAnimtion" id="p2Animation"></div>
        <h1>Money : {$p2Score} SEK</h1>
        <h2>Time : {$p2Time}</h2>
        <h1>Last result: {$p2LastResult} : {$p2LastScore} SEK</h1>
        <div class="canvasHolder">
            <canvas class="Player" id="l"></canvas>
            
        </div>
    </div>

    <div class="fabio" id={$fabioId} bind:this={fabioElement}>
    </div>
    
</div>
<div class="payments">
    <!-- PayPal Button Container -->
    <div class="paypal-button-container">
        <div id="paypal-button-container"></div>
    </div>
    <!-- Swish QR Code -->
    <div class="swish-container">
        <img src="https://luftdata.se/forening/swish/swish.png" alt="Swish QR Code" style="width: 150px; height: auto;">
    </div>
</div>
