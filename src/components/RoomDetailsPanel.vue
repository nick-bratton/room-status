<template>
  <div class="room-details-panel">
    <div id="wrapper">
      <div class="user-icon">
        <img src="../assets/user-icon-busy.svg" v-if="roomStatus == 'occupied'" width="100px" height="100px" >
        <img src="../assets/user-icon-soon-busy.svg" v-else-if="roomStatus == 'occupied-soon'" width="100px" height="100px" >
        <img src="../assets/user-icon-soon-free.svg" v-else-if="roomStatus == 'free-soon'" width="100px" height="100px" >
      </div>
      <div class="metadata">
        <div id="name">{{organizer}}</div>
        <div id="time">{{booking.start | hhmm}} — {{booking.end | hhmm}}</div>
      </div>
    </div>
  </div>
</template>å

<script>

  import {format} from 'date-fns'

  export default {
    props: {
      roomStatus: null,
      organizer: null,
      booking: null
    },
    filters: {
      hhmm(v) {
        return format(new Date(v), "HH:mm")
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import 'colors';

  .room-details-panel{

  }

  #wrapper{
    height: 143px;
    width: 493px;
    background-color: rgba(255,255,255,0.35);
    border-radius: 10px;
    padding-left:43px;
    padding-top:23px;
    display:flex;
  }

  .metadata{
    text-align: left;
    padding-left: 27px;
    padding-top:5px;
  }

  #name{
    font-size: 32px;
    font-weight:bold;
    color: rgb(75,76,78);
  }

  #time{
    font-size: 48px;
    font-weight:bold;
    color: rgb(59,63,66);
  }

</style>