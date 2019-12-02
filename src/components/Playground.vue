<template>
    <main class="playground">
        <falling-area></falling-area>
		<teeter-totter></teeter-totter>
	</main>
</template>

<script>
    import FallingArea  from './FallingArea.vue';
    import TeeterTotter from './TeeterTotter.vue';

	export default {
		components: { 
            FallingArea,
            TeeterTotter 
        } 
	};
</script>

<style lang="scss" scoped>

    .playground {
        display        : flex;
        flex-direction : column;
        height         : calc(100% - 4rem);
        min-width      : 600px;
        width          : 80%;
        margin         : 0 auto;
        padding-bottom : 10rem;
    }

</style>
