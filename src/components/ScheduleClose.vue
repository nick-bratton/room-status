<template>
	<div class="schedule-close" v-if="entries" v-on:scroll="handleScroll">
		<div class="content-wrapper" ref="wrapper"> 
			<div class="day-header">Today</div>
			<div v-for="(entry, entryIndex) in shownEntries" v-bind:key="entryIndex">
				<div class="day-indicator" v-if="isDifferentDay(entryIndex)">{{ entry.start | niceDay }}</div>
				<ScheduleSlot class="div-slot" :entry="entry"></ScheduleSlot>
			</div>
		</div>
		<div class="swipe-down-icon" v-if="contentOverflowsViewport">
			<svg width="28px" height="20px" viewBox="0 0 28 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g id="Iteration-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.85">
				<g id="Soon-Busy-Close" transform="translate(-365.000000, -982.000000)" fill="#FFFFFF">
					<polygon id="Triangle" transform="translate(378.571429, 992.000000) scale(1, -1) translate(-378.571429, -992.000000) " points="378.571429 982 392.142857 1002 365 1002"></polygon>
				</g>
				</g>
			</svg>
		</div>
	</div>
</template>

<script>
		import {getRoomName} from '@/services/roomsService'
		import {isSameDay} from './dates.js'
		import ScheduleSlot from './ScheduleSlot.vue'
		import TopBar from './TopBar.vue'
		import startOfDay from 'date-fns/start_of_day'
		import {format} from 'date-fns'
		import {getCurrentEntry, getProgressUntilEntryEnd, getProgressUntilNextEntry, getNextEntry, getNextFreeTime} from '@/services/calendarService'

		const officeCloseTime = {hours: 18, minutes: 0}
		const officeOpenTime = {hours: 10, minutes: 0}

		const refreshEveryMilliSeconds = 60000
		const fadeOutThresholdTop = 110

		export default {
			props: {
					msg: String,
					entries: Array,
			},
			data() {
				return {
					roomName: null,
					updateInterval: null,
					contentOverflowsViewport: false,
				}
			},
			components: {
				ScheduleSlot,
				TopBar
			},
			methods: {
				makeWithinOfficeHours(time) {
					const newTime = new Date(time)
					const hours = time.getHours()
					const minutes = time.getMinutes()
					const inMinutes = hours * 60 + minutes
					const officeOpenTimeInMinutes = officeOpenTime.hours * 60 + officeOpenTime.minutes
					if (inMinutes < officeOpenTimeInMinutes) {
						newTime.setHours(officeOpenTime.hours)
						newTime.setMinutes(officeOpenTime.minutes)
					}
					const officeCloseTimeInMinutes = officeCloseTime.hours * 60 + officeCloseTime.minutes
					if (officeCloseTimeInMinutes < inMinutes) {
						newTime.setHours(officeCloseTime.hours)
						newTime.setMinutes(officeCloseTime.minutes)
					}
					return newTime
				},
				intersectWithOfficeHours(start, end) {
					let newStart = this.makeWithinOfficeHours(start)
					let newEnd = this.makeWithinOfficeHours(end)
					if (newStart < newEnd) {
						return {
							start: newStart,
							end: newEnd
						}
					}
					return {}
				},
				isDifferentDay(entryIndex) {
					if (entryIndex === 0) return false
					const currentEntry = this.shownEntries[entryIndex]
					const previousEntry = this.shownEntries[entryIndex - 1]
					return !(isSameDay(previousEntry.start, currentEntry.start))
				},
				async refreshRoomName() {
					const roomName = await getRoomName(this.$route.params.user)
					this.roomName = roomName
				},
				async getRoomStatus(){
					if (this.currentEntry && (this.timeRemaining / 60000) > 30 ) {
						// this.roomStatus = 'occupied';
						return 'occupied'
					}
					else if (this.currentEntry && (this.timeRemaining / 60000) <= 30) {
						this.roomStatus = "free-soon";
						return 'free-soon'
					}
					else {
						if (this.nextEntry && getProgressUntilNextEntry(this.nextEntry) >= 0.5) {
							// this.roomStatus = "occupied-soon";
							return 'occupied-soon'
						} else {
							// this.roomStatus = "free";
							return 'free'
						}
					}
				},
				handleScroll(event){
					for (let i = 0; i < event.path[0].children[0].children.length; i++){
						let c = event.path[0].children[0].children[i];
						if(c.getBoundingClientRect().top < fadeOutThresholdTop){
							c.classList.add('transparent');
							c.classList.remove('opaque');
						}
						else {
							c.classList.remove('transparent');
							c.classList.add('opaque');
						}
					}
				},
			},
			async mounted() {
				if (this.$route.params.user) {await this.refreshRoomName()}
				this.updateInterval = setInterval(this.refreshCalendar, refreshEveryMilliSeconds)
				if (this.$refs.wrapper.getBoundingClientRect().height > 840){
					console.log('entries overflow the viewport...show the down arrow')
					this.contentOverflowsViewport = true;
				}

			},
			beforeDestroy() {
				clearInterval(this.updateInterval)
			},
			watch: {
				"$route"() {
					this.refreshRoomName()
				}
			},
			computed: {
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
				shownEntries() {
					const entries = []
					const now = new Date()
					let lastEntryEnd = now
					for (const entry of this.entries) {
						if (lastEntryEnd < entry.start) {
							const { start, end } = this.intersectWithOfficeHours(lastEntryEnd, entry.start)
							if(start && end) {
								entries.push({
									start,
									end,
									type: 'free',
								})
							}
						}
						if (now <= entry.end) {
							entries.push(entry)
							lastEntryEnd = entry.end
						}
					}
					return entries
				},
			},
			filters: {
				niceDay(date) {
					const today = startOfDay(new Date())
					const day = startOfDay(date)
					const differenceInMilliseconds = day.getTime() - today.getTime()
					const daysAhead = Math.round(differenceInMilliseconds / (1000 * 3600 * 24))
					if (daysAhead > 1) {
						return format(date, 'dddd')
					} else if (daysAhead === 1) {
						return 'Tomorrow'
					}
				}
			},
		}
</script>

<style lang="scss" scoped>

	@import 'gradients';

		.schedule-close {
			overflow: auto;
			.day-indicator {
				color: white;
				height: 100px;
				font-size: 72px;
				font-weight:bold;
				margin-left:79px;
			}
			.content-wrapper{
				margin-top:158px;
				padding-bottom: 42px;
				// -webkit-mask-image: src('../assets/schedule-close-mask-bottom.html');
  			// mask-image: src('../assets/schedule-close-mask-bottom.html');
			}
		}

		.swipe-down-icon{
			position:absolute;
			left: 365px;
			top:982px;
		}

		.day-header{
			color:white;
			font-size: 72px;
			font-weight:bold;
			margin-left:79px;
		}

		.transparent{
			opacity: 0;
			transition: opacity .3s;
		}
		.opaque{
			opacity: 1;
			transition: opacity .3s;
		}

</style>