import Vue from 'vue'

import Vuex from 'vuex'
import {proximityEvents} from '@/services/proximityService'

Vue.use(Vuex)

// Make sure to call Vue.use(Vuex) first if using a module system

const store = new Vuex.Store({
  state: {
    distanceMode: 'far'
  },
  mutations: {
    toggleDistanceMode (state, distanceMode) {
      if (distanceMode) {
        state.distanceMode = distanceMode
      } else {
        state.distanceMode = state.distanceMode === 'far' ? 'close' : 'far'
      }
    }
  }
})

proximityEvents.addEventListener("far", ()=> store.commit("toggleDistanceMode", "far"))
proximityEvents.addEventListener("near", ()=> store.commit("toggleDistanceMode", "close"))

export default store
