<template>
  <div class="schedule-far" v-if="entries" :class="roomStatusClass">
    <div class="room-status-info">
      <div >
        <div class="room-status-soon" v-if="roomStatusClass != 'free' && roomStatusClass != 'occupied'">Soon</div>
        <div v-else class="room-status-not-soon"> &nbsp</div>
        <div class="room-status-intro-text">
          {{ roomStatusText }}
        </div>
        <div v-if="roomStatusClass == 'free'" id="free-icon">
          <img src="../assets/free-icon.svg" height="201" width="201"> 
        </div>
        <div v-else-if="roomStatusClass == 'occupied-soon'">
          <img src="../assets/soon-icon.svg" height="185" width="185"> 
        </div>
        <timer-icon :entries="entries" :timeRemaining="timeRemaining" v-if="roomStatus == 'free-soon' || roomStatus == 'occupied'"></timer-icon>
        <div class="room-status-time">
          <div v-if="roomStatusClass == 'free-soon' || roomStatusClass == 'occupied-soon'">In&nbsp</div>
          <div v-else-if="(roomStatusClass == 'occupied' || roomStatusClass == 'free') && roomStatusTimeAmount != Infinity">For&nbsp</div>
          <div class="room-status-time-amount" v-if="roomStatusTimeAmount != Infinity"> {{ roomStatusTimeAmount | round }}</div>
          <div class="room-status-time-amount" v-else>All day</div>
          &nbsp
          <div v-if="roomStatusTimeAmount != Infinity" class="room-status-time-units">{{ roomStatusTimeUnits }}</div>
        </div>
      </div>
      <RoomDetailsPanel :roomStatus="roomStatus" :organizer="currentOrganizer()" :booking="currentEntry" v-if="roomStatusClass != 'free'"></RoomDetailsPanel>
    </div>
  </div>
</template>

<script>
  import {getRoomName} from '@/services/roomsService'
  import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'
  import TimerIcon from './TimerIcon'
  import TopBar from './TopBar.vue'
  import RoomDetailsPanel from './RoomDetailsPanel.vue'

  const refreshEveryMilliSeconds = 60000

  export default {
    props: {
      entries: Array
    },
    data() {
      return {
        roomName: null,
        updateInterval: null,
        roomStatus: null,
        // currentOrganizer: null,
      }
    },
    components: {
      TimerIcon,
      TopBar,
      RoomDetailsPanel
    },
    computed: {
      attendees() {
        return this.entry.attendees.map(attendee => {
          const isOrganizer = this.isOrganizer(attendee)
          return {
            name: attendee,
            isOrganizer
          }
        }).sort((a,b) => {
          if(a.isOrganizer && !(b.isOrganizer)) {
            return -1
          }
          if(!(a.isOrganizer) && b.isOrganizer) {
            return 1
          }
          return 0
        })
      },
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
          this.roomStatus = "occupied";
          return 'occupied'
        }
        else if ( this.currentEntry && (this.timeRemaining / 60000) <= 30) {
          this.roomStatus = "free-soon";
          return 'free-soon' // soon free
        }
        else {
          if (this.nextEntry &&  getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            this.roomStatus = "occupied-soon";
            return 'occupied-soon' // soon busy
          } else {
            this.roomStatus = "free";
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
    },
    async mounted() {
      if (this.$route.params.user) {
          await this.refreshRoomName()
      }
      this.updateInterval = setInterval(this.refreshCalendar, refreshEveryMilliSeconds)
    },
    beforeDestroy() {
      clearInterval(this.updateInterval)
    },
    watch: {
      "$route"() {
          this.refreshCalendar()
          this.refreshRoomName()
      }
    },
    methods: {
      async refreshRoomName() {
        const roomName = await getRoomName(this.$route.params.user)
        this.roomName = roomName
      },
      currentOrganizer() {
        if (this.currentEntry){
          for (let attendee of this.currentEntry.attendees){
            if (this.currentEntry.organizer && this.currentEntry.organizer.emailAddress && this.currentEntry.organizer.emailAddress.name === attendee){
              return attendee
            }
          }
        }
        else{
          return null
        }
      },
      isOrganizer(attendeeName) {
        return this.currentEntry.organizer && this.currentEntry.organizer.emailAddress && this.currentEntry.organizer.emailAddress.name === attendeeName
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'colors';
  @import 'gradients';

  #non-free-icon-wrapper{
    position:absolute;
    display: flex;
    align-items: center;
    left:34.5%;
    top:24.5%;
    height: 150px;
    width: 150px;
  }

  #free-icon{
    margin: auto;
    background-color: rgba(0,0,0,0);
    position: relative;
    width: 201px;
    height:201px;
  }

  #svg-icon{
    width: 50%;
    margin: 0 auto;
  }

  .room-status-not-soon {
    width: 204px;
    height: 96px;

  }

  .schedule-far {
    color: white;
    height: 100%;
    text-align: center;
    display: flex;
    // z-index:1;
    // padding-top:55px;

    .room-status-info {
      position: relative;
      margin-left: auto;
      margin-right: auto;
      margin-top:171px;
    }
    .room-status-intro-text {
      font-size: 160px;
      font-weight: bold;
    }
    .room-status-soon{
      font-size: 96px;
      font-weight: bold;
      float: left;
      padding-left: 67px;
      margin-bottom:-32px;
    }
    .room-status-time{
      font-size: 110px;
      display:flex;
      margin-top: 42px;
      justify-content: center;

    }
    .room-status-time-amount,
    .room-status-time-units {
      font-size: 110px;
      font-weight: bold;
    }
    .bg-current {
      position: absolute;
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