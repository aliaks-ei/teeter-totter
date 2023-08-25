// Shapes id generator
function* idMaker() {
  let id = 1;

  while (true) {
    yield id++;
  }
}

const helpers = {
  getId: idMaker(),
  generateRandomNumber(min = 0, max = 1) {
    return min + Math.round(Math.random() * max);
  },
  generateRandomRGBColor() {
    const maxValue = 200; // to generate only dark colors

    const r = this.generateRandomNumber(0, maxValue);
    const g = this.generateRandomNumber(0, maxValue);
    const b = this.generateRandomNumber(0, maxValue);

    return `rgb(${ r }, ${ g }, ${ b })`;
  },
  getShapesProportion(shapes = [], leftSide = false) {
    return shapes.reduce((total, current) => {
      const left = leftSide ? 50 - current.left : current.left;

      total += current.weight * left;

      return total;
    }, 0);
  }
};

export default helpers;
