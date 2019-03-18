<template>
  <div class="timer-icon">
    <canvas ref="canvas" id="canvas" width="185" height="185"></canvas>
    <div class="center-icon-wrapper" >
      <img src="../assets/busy-icon.svg" id="busy-icon" v-if="roomStatus == 'occupied'" width="89" height="22">
      <img src="../assets/soon-icon.svg" id="soon-icon" v-else-if="roomStatus == 'free-soon' || roomStatus == 'occupied-soon'" width="67" height="99">
    </div>
  </div>
</template>

<script>

  import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'
  import TimerIcon from './TimerIcon'

  const refreshEveryMilliSeconds = 60000

  export default {
    data() { 
      return{
        canvas: null,
         completionAsInteger: 0,
        completionAsRatio: 0.0,
        x: 0,
        y: 0,
        radius: 82.5,
        twoPi: Math.PI * 2,
        halfPi: Math.PI / 2,
        completionColor: '#ffffff',
        arcLength: 0
      }
    },
    computed: {
      currentEntry() {
        return getCurrentEntry(this.entries)
      },
      nextEntry() {
        return getNextEntry(this.entries)
      },
      roomStatus() {
        if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
          this.completionColor = '#C57BB4';
          return 'occupied'
        }
        else if ( this.currentEntry && (this.timeRemaining / 60000) <= 30) {
          this.completionColor = '#F6B053';
          return 'free-soon' // soon free
        }
        else {
          if (this.nextEntry &&  getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
            this.completionColor = '#F79D5E';
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
      }
    },
    async mounted(){
      var vm = this;
      vm.drawBackground();
      if (vm.roomStatus == 'free-soon' || vm.roomStatus == 'occupied'){ // waiting on design logic from sebastian for 'busy' case
        vm.showRoomStatusProgress();
        vm.updateInterval = setInterval(vm.showRoomStatusProgress, refreshEveryMilliSeconds);
      }
    },
    beforeDestroy(){
      clearInterval(this.updateInterval);
    },
    methods: {
      drawBackground: function(){
        var vm = this;
        vm.canvas = vm.$refs.canvas;
        vm.context = vm.canvas.getContext("2d");
        vm.x = canvas.width / 2;
        vm.y = canvas.height / 2;
        vm.context.lineWidth = 20;
        vm.context.strokeStyle = vm.completionColor;
        for (let i = 0; i < 103; i++){
          vm.context.beginPath();
          vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * i) - vm.halfPi);
          vm.context.stroke();
        }
      },
      showRoomStatusProgress: function(){
        let vm = this;
        let scaleFactor = 1;
        vm.arcLength = getProgressUntilEntryEnd(getCurrentEntry(this.entries)) * 100;
        vm.context.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
        vm.context.strokeStyle = vm.completionColor;
        for (let i = 0; i < 103; i++){
          vm.context.beginPath();
          vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * i) - vm.halfPi);
          vm.context.stroke();
        }
        vm.context.strokeStyle = '#ffffff';
        vm.context.beginPath();
        vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * (vm.arcLength * 0.01)) - vm.halfPi);
        vm.context.stroke();
      },
    },
    props: {
      entries: Array
    }
  }
  
</script>

<style lang="scss" scoped>

  .center-icon-wrapper{
    height: 185px;
    width: 185px;
    display: flex;
    align-items: center;
    margin-top:-190px;
  }

  #soon-icon, #busy-icon{
    margin: 0 auto;
    width:50%;
  }

  .timer-icon {
    margin: auto;
    background-color: rgba(0,0,0,0);
    position: relative;
    width: 185px;
    height:185px;
    z-index:4;
  }

  .timer-icon-canvas{
    width: 185px;
    height: 185px;
  }

  #canvasFG, #canvasBG{
    position:absolute;
  }

</style>