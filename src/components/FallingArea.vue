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
    import { MAX_BENDING_ANGLE, MIN_BENDING_ANGLE } from '@/constants/teeter-totter-params';
    import { 
        FALLING_SHAPE_TOP_POINT,
        MAX_FALLING_INTERVAL_GAP, 
        MIN_FALLING_INTERVAL_GAP 
    } from '@/constants/shape-params';

    import Shape from './Shape.vue';

    export default {
        name       : 'FallingArea',
        components : { Shape },
        data() {
            return {
                intervalId       : null,
                shapeBottomLimit : null,

                fallingShapeTop : FALLING_SHAPE_TOP_POINT,
                intervalGap     : MAX_FALLING_INTERVAL_GAP
            };
        },
        computed: {
            ...mapGetters([ 'boardBendingAngle' ]),
            ...mapState([ 'fallingShapes', 'isGamePaused' ]),

            fallingShapeEl() {
                const { id } = this.fallingShapes[0];

                return document.getElementById(`falling-shape-${ id }`);
            }
        },
        created() {
            this.generateShape();
            this.generateShape();

            window.addEventListener('keydown', this.moveFallingShape);

            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('keydown', this.moveFallingShape);
            });
        },
        watch: {
            boardBendingAngle(current) {
                if (current > MAX_BENDING_ANGLE || current < MIN_BENDING_ANGLE) {
                    setTimeout(() => {
                        this.finishGame();

                        this.fallingShapeTop = FALLING_SHAPE_TOP_POINT;
                        this.intervalGap     = MAX_FALLING_INTERVAL_GAP;

                        this.generateShape();
                        this.generateShape();
                        this.generateShape(true);
                    }, 400);
                }
            },

            isGamePaused: {
                handler(current) {
                    if (current) {
                        clearInterval(this.intervalId);
                    }
                    else {
                        this.animateShape();
                    }
                }
            }
        },
        methods: {
            ...mapMutations([ 
                'addDroppedShape',
                'finishGame',
                'generateShape', 
                'moveShape' 
            ]),

            animateShape() {
                this.getShapeBottomLimit();

                this.intervalId = setInterval(() => {
                    if (this.fallingShapeTop >= this.shapeBottomLimit) {
                        const droppedShape = this.fallingShapes.shift();

                        clearInterval(this.intervalId);
                        
                        this.fallingShapeTop = FALLING_SHAPE_TOP_POINT;
                        this.intervalGap > MIN_FALLING_INTERVAL_GAP && this.intervalGap--;

                        this.addDroppedShape(droppedShape);
                        this.generateShape();
                        this.animateShape();
                    }
                    else {
                        this.fallingShapeTop += 1;
                        this.fallingShapeEl.style.top = `${ this.fallingShapeTop }px`;
                    }
                }, this.intervalGap);
            },

            getShapeBottomLimit() {
                const boardBounds = document.querySelector('.teeter-totter__board').getBoundingClientRect();
                const panelBounds = document.querySelector('.controls-panel').getBoundingClientRect();
                const shapeBounds = this.fallingShapeEl.getBoundingClientRect();

                const pointOnBoard = (this.fallingShapes[0].left 
                    * (boardBounds.bottom - boardBounds.top - 6)) 
                    / 100;

                this.shapeBottomLimit = this.boardBendingAngle >= 0
                    ? boardBounds.top + pointOnBoard - shapeBounds.height - panelBounds.height
                    : boardBounds.bottom - pointOnBoard - shapeBounds.height - panelBounds.height;
            },

            moveFallingShape({ keyCode }) {
                const isArrowKeyPressed = [LEFT_ARROW_KEY, RIGHT_ARROW_KEY].includes(keyCode);

                if (this.isGamePaused || !isArrowKeyPressed) return;

                const shapeWidth = this.fallingShapeEl.getBoundingClientRect().width;
                const areaWidth  = document.querySelector('.falling-area').getBoundingClientRect().width;

                const percentageWidth = (shapeWidth / areaWidth) * 100;

                this.moveShape({ keyCode, width: percentageWidth });
                this.getShapeBottomLimit();
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
