<template>
    <header class="controls-panel">
        <!-- Falling shapes stats -->
        <div class="shapes-stats">
            <div> 
                Total weight: 
                <span class="shapes-stats__weight"> {{ totalDroppedShapesWeight }} kg </span> 
            </div>
            <div> 
                Momentum: 
                <span class="shapes-stats__weight"> 
                    {{ fallingShapes[0] && fallingShapes[0].weight }} kg 
                </span> 
            </div>
        </div>

        <div>
            <!-- Play / pause btn  -->
            <b-button 
                id         = "play-btn"
                class      = "controls-panel__btn"
                type       = "is-primary" 
                size       = "is-medium"
                :icon-left = "isGamePaused ? 'play' : 'pause'"
                @click     = "toggleSimulation"
            ></b-button>

            <!-- Restart game -->
            <b-button 
                class     = "controls-panel__btn"
                type      = "is-primary" 
                size      = "is-medium"
                icon-left = "refresh"
                @click    = "finishGame"
                outlined
            ></b-button>
        </div>

        <!-- Randomly places shapes stats  -->
        <div class="shapes-stats">
            <div> 
                Total weight: 
                <span class="shapes-stats__weight"> {{ totalRandomShapesWeight }} kg </span> 
            </div>
        </div>
    </header>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { SPACE_KEY } from '@/constants/controls';

    export default {
        computed: {
            ...mapState([ 
                'droppedShapes',
                'fallingShapes',
                'isGamePaused', 
                'randomlyPlacedShapes'
            ]),

            totalDroppedShapesWeight() {
                return this.getTotalWeight(this.droppedShapes);
            },

            totalRandomShapesWeight() {
                return this.getTotalWeight(this.randomlyPlacedShapes);
            }
        },
        created() {
            window.addEventListener('keydown', this.handleSpaceClick);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleSpaceClick);
        },
        methods: {
            ...mapMutations([ 'finishGame', 'toggleSimulation' ]),

            getTotalWeight(shapes = []) {
                return shapes.reduce((total, current) => total += current.weight, 0);
            },

            handleSpaceClick({ keyCode, target }) {
                const playBtn = document.getElementById('play-btn');

                if (keyCode === SPACE_KEY && playBtn !== target) {
                    this.toggleSimulation();
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .controls-panel {
        display         : flex;
        justify-content : space-between;
        flex            : 0 0 6rem;
        padding         : .5rem 1.5rem;
    }

    .controls-panel__btn {
        transition: 300ms ease-out;

        &:first-of-type {
            margin-right: .5rem;
        }
    }

    .shapes-stats {
        font-size: 14px;
    }

    .shapes-stats__weight {
        font-size   : 1rem;
        font-weight : 500;
    }

</style>
