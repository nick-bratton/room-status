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

        
        <!-- to replace the 'soon' icon below

        http://jsfiddle.net/uhVj6/220/

        -->


        <div class="room-status-icon">
          <svg width="201px" height="201px" viewBox="0 0 201 201" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <path d="M180.5,378 C129.563877,378 88,336.436123 88,285.5 C88,234.563877 129.563877,193 180.5,193 C231.436123,193 273,234.563877 273,285.5 C273,336.436123 231.436123,378 180.5,378 Z M226.001035,251.164282 C222.933063,248.10855 218.22884,248.10855 215.160868,251.164282 L166.277854,301.889437 L144.597521,279.277019 C141.529549,276.221287 136.825326,276.221287 133.757355,279.277019 C130.689383,282.332751 130.689383,287.425638 133.757355,290.48137 L160.960036,318.594107 C164.028008,321.649839 168.732231,321.649839 171.800203,318.594107 L226.001035,262.368634 C229.069006,259.312902 229.069006,254.220015 226.001035,251.164282 Z" id="path-1"></path>
                <filter x="-5.9%" y="-5.9%" width="114.1%" height="114.1%" filterUnits="objectBoundingBox" id="filter-2">
                    <feOffset dx="2" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                </filter>
            </defs>
            <g id="Iteration-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Free-Until-Far" transform="translate(-286.000000, -457.000000)" fill-rule="nonzero">
                    <g id="Main-Info" transform="translate(204.000000, 270.000000)">
                        <g id="Shape-Copy">
                            <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                            <use fill="#FFFFFF" xlink:href="#path-1"></use>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        </div>
        <div class="room-status-time">
          In&nbsp
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

  export default {
    props: {
      entries: Array
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
