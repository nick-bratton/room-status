<template>

		<!-- <div v-if="roomStatusTimeAmount <= .5"> -->
	<div class="timer-icon" v-on:click="animate">
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
				radius: 40,
				twoPi: Math.PI * 2,
				halfPi: Math.PI / 2,
			}
		},
		mounted(){
			var vm = this;
			vm.canvas = vm.$refs.canvas;
			vm.context = vm.canvas.getContext("2d");
			vm.x = canvas.width / 2;
			vm.y = canvas.height / 2;
			vm.context.lineWidth = 10;
			vm.context.strokeStyle = '#ffffff';
		},
		methods: {
			test: function() {
				var vm = this;
				console.log(vm.x);
			},
			animate: function(){
				var vm = this;
				while (vm.completionAsInteger < 101){
					vm.context.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
					vm.context.beginPath();
					vm.context.arc(vm.x, vm.y, vm.radius, -(vm.halfPi), ((vm.twoPi) * vm.completionAsRatio) - vm.halfPi);
					vm.context.stroke();
					vm.completionAsInteger++;
					vm.completionAsRatio = vm.completionAsInteger/100;
				}
			}
		},
		props: {
			entries: Array
		},
		computed: {},
	}
	
</script>






<style lang="scss" scoped>

	.timer-icon {
		margin: auto;
		background-color: rgba(0,0,0,.5);
		position: relative;
		width: 185px;
		height:185px;
		z-index:100;
	}

	.timer-icon-canvas{
		width: 185px;
		height: 185px;
	}

</style>