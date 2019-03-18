<template>
  <div class="top-bar">
    <div class="room-name-wrapper">
      <div class="room-name" v-if="roomName">
        {{ roomName | niceRoomName }}
      </div>
      <!-- <img id="burger" src="../assets/burger-menu-icon.svg" width="37" height="31">  -->
    </div>
    <div class="current-time" v-if="currentTime">
      {{ currentTime | niceTime }}
    </div>
  </div>
</template>

<script>
  import TimerIcon from './TimerIcon.vue'
  import leftPad from 'left-pad'

  const refreshTimeEveryMilliSeconds = 1000

  export default {
    props: ['roomName'],
    data() {
      return {
        currentTime: null,
        updateTimeInterval: null
      }
    },
    components: {
      TimerIcon
    },
    async mounted() {
      this.updateTimeInterval = setInterval(this.refreshTime, refreshTimeEveryMilliSeconds)
    },
    beforeDestroy() {
      clearInterval(this.updateTimeInterval)
    },
    filters: {
      niceRoomName(rawRoomName) {
        let maxCharsInRoomName = 6;
        if (!rawRoomName) return rawRoomName
        else 
          rawRoomName = rawRoomName.replace(/^room(-|–)(ber|muc)(-|–)/i, "")
          //
          // remove the (x ppl)...
          if (rawRoomName.indexOf('(') != -1){
            rawRoomName = rawRoomName.slice(0,rawRoomName.indexOf('(')-1)
          }
          //
          // trim the string if it's too long...
          if (rawRoomName.length >= maxCharsInRoomName){
            rawRoomName = rawRoomName.slice(0,maxCharsInRoomName);
            rawRoomName += '...';
          }

        return rawRoomName
      },
      niceTime(date) {
        const hours = leftPad(date.getHours(), 2, '0')
        const minutes = leftPad(date.getMinutes(), 2, '0')
        return hours + ':' + minutes
      }
    },
    methods: {
      refreshTime() {
        this.currentTime = new Date()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .top-bar {
    position:fixed;
    top:0px;
    display: flex;
    align-items: center;
    // padding: 60px 30px;
    height: 128px;
    width: 100%;
    font-size: 60px;
    background-color: rgba(0,0,0,.24);
    color: white;
    z-index:3;
    text-transform: uppercase;
    font-weight: bold;

    > * {
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .current-time {
      text-align: right;
      margin-right:64px;
      padding-top:8px;
    }

    .room-name-wrapper{
      display:flex;
      align-items: center;
      background-color:rgba(255,255,255,0.2);
      border-radius: 41px;
      width: 350px;
      height:82px;
      margin-left:37px;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .room-name{
      padding-left: 38px;	// 48px in sebastian's designs
      padding-top:11px;
    }

    #burger{
      margin-right: 31px;	// 41px in sebastian's designs
      width: 37px;
      height: 31px;
    }
  }

</style>
