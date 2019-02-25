<template>
	<div class="top-bar">
		<div class="room-name-wrapper">
			<div class="room-name" v-if="roomName">
				{{ roomName | niceRoomName }}
			</div>
			<svg id="burger" viewBox="0 0 37 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g id="Iteration-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g id="Busy-Far" transform="translate(-310.000000, -49.000000)">
									<g id="Header">
											<g id="List-Icon" transform="translate(311.000000, 50.000000)">
													<path d="M33.7790698,2 L1.22093023,2 C0.546976744,2 0,1.552 0,1 C0,0.446666667 0.546976744,0 1.22093023,0 L33.7790698,0 C34.4530233,0 35,0.446666667 35,1 C35,1.552 34.4530233,2 33.7790698,2" id="Fill-1" fill="#FFFFFF"></path>
													<path d="M33.7790698,2 L1.22093023,2 C0.546976744,2 0,1.552 0,1 C0,0.446666667 0.546976744,0 1.22093023,0 L33.7790698,0 C34.4530233,0 35,0.446666667 35,1 C35,1.552 34.4530233,2 33.7790698,2 Z" id="Stroke-3" stroke="#FFFFFF"></path>
													<path d="M33.7777778,29 L14.2222222,29 C13.5475556,29 13,28.552 13,28 C13,27.448 13.5475556,27 14.2222222,27 L33.7777778,27 C34.4524444,27 35,27.448 35,28 C35,28.552 34.4524444,29 33.7777778,29" id="Fill-5" fill="#FFFFFF"></path>
													<path d="M33.7777778,29 L14.2222222,29 C13.5475556,29 13,28.552 13,28 C13,27.448 13.5475556,27 14.2222222,27 L33.7777778,27 C34.4524444,27 35,27.448 35,28 C35,28.552 34.4524444,29 33.7777778,29 Z" id="Stroke-7" stroke="#FFFFFF"></path>
													<path d="M33.7790698,16 L1.22093023,16 C0.546976744,16 0,15.552 0,15 C0,14.4466667 0.546976744,14 1.22093023,14 L33.7790698,14 C34.4530233,14 35,14.4466667 35,15 C35,15.552 34.4530233,16 33.7790698,16" id="Fill-9" fill="#FFFFFF"></path>
													<path d="M33.7790698,16 L1.22093023,16 C0.546976744,16 0,15.552 0,15 C0,14.4466667 0.546976744,14 1.22093023,14 L33.7790698,14 C34.4530233,14 35,14.4466667 35,15 C35,15.552 34.4530233,16 33.7790698,16 Z" id="Stroke-11" stroke="#FFFFFF"></path>
											</g>
									</g>
							</g>
					</g>
			</svg>
		</div>
		<div class="current-time" v-if="currentTime">
			{{ currentTime | niceTime }}
		</div>
	</div>
</template>

<script>
	const refreshTimeEveryMilliSeconds = 1000
	import leftPad from 'left-pad'

	export default {
		props: ['roomName'],
		data() {
			return {
				currentTime: null,
				updateTimeInterval: null
			}
		},
		async mounted() {
			this.updateTimeInterval = setInterval(this.refreshTime, refreshTimeEveryMilliSeconds)
		},
		beforeDestroy() {
			clearInterval(this.updateTimeInterval)
		},
		filters: {
			niceRoomName(rawRoomName) {
				let maxCharsInRoomName = 5;
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
			padding-left: 48px;
			padding-top:11px;
		}

		#burger{
			margin-right: 41px;
			width: 37px;
			height: 31px;
		}
	}

</style>
