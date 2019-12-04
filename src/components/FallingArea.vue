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
    import { BOARD_HEIGHT, BOARD_WIDTH } from '@/constants/teeter-totter';

    import Shape from './Shape.vue';

    export default {
        name       : 'FallingArea',
        components : { Shape },
        data() {
            return {
                intervalId       : null,
                shapeBottomLimit : null
            };
        },
        computed: {
            ...mapGetters([ 'boardBendingAngle', 'isBoardAngleWithinLimits' ]),
            ...mapState([ 'fallingIntervalGap', 'fallingShapes', 'isGamePaused' ]),

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
                'toggleModal',
                'updateFallingIntervalGap'
            ]),

            animateShape() {
                this.intervalId = setInterval(() => {
                    if (this.fallingShapes[0].top >= this.shapeBottomLimit) {
                        const droppedShape = this.fallingShapes.shift();

                        clearInterval(this.intervalId);
                        
                        this.addDroppedShape(droppedShape);
                        this.updateFallingIntervalGap();
                        this.generateShape();
                        this.animateShape(); 
                    }
                    else {
                        this.fallingShapes[0].top += 1;
                        this.fallingShapeEl.style.top = `${ this.fallingShapes[0].top }px`;
                    }
                }, this.fallingIntervalGap);
            },

            getShapeBottomLimit() {
                const boardBounds = document.querySelector('.teeter-totter__board').getBoundingClientRect();
                const panelBounds = document.querySelector('.controls-panel').getBoundingClientRect();
                const shapeBounds = this.fallingShapeEl.getBoundingClientRect();

                // Similarity of triangles
                const totterCathet  = boardBounds.bottom - boardBounds.top - BOARD_HEIGHT;
                const similarCathet = (this.fallingShapes[0].left * totterCathet) / BOARD_WIDTH;

                this.shapeBottomLimit = this.boardBendingAngle >= 0
                    ? boardBounds.top + similarCathet - shapeBounds.height - panelBounds.height
                    : boardBounds.bottom - similarCathet - shapeBounds.height - panelBounds.height;
            },

            handleBoardTransitionEnd() {
                if (this.isGamePaused) return;

                if (this.isBoardAngleWithinLimits) {
                    this.getShapeBottomLimit();
                }
                else {
                    this.toggleSimulation();
                    this.toggleModal(true);
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
