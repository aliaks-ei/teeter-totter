import { MIN_WEIGHT, MAX_WEIGHT, SCALE_STEP } from '@/constants/shape';
import helpers from '@/utils/helpers';

const mutations = {
    addDroppedShape(state, shape = {}) {
        state.droppedShapes.push(shape);
    },

    toggleSimulation(state) {
        state.isGamePaused = !state.isGamePaused;
    },

    finishGame(state) {
        alert('Game over');

        state.isGamePaused = true;

        state.droppedShapes = [];
        state.fallingShapes = [];
        state.randomlyPlacedShapes = [];
    },

    generateShape({ randomlyPlacedShapes, fallingShapes }, randomlyPlaced = false) {
        const weight = helpers.generateRandomNumber(MIN_WEIGHT, MAX_WEIGHT - 1);
        const type   = helpers.generateRandomNumber(1, 2);
        const left   = helpers.generateRandomNumber(0, 40);
        const color  = helpers.generateRandomRGBColor();
        const scale  = 1 + SCALE_STEP * (weight - 1);
        const id     = helpers.getId.next().value;

        const shape = { id, color, left, scale, type, weight };

        if (randomlyPlaced) {
            randomlyPlacedShapes.push(shape);
        }
        else {
            fallingShapes.push(shape);
        }
    },
    
    moveShape({ fallingShapes }, { moveLeft, width }) {
        const shape = fallingShapes[0];

        const canMoveLeft  = shape.left - 1 >= 0;
        const canMoveRight = shape.left + width + 1 <= 45;

        if (moveLeft) canMoveLeft && shape.left--;
        else canMoveRight && shape.left++;
    }
};

export default mutations;
