<template>
  <!-- <div class="app" :class="modeClass" v-on:click="toggleDistanceMode"></div> -->
  <div class="app" :class="modeClass" v-on:click="toggleDistanceMode">
    <schedule-far :entries="entries"></schedule-far>
    <schedule-close :entries="entries"></schedule-close>
  </div>
</template>

<script>
  import store from '../store'
  import ScheduleClose from './ScheduleClose'
  import ScheduleFar from './ScheduleFar'

  export default {
    name: 'Schedule',
    props: {
      msg: String,
      entries: Array
    },

    components: {
      ScheduleClose,
      ScheduleFar
    },

    computed: {
      modeClass() {
        return store.state.distanceMode
      }
    },

    methods: {
      toggleDistanceMode() {
        store.commit('toggleDistanceMode')
      }
    }

  }
</script>

<style lang="scss" scoped>

  .app {
    width: 100%;
    margin: auto;
    background-color: rgb(200, 200, 200);
    position: relative;
    flex-grow: 1;
    .schedule-close,
    .schedule-far {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    .schedule-close {
      transition: opacity 600ms;
    }
    .schedule-far {
      transition: opacity 600ms, transform 600ms;
      transform-origin: top;
    }
    &.far {
      .schedule-close {
        opacity: 0;
      }
    }
    &.close {
      .schedule-far {
        opacity: 0;
        transform: scale(3);
      }
    }
  }

  * {
    line-break: loose;
    color: black;
  }

</style>