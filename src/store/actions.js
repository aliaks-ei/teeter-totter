const actions = {
  initGame({ commit, state }) {
    if (!state.isGamePaused) commit('toggleSimulation');
    if (state.isModalShown) commit('toggleModal');

    commit('updateFallingIntervalGap', true);
    commit('clearAllShapeArrs');

    // Generates to shapes for user
    commit('generateShape');
    commit('generateShape');

    // Generates auto-placed shape on the right side
    commit('generateShape', true);
  }
};

export default actions;
