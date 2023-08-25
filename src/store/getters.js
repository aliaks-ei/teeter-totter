import { MAX_BENDING_ANGLE, MIN_BENDING_ANGLE } from '@/constants/teeter-totter';
import helpers from '@/utils/helpers';

const getters = {
  boardBendingAngle(_state, { droppedShapesSum, randomlyPlacedShapesSum }) {
    let angle = 0;

    if (!droppedShapesSum) {
      angle = MAX_BENDING_ANGLE;
    } else {
      const subtraction = Math.abs(droppedShapesSum - randomlyPlacedShapesSum);

      angle = droppedShapesSum > randomlyPlacedShapesSum
          ? (subtraction / droppedShapesSum) * -50
          : (subtraction / randomlyPlacedShapesSum) * 50;
    }

    return angle;
  },

  droppedShapesSum({ droppedShapes }) {
    return helpers.getShapesProportion(droppedShapes, true);
  },

  isBoardAngleWithinLimits(state, { boardBendingAngle }) {
    return boardBendingAngle > MIN_BENDING_ANGLE && boardBendingAngle < MAX_BENDING_ANGLE;
  },

  randomlyPlacedShapesSum({ randomlyPlacedShapes }) {
    return helpers.getShapesProportion(randomlyPlacedShapes);
  }
};

export default getters;
