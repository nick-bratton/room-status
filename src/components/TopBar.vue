<template>
	<div class="top-bar">
		<div class="room-name" v-if="roomName">
			{{ roomName | niceRoomName }}
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
				if (!rawRoomName) return rawRoomName
				return rawRoomName.replace(/^room(-|–)(ber|muc)(-|–)/i, "")
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top-bar {
		position:fixed;
		top:0px;
		display: flex;
		align-items: center;
		padding: 60px 30px;
		height: 128px;
		width: 100%;
		font-size: 60px;
		background-color: rgba(0,0,0,.24);
		color: white;
		z-index:1000;
		text-transform: uppercase;

		> * {
			flex-basis: 0;
			flex-grow: 1;
			flex-shrink: 1;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.current-time {
			text-align: right;
		}

	}

</style>
