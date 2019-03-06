<template>
  <div class="available-slots-modal">
    <img src="../assets/available-slots-modal.svg" width="686" height="862"/> 
    <div class="wrapper">
      <div class="modal-header">Available Slots Today</div>
    </div>
  </div>
</template>

<script>

  export default {
    // props: {},
    // data() {
    // },
    // components: {
    // },
    // async mounted() {
    // },
    // beforeDestroy() {
    // },
    // filters: {
    // },
    // methods: {
    // }
  }
</script>

<style lang="scss" scoped>
  .available-slots-modal{
    position:absolute;
   }
  .wrapper{
    position:absolute;
    top:52px;
    height:100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: start;
    justify-content: center;
  }
   .modal-header{
    font-size:40px;
    font-weight: bold;
    color: white;
    width: 100%;
    text-align: center;
   }

</style>
