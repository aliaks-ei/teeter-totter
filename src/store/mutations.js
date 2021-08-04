import {
  MAX_FALLING_INTERVAL_GAP,
  MIN_FALLING_INTERVAL_GAP,
  MIN_WEIGHT,
  MAX_WEIGHT,
  SCALE_STEP
} from '@/constants/shape';
import helpers from '@/utils/helpers';

const mutations = {
  addDroppedShape(state, shape = {}) {
    state.droppedShapes.push(shape);
  },
  clearAllShapeArrs(state) {
    state.droppedShapes = [];
    state.fallingShapes = [];
    state.randomlyPlacedShapes = [];
  },
  toggleSimulation(state) {
    state.isGamePaused = !state.isGamePaused;
  },
  generateShape({ randomlyPlacedShapes, fallingShapes }, randomlyPlaced = false) {
    const weight = helpers.generateRandomNumber(MIN_WEIGHT, MAX_WEIGHT - 1);
    const type   = helpers.generateRandomNumber(1, 2);
    const left   = helpers.generateRandomNumber(0, 40);
    const color  = helpers.generateRandomRGBColor();
    const top    = 0;
    const scale  = 1 + SCALE_STEP * (weight - 1);
    const id     = helpers.getId.next().value;
    const shape = { id, color, left, scale, top, type, weight };

    if (randomlyPlaced) {
        randomlyPlacedShapes.push(shape);
    }
    else {
        fallingShapes.push(shape);
    }
  },
  moveShape({ fallingShapes }, { moveLeft, width }) {
    const [shape] = fallingShapes;

    const canMoveLeft  = shape.left - 1 >= 0;
    const canMoveRight = shape.left + width + 1 <= 45;

    if (moveLeft) {
      canMoveLeft && shape.left--;
    }
    else {
      canMoveRight && shape.left++;
    }
  },
  toggleModal(state, isShown = false) {
    state.isModalShown = isShown;
  },
  updateFallingIntervalGap(state, reset = false) {
    if (reset) {
      state.fallingIntervalGap = MAX_FALLING_INTERVAL_GAP;
    }
    else if (state.fallingIntervalGap > MIN_FALLING_INTERVAL_GAP) {
      state.fallingIntervalGap--;
    }
  }
};

export default mutations;
