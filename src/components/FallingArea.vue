<template>
    <div class="falling-area">
        <shape 
            v-for  = "shape in fallingShapes"
            :key   = "shape.id"
            :shape = "shape"
            :id    = "`falling-shape-${ shape.id }`"
        ></shape>
    </div>
</template>

<script>
    import { mapGetters, mapState, mapMutations } from 'vuex';

    import { LEFT_ARROW_KEY, RIGHT_ARROW_KEY } from '@/constants/controls';
    import { MAX_BENDING_ANGLE, MIN_BENDING_ANGLE, BOARD_HEIGHT } from '@/constants/teeter-totter';
    import { MAX_FALLING_INTERVAL_GAP, MIN_FALLING_INTERVAL_GAP } from '@/constants/shape';

    import Shape from './Shape.vue';

    export default {
        name       : 'FallingArea',
        components : { Shape },
        data() {
            return {
                intervalGap: MAX_FALLING_INTERVAL_GAP,

                intervalId       : null,
                shapeBottomLimit : null
            };
        },
        computed: {
            ...mapGetters([ 'boardBendingAngle', 'isBoardAngleWithinLimits' ]),
            ...mapState([ 'fallingShapes', 'isGamePaused' ]),

            fallingShapeEl() {
                const { id } = this.fallingShapes[0];

                return document.getElementById(`falling-shape-${ id }`);
            }
        },
        mounted() {
            const boardEl = document.querySelector('.teeter-totter__board');

            boardEl.addEventListener('transitionend', this.handleBoardTransitionEnd);
            window.addEventListener('keydown', this.moveFallingShape);

            this.$once('hook:beforeDestroy', () => {
                boardEl.removeEventListener('transitionend', this.handleBoardTransitionEnd);
                window.removeEventListener('keydown', this.moveFallingShape);
            });
        },
        watch: {
            isGamePaused: {
                handler(current) {
                    if (current) {
                        clearInterval(this.intervalId);
                    }
                    else {
                        this.getShapeBottomLimit();
                        this.animateShape();
                    }
                }
            }
        },
        methods: {
            ...mapMutations([ 
                'addDroppedShape',
                'generateShape', 
                'moveShape',
                'toggleSimulation',
                'toggleModal'
            ]),

            animateShape() {
                this.intervalId = setInterval(() => {
                    if (this.fallingShapes[0].top >= this.shapeBottomLimit) {
                        const droppedShape = this.fallingShapes.shift();

                        clearInterval(this.intervalId);
                        
                        this.intervalGap > MIN_FALLING_INTERVAL_GAP && this.intervalGap--;

                        this.addDroppedShape(droppedShape);
                        this.generateShape();
                        this.animateShape(); 
                    }
                    else {
                        this.fallingShapes[0].top += 1;
                        this.fallingShapeEl.style.top = `${ this.fallingShapes[0].top }px`;
                    }
                }, this.intervalGap);
            },

            getShapeBottomLimit() {
                const boardBounds = document.querySelector('.teeter-totter__board').getBoundingClientRect();
                const panelBounds = document.querySelector('.controls-panel').getBoundingClientRect();
                const shapeBounds = this.fallingShapeEl.getBoundingClientRect();

                const pointOnBoard = (this.fallingShapes[0].left 
                    * (boardBounds.bottom - boardBounds.top - BOARD_HEIGHT)) 
                    / 100;

                this.shapeBottomLimit = this.boardBendingAngle >= 0
                    ? boardBounds.top + pointOnBoard - shapeBounds.height - panelBounds.height
                    : boardBounds.bottom - pointOnBoard - shapeBounds.height - panelBounds.height;
            },

            handleBoardTransitionEnd() {
                if (this.isGamePaused) return;

                if (this.isBoardAngleWithinLimits) {
                    this.getShapeBottomLimit();
                }
                else {
                    this.toggleSimulation();
                    this.toggleModal(true);
                    

                    this.intervalGap = MAX_FALLING_INTERVAL_GAP;
                }
            },

            moveFallingShape({ keyCode }) {
                const isArrowKeyPressed = [LEFT_ARROW_KEY, RIGHT_ARROW_KEY].includes(keyCode);

                if (this.isGamePaused || !isArrowKeyPressed) return;

                const shapeWidth = this.fallingShapeEl.getBoundingClientRect().width;
                const areaWidth  = document.querySelector('.falling-area').getBoundingClientRect().width;

                this.moveShape({ 
                    moveLeft : keyCode === LEFT_ARROW_KEY, 
                    width    : (shapeWidth / areaWidth) * 100 
                });
                this.$nextTick(this.getShapeBottomLimit);
            }
        }
    };
</script>

<style lang="scss" scoped>

   .falling-area {
       position : relative;
       flex     : 1 1 50%;
   }
   
</style>
