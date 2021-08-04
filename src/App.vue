<template>
  <div id="app">
    <controls-panel></controls-panel>
    <playground></playground>
    <modal-dialog></modal-dialog>
  </div>
</template>

<script>
import ControlsPanel from './components/ControlsPanel.vue';
import ModalDialog   from './components/ModalDialog.vue';
import Playground    from './components/Playground.vue';

export default {
  components: {
    ControlsPanel,
    ModalDialog,
    Playground
  }
};
</script>

<style lang="scss">
  html, body, #app {
    width  : 100%;
    height : 100%;
  }

  html {
    overflow-y: auto !important;
  }

  #app {
    display                 : flex;
    flex-direction          : column;
    -webkit-font-smoothing  : antialiased;
    -moz-osx-font-smoothing : grayscale;
  }
</style>
