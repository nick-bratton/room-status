<template>
	<!-- <div v-if="roomStatusTimeAmount <= .5"> -->
	<div class="timer-icon" v-on:click="animate" v-if="roomStatus == 'free-soon' || roomStatus == 'occupied-soon' || roomStatus == 'occupied'">
		<canvas ref="canvas" id="canvas" width="185" height="185"></canvas>
	</div>

</template>

<script>

import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'
import TimerIcon from './TimerIcon'

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
				completionColor: '#ffffff'
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
		mounted(){
			var vm = this;
			vm.canvas = vm.$refs.canvas;
			vm.context = vm.canvas.getContext("2d");
			vm.x = canvas.width / 2;
			vm.y = canvas.height / 2;
			vm.context.lineWidth = 20;
			vm.context.strokeStyle = vm.completionColor;
			// 
			// draw the outline of the background circle
			for (let i = 0; i < 103; i++){
				vm.context.beginPath();
				vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * i) - vm.halfPi);
				vm.context.stroke();
			}
		},
		methods: {
			async animate(){
				let vm = this;
				let i = 0;
				let draw = setInterval(function(){
					if (vm.completionAsInteger >= 101){
						clearInterval(draw);
					}
					else {
						vm.context.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
						//
						// draw background
						vm.context.strokeStyle = vm.completionColor;
						for (let i = 0; i < 103; i++){
							vm.context.beginPath();
							vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * i) - vm.halfPi);
							vm.context.stroke();
						}
						//
						// draw foreground 
						vm.context.strokeStyle = '#ffffff';
						vm.context.beginPath();
						vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * vm.completionAsRatio) - vm.halfPi);
						vm.context.stroke();
						vm.completionAsInteger++;
						vm.completionAsRatio = vm.completionAsInteger/100;
					}
				},50);
			},
		},
		props: {
			entries: Array
		}
	}
	
</script>

<style lang="scss" scoped>

	.timer-icon {
		margin: auto;
		background-color: rgba(0,0,0,0);
		position: relative;
		width: 185px;
		height:185px;
		z-index:100;
	}

	.timer-icon-canvas{
		width: 185px;
		height: 185px;
	}

	#canvasFG, #canvasBG{
		position:absolute;
	}

</style>