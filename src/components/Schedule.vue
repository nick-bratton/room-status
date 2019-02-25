<template>
	<div class="app" :class="modeClass" v-on:click="toggleDistanceMode">
		<div class="background" :class="roomStatus"></div>
		<schedule-far :entries="entries"></schedule-far>
		<schedule-close :entries="entries" :roomStatus="roomStatus"></schedule-close>
	</div>
</template>

<script>
	import store from '../store'
	import ScheduleClose from './ScheduleClose'
	import ScheduleFar from './ScheduleFar'
	import {getCurrentEntry, getNextEntry, getNextFreeTime, getProgressUntilNextEntry} from '@/services/calendarService'

	const refreshEveryMilliSeconds = 60000;

	export default {
		name: 'Schedule',
		props: {
			msg: String,
			entries: Array
		},

		components: {
			ScheduleClose,
			ScheduleFar
		},

		computed: {
			modeClass() {
				return store.state.distanceMode
			},
			currentEntry() {
				return getCurrentEntry(this.entries)
			},
			nextEntry() {
				return getNextEntry(this.entries)
			},
			timeRemaining(){
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
		},
		data() {
			return {
					updateInterval: null,
					roomStatus: null
			}
		},
		methods: {
			toggleDistanceMode() {
				store.commit('toggleDistanceMode')
			},
			getRoomStatus(){
				if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
					this.roomStatus = 'occupied';
					// return 'occupied'
				}
				else if (this.currentEntry && (this.timeRemaining / 60000) <= 30) {
					this.roomStatus = "free-soon";
					// return 'free-soon'
				}
				else {
					if (this.nextEntry && getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
						this.roomStatus = "occupied-soon";
						// return 'occupied-soon'
					} else {
						this.roomStatus = "free";
						// return 'free'
					}
				}
			}
		},
		async mounted(){
			this.getRoomStatus();
			this.updateInterval = setInterval(this.getRoomStatus, refreshEveryMilliSeconds);
		}
	}

</script>

<style lang="scss" scoped>

	@import 'gradients';

	.app {
		width: 100%;
		margin: auto;
		background-color: black;
		position: relative;
		flex-grow: 1;
		.schedule-close,
		.schedule-far {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
		.schedule-close {
			transition: opacity 600ms;
		}
		.schedule-far {
			transition: opacity 600ms, transform 600ms;
			transform-origin: top;
		}
		&.far {
			.schedule-close {
				opacity: 0;
			}
		}
		&.close {
			.schedule-far {
				opacity: 0;
				transform: scale(3);
			}
		}
		.background{
			position: absolute;
			top:0;
			left: 0;
			height:100%;
			width:100%;
			&.occupied{
				background-image: $gradient-busy;
			}
			&.free{
				background-image: $gradient-free;
			}
			&.occupied-soon {
				background-image: $gradient-soon-busy;
			}
			&.free-soon{
				background-image: $gradient-soon-free;
			}
		}
	}

</style>