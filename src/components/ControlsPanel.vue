<template>
    <header class="controls-panel">
        <button 
            class    = "controls-panel__play-button"
            tabindex = "-1" 
            @click   = "toggleSimulation"
        >
            {{ isGamePaused ? 'Start' : 'Stop' }}
        </button>
    </header>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { SPACE_KEY } from '@/constants/controls';

    export default {
        computed: {
            ...mapState([ 'isGamePaused' ])
        },
        created() {
            window.addEventListener('keydown', this.handleSpaceClick);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleSpaceClick);
        },
        methods: {
            ...mapMutations([ 'toggleSimulation' ]),

            handleSpaceClick({ keyCode, target }) {
                if (keyCode === SPACE_KEY && this.$el.firstChild !== target) {
                    this.toggleSimulation();
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .controls-panel {
        display         : flex;
        justify-content : center;
        height          : 4rem;
    }

    .controls-panel__play-button {
        background-color : white;
        border           : 1px solid lightcoral;
        border-radius    : 4px;
        width            : 112px;
        height           : 2.5rem;
        margin-top       : 0.5rem;
        color            : lightcoral;
        font-weight      : 600;   
        cursor           : pointer;
        transition       : 300ms ease-out;

        &:hover {
            background-color : lightcoral;
            color            : white;
        }
    }

</style>
