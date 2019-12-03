import { MAX_BENDING_ANGLE } from '@/constants/teeter-totter-params';
import helpers from '@/utils/helpers';

const getters = {
    boardBendingAngle(state, { droppedShapesSum, randomlyPlacedShapesSum }) {
        let angle = 0;

        if (!droppedShapesSum) {
            angle = MAX_BENDING_ANGLE;
        }
        else {
            const subtraction = Math.abs(droppedShapesSum - randomlyPlacedShapesSum);

            angle = droppedShapesSum > randomlyPlacedShapesSum
                ? subtraction / droppedShapesSum * -50 
                : subtraction / randomlyPlacedShapesSum * 50;
        }
        console.log(angle);
        return angle;
    },
    
    droppedShapesSum({ droppedShapes }) {
        return helpers.getShapesProportion(droppedShapes, true);
    },

    randomlyPlacedShapesSum({ randomlyPlacedShapes }) {
        return helpers.getShapesProportion(randomlyPlacedShapes);
    }
};

export default getters;
