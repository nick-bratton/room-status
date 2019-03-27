<template>
  <div class="app" :class="modeClass" v-on:click="toggleDistanceMode">
    <div class="background" :class="roomStatus"></div>
    <schedule-far :entries="entries"></schedule-far>
    <schedule-close :entries="entries" :roomStatus="getRoomStatus()"></schedule-close>
    <!-- <available-slots-modal></available-slots-modal> -->
  </div>
</template>

<script>
  import store from '../store'
  import ScheduleClose from './ScheduleClose'
  import ScheduleFar from './ScheduleFar'
  import AvailableSlotsModal from './AvailableSlotsModal'
  import {getCurrentEntry, getNextEntry, getNextFreeTime, getProgressUntilNextEntry} from '@/services/calendarService'

  const refreshEveryMilliSeconds = 5000;	// this is way to short but the point is that
                                          // right now the right prop isn't beeing computer on the first render
  export default {												// to set the background color from the room status
    name: 'Schedule',
    props: {
      msg: String,
      entries: Array
    },

    components: {
      ScheduleClose,
      ScheduleFar,
      AvailableSlotsModal
    },

    computed: {
      modeClass() {
        return store.state.distanceMode
      },
      currentEntry() {
        return getCurrentEntry(this.entries)
      },
      nextEntry() {
        return getNextEntry(this.entries)
      },
      timeRemaining(){
        if (this.currentEntry) {
          const nextFreeTime = getNextFreeTime(this.entries)
          return nextFreeTime - new Date()
        } else {
          if (this.nextEntry) {
            return this.nextEntry.start - new Date()
          } else {
            return Infinity
          }
        }
      },
    },
    data() {
      return {
          updateInterval: null,
          roomStatus: null
      }
    },
    methods: {
      toggleDistanceMode() {
        store.commit('toggleDistanceMode')
      },
      getRoomStatus(){
        if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
          this.roomStatus = 'occupied';
          return 'occupied'
        }
        else if (this.currentEntry && (this.timeRemaining / 60000) <= 30) {
          this.roomStatus = "free-soon";
          return 'free-soon'
        }
        else {
          if (this.nextEntry && getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            this.roomStatus = "occupied-soon";
            return 'occupied-soon'
          } else {
            this.roomStatus = "free";
            return 'free'
          }
        }
      }
    },
    async mounted(){
      this.getRoomStatus();
      this.updateInterval = setInterval(this.getRoomStatus, refreshEveryMilliSeconds);
    }
  }

</script>

<style lang="scss" scoped>

  @import 'gradients';

  .app {
    width: 100%;
    margin: auto;
    background-color: none;
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
    .available-slots-modal{
      position: absolute;
      top:92px;
      left: 49px;
      z-index:5;
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
    .background{
      position: absolute;
      top:0;
      left: 0;
      height:100%;
      width:100%;
      &.occupied{
        background-image: $gradient-busy;
      }
      &.free{
        background-image: $gradient-free;
      }
      &.occupied-soon {
        background-image: $gradient-soon-busy;
      }
      &.free-soon{
        background-image: $gradient-soon-free;
      }
    }
  }

</style>
