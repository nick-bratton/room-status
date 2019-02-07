<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0px;
    font-size: 16pt;
    /* background-color: #555;    */
  }

  @font-face {
    font-family: 'Klavika';
    src: url('./assets/Klavika-Light.otf');
    font-weight: normal;
  }

  @font-face {
    font-family: 'Klavika';
    src: url('./assets/Klavika-Medium.otf');
    font-weight: bold;
  }

  #app {
    /* font-family: 'Rubik', Arial, sans-serif; */    /* just commented out in this branch */
    /* font-size: 20pt; */                            /* this was commented out in the master branch */
    /* font-weight: 100; */                           /* just commented out in this branch */
    font-family: 'Klavika', 'Rubik', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
    margin: 0px;
    padding: 0px;
    /* margin-top: 60px; */

  }
</style>
