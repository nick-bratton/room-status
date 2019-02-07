<template>
  <div class="schedule-far" v-if="entries" :class="roomStatusClass">
    <div class="bg-current"></div>
    <div class="bg-next" :class="bgNextClass" :style="bgNextStyle"></div>
    <div class="room-status-info">
      <div v-if="roomStatusTimeAmount === Infinity">
        <div class="room-status-time-free">
          Free
        </div>
      </div>
      <div v-else>
        <div class="room-status-intro-text">
          {{ roomStatusText }}
        </div>
        <div class="room-status-time-amount">
          {{ roomStatusTimeAmount | round }}
        </div>
        <div class="room-status-time-units">
          {{ roomStatusTimeUnits }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'

  export default {
    props: {
      entries: Array
    },
    computed: {
      bgNextClass() {
        if (this.currentEntry && this.nextEntry && this.nextEntry.start <= this.currentEntry.end) {
          return 'occupied'
        }
        return ''
      },
      bgNextStyle() {
        let progress
        if (this.currentEntry) {
            const eightHours = 1000 * 3600 * 8
            progress = getProgressUntilEntryEnd(this.currentEntry, eightHours)
        } else {
          if (this.nextEntry) {
              progress = getProgressUntilNextEntry(this.nextEntry)
          } else {
              progress = 0
          }
        }
        const percentage = 100 * (1 - progress)
        // 
        // returned data below  commented out to remove background animation
        // that according to first design iteration, indicated the amt
        // of time left before the next entry begins
        //
        // commented out by nick on Feb 7, 2019
        //
        return //'transform: translateY(' + percentage + '%)'
      },
      currentEntry() {
        // console.log(getCurrentEntry(this.entries));
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
          return 'SOON FREE'
        }
        else {
          if (this.nextEntry &&  getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            return 'SOON BUSY'
          } else {
            return 'FREE'
          }
        }
      },
      roomStatusClass() {
        return this.currentEntry ? 'occupied' : 'free'
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
          return 'seconds'
        } else {
          if (seconds < 3600) {
            return 'minutes'
          } else {
            if (seconds < 3600 * 24) {
              return 'hours'
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
    align-items: center;
    .room-status-info {
      position: relative;
      margin-left: auto;
      margin-right: auto;
    }
    .room-status-intro-text {
      font-size: 160px;
      font-weight: bold;
    }
    .room-status-time-amount,
    .room-status-time-free {
      font-size: 200px;
    }
    .room-status-time-units {
      font-size: 110px;
      // font-weight: normal;
    }
    .room-status-time-free {
      margin-top: 130px;
    }
    .bg-current,
    .bg-next {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &.occupied {
      .bg-current {
        // background-color: $color-occupied;
        background-image: $gradient-busy;
      }
      .bg-next {
        // background-color: $color-free;
        background-image: $gradient-free;
        &.occupied {
          // background: linear-gradient(to bottom, $color-occupied-too, $color-occupied);
          // here we need logic to get the soon-busy or soon-free style
          // probably should make a new class at this point
          // background-image: $gradient-soon-busy;
        }
      }
    }
    &.free {
      .bg-current {
        // background-color: $color-free;
        background-image: $gradient-free;
      }
      .bg-next {
        // background-color: $color-occupied;
        // background-image: $gradient-busy;
        //
        // if the above is in-commented then 
        // Free rooms will display the 
        // busy gradient background...
      }
    }
  }
</style>
