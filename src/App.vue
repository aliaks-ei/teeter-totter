<template>
	<div id="app">
		<controls-panel></controls-panel>
		<playground></playground> 
	</div>
</template>

<script>
	import ControlsPanel from './components/ControlsPanel.vue';
	import Playground    from './components/Playground.vue';

	export default {
		components: { 
			ControlsPanel,
			Playground 
		} 
	};
</script>

<style lang="scss">

	* {
		box-sizing: border-box;
	}

	html, body, #app {
		width  : 100%;
		height : 100%;
	}

	html {
		font-size: 16px;
	}

	#app {
		-webkit-font-smoothing  : antialiased;
        -moz-osx-font-smoothing : grayscale;
	}

	body {
		margin: 0;
	}

</style>
