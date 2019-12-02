import { MIN_WEIGHT, MAX_WEIGHT, SCALE_STEP } from '@/constants/shape-params';
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

    generateShape(state, randomlyPlaced = false) {
        const weight = MIN_WEIGHT + Math.round(Math.random() * (MAX_WEIGHT - 1));
        const type   = 1 + Math.round(Math.random() * 2);
        const left   = Math.round(Math.random() * 10) * 4.5;
        const scale  = 1 + SCALE_STEP * (weight - 1);
        const color  = helpers.generateRandomRGBColor();
    
        state.lastShapeId += 1;

        const shape = { 
            id: state.lastShapeId, 
            color,
            left, 
            scale, 
            type, 
            weight 
        };

        if (randomlyPlaced) {
            state.randomlyPlacedShapes.push(shape);
        }
        else {
            state.fallingShapes.push(shape);
        }
    },
    
    moveShape({ fallingShapes }, { keyCode, width }) {
        if (keyCode === 37 && fallingShapes[0].left - 1 >= 0) {
            fallingShapes[0].left--;
        }
        else if (keyCode === 39 && fallingShapes[0].left + width + 1 <= 45) {
            fallingShapes[0].left++;
        }
    }
};

export default mutations;
