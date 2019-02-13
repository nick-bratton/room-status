<template>
  <div class="schedule-far" v-if="entries" :class="roomStatusClass">
    <div class="bg-current"></div>
    <div class="room-status-info">
      <div v-if="roomStatusTimeAmount === Infinity">
        <div class="room-status-time-free">
          FREE
        </div>
      </div>
      <div v-else>
        <div class="room-status-soon">
          <div v-if="roomStatusClass !== 'free' && roomStatusClass !== 'occupied'">Soon</div>
          <div v-else>&nbsp</div>
        </div>
        <div class="room-status-intro-text">
          {{ roomStatusText }}
        </div>
        <timer-icon :entries="entries"></timer-icon>
        <div class="room-status-time">
          <div v-if="roomStatusClass == 'soon-free' || roomStatusClass == 'soon-occupied'">In&nbsp</div>
          <div v-else-if="roomStatusClass == 'busy' || roomStatusClass == 'free'">For&nbsp</div>
          <div class="room-status-time-amount"> {{ roomStatusTimeAmount | round }}</div>
          &nbsp
          <div class="room-status-time-units">{{ roomStatusTimeUnits }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'
  import TimerIcon from './TimerIcon'

  export default {
    props: {
      entries: Array
    },
    components: {
      TimerIcon
    },
    computed: {
      currentEntry() {
        return getCurrentEntry(this.entries)
      },
      nextEntry() {
        return getNextEntry(this.entries)
      },
      roomStatusText() {
        if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
          return 'BUSY'
        }
        else if ( this.currentEntry && (this.timeRemaining / 60000) <= 30) {
          return 'FREE' // soon free
        }
        else {
          if (this.nextEntry &&  getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            return 'BUSY' // soon busy
          } else {
            return 'FREE'
          }
        }
      },
      roomStatusClass() {
        if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
          return 'occupied'
        }
        else if ( this.currentEntry && (this.timeRemaining / 60000) <= 30) {
          return 'free-soon' // soon free
        }
        else {
          if (this.nextEntry &&  getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            return 'occupied-soon' // soon busy
          } else {
            return 'free'
          }
        }
      },
      timeRemaining() {
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
      roomStatusTimeAmount() {
        const seconds = this.timeRemaining / 1000
        if (seconds < 60) {
          return seconds
        } else {
          if (seconds < 3600) {
            return seconds / 60
          } else {
            if (seconds < 3600 * 24) {
              return seconds / 3600
            } else {
              return seconds / (3600 * 24)
            }
          }
        }
      },
      roomStatusTimeUnits() {
        const seconds = this.timeRemaining / 1000
        if (seconds < 60) {
          return 's'                                  // was 'seconds'
        } else {
          if (seconds < 3600) {
            return 'min'                              // was 'minutes'
          } else {
            if (seconds < 3600 * 24) {
              return 'hr'                             // was 'hours'
            } else {
              return 'days'
            }
          }
        }
      }
    },
    filters: {
      round(amount) {
        return Math.round(amount)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'colors';
  @import 'gradients';

  .schedule-far {
    color: white;
    height: 100%;
    text-align: center;
    display: flex;
    padding-top:55px;

    .room-status-info {
      position: relative;
      margin-left: auto;
      margin-right: auto;

    }
    .room-status-intro-text {
      font-size: 160px;
      font-weight: bold;
    }
    .room-status-soon {
      font-size: 96px;
      font-weight: bold;
      float: left;
      padding-left: 30px;
      margin-bottom:-32px;
    }
    .room-status-time-free {
      font-size: 200px;
      margin-top: 130px;
    }
    .room-status-time{
      font-size: 110px;
      display:flex;
      margin-top:80px;
    }
    .room-status-icon{
      // padding-top: 133px;
    }
    .room-status-time-amount,
    .room-status-time-units {
      font-size: 110px;
      font-weight: bold;
    }
    .bg-current {
      position: absolute;
      // top: -128px;
      top:0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &.occupied {
      .bg-current {
        background-image: $gradient-busy;
      }
    }
    &.free {
      .bg-current {
        background-image: $gradient-free;
      }
    }
    &.occupied-soon {
      .bg-current {
        background-image: $gradient-soon-busy;
      }
    }
    &.free-soon{
      .bg-current {
        background-image: $gradient-soon-free;
      }
    }

  }
</style>
