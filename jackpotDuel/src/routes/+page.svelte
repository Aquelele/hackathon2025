<style>
    .gameContainer {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }
    .gameWindow {
        width: 50%;
        height: 100%;
        flex: 1;

    }
    #player1 {
        background-color: white;
    }
    #player2 {
        background-color: white;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';
    import { GameManager } from '$lib/index';
    import { GameState } from '$lib/GameState';
    import { writable } from 'svelte/store';
    class Game {
        p1: GameManager;
        p2: GameManager;

        currentGameState: GameState;

        constructor(/* p1: HTMLDivElement, p2: HTMLDivElement */) {
            this.p1 = new GameManager(60);
            this.p2 = new GameManager(60);

            this.currentGameState = GameState.NOT_STARTED;

            this.handleKeyPress = this.handleKeyPress.bind(this);
        }

        bind(p1: HTMLDivElement, p2: HTMLDivElement) {
            this.p1.bindElement(p1);
            this.p2.bindElement(p2);
        }

        startGame() {
            this.currentGameState = GameState.RUNNING;
        }


        async handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'a') {
                if (!this.p1.isrolling) {
                    p1Rolling.set(true);
                    await this.p1.spin();
                    p1Rolling.set(false);
                    p1Score.set(this.p1.score);
                }
            } else if (event.key === 'l') {
                if (!this.p2.isrolling) {
                    p2Rolling.set(true);
                    await this.p2.spin();
                    p2Rolling.set(false);
                    p2Score.set(this.p2.score);
                }
            }
        }


        gameLoop() {
            if (this.currentGameState === GameState.RUNNING) {
                this.p1.timeLeft--;
                this.p2.timeLeft--;
                p1Time.set(this.p1.timeLeft);
                p2Time.set(this.p2.timeLeft);
                
            }
            // Update the score in the HTML
        }
    }

    let p1Score = writable(0);
    let p1Time = writable(0);
    let p1Rolling = writable(false);
    let p2Score = writable(0);
    let p2Time = writable(0);
    let p2Rolling = writable(false);

    
    let game = new Game();


    onMount(() => {
        let player1 = document.getElementById('player1') as HTMLDivElement;
        let player2 = document.getElementById('player2') as HTMLDivElement;

        game.bind(player1, player2);

        game.startGame();

        window.addEventListener('keyup', game.handleKeyPress);
        setInterval(() => {
            
            game.gameLoop();
        }, 1000);
    });

</script>

<div class="gameContainer">
    <div class="gameWindow" id="player1">
        <h1>P1 SCORE IS {$p1Score}</h1> 
        <h2>P1 time {$p1Time}</h2>
        <h1>ROLLING {$p1Rolling}</h1>
    </div>
    <div class="gameWindow" id="player2">
        <h1>P2 SCORE IS {$p2Score}</h1>
        <h2>P2 time {$p2Time}</h2>
        <h1>ROLLING {$p2Rolling}</h1>
    </div>
</div>
