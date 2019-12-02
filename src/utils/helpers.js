const helpers = {
    generateRandomRGBColor() {
        const r = Math.round(Math.random() * 255);
        const g = Math.round(Math.random() * 255);
        const b = Math.round(Math.random() * 255);

        return `rgb(${ r }, ${ g }, ${ b })`;
    },

    getShapesProportion(shapes = [], leftSide = false) {
        return shapes.reduce((total, current) => {
                total += leftSide 
                    ? current.weight * (50 - current.left)
                    : current.weight * current.left;

                return total;
        }, 0);
    }
};

export default helpers;
