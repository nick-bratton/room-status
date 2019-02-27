<template>
	<div class="schedule-slot" :class="{free: entry.type === 'free'}">
		<!-- THESE SLOTS ARE FOR TIME PERIODS THAT HAVE BEEN BOOKED -->
		<div v-if="entry.type !== 'free'" class="slot-content-booked">
			<div class="user-icon">
				<img src="../assets/user-icon-free.svg" v-if="this.$parent.$parent.getRoomStatus() == 'free'" width="100px" height="100px" >
				<img src="../assets/user-icon-soon-busy.svg" v-if="this.$parent.$parent.getRoomStatus() == 'occupied-soon'" width="100px" height="100px" >
				<img src="../assets/user-icon-soon-free.svg" v-if="this.$parent.$parent.getRoomStatus() == 'free-soon'" width="100px" height="100px" >
				<img src="../assets/user-icon-busy.svg" v-if="this.$parent.$parent.getRoomStatus() == 'occupied'" width="100px" height="100px" >
			</div>
			<div class="entry-data-wrapper">
				<div class="entry-attendee" v-for="(attendee, attendeeIndex) in attendees" v-if="attendee.isOrganizer" v-bind:key="attendeeIndex">{{attendee.name}}</div>
				<div class="entry-time">{{entry.start | hhmm}} — {{entry.end | hhmm}}</div>
			</div>
			<div class ="entry-data-additional-attendees" v-if="this.entry.attendees.length > 1"> + {{this.entry.attendees.length}} more</div>
		</div> 
		<!-- THESE SLOTS ARE FOR TIME PERIODS THAT ARE FREE -->
		<div v-else class="slot-content-free">
			<div class="free-icon">FREE</div>
			<div class="free-data">{{entry.start | hhmm}} — {{entry.end | hhmm}}</div>
		</div>
	</div>
</template>

<script>
	import {format, distanceInWords, distanceInWordsStrict} from 'date-fns'
	import {getProgressUntilNextEntry} from '@/services/calendarService'

	export default {
		props: ['entry'],
		filters: {
			hhmm(v) {
				return format(new Date(v), "HH:mm")
			},
			relativeDate(v) {
				const distance = distanceInWords(v, new Date());
				return distance
			},
			niceDistance(timeStr) {
				timeStr = timeStr.replace(' hours', 'h')
				timeStr = timeStr.replace(' minutes', 'min')
				timeStr = timeStr.replace(' seconds', 's')
				timeStr = timeStr.replace(' hour', 'h')
				timeStr = timeStr.replace(' minute', 'min')
				timeStr = timeStr.replace(' second', 's')
				return timeStr
			}
		},
		computed: {
			attendees() {
				return this.entry.attendees.map(attendee => {
					const isOrganizer = this.isOrganizer(attendee)
					return {
						name: attendee,
						isOrganizer
					}
				}).sort((a,b) => {
					if(a.isOrganizer && !(b.isOrganizer)) {
						return -1
					}
					if(!(a.isOrganizer) && b.isOrganizer) {
						return 1
					}
					return 0
				})
			},
			totalTime() {
				return distanceInWordsStrict(this.entry.end, this.entry.start)
			},
		},
		methods: {
			isOrganizer(attendeeName) {
				return this.entry.organizer && this.entry.organizer.emailAddress && this.entry.organizer.emailAddress.name === attendeeName
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import 'colors';

	.schedule-slot {
		background-color: rgba(253, 242, 233, 0.9);
		clear: both;
		color: white;
		width: 615px;
		height: 143px;
		padding: 20px 30px;
		margin: 0 auto;
		margin-bottom:22px;
		position: relative;
		border-radius: 10px;
		&.free {
			height:92px;
			background-color:rgba(255,255,255,0.5);
		}
	}

	.slot-content-booked,
	.slot-content-free{
		display:flex;
		height:100%;
		width:100%;
	}

	.free-icon{
		font-size: 28px;
		font-weight: bold;
		background-color: rgb(55,163,105);
		border-radius: 4px;
		width:95px;
		height:38px;
		text-align: center;
		padding-top:3.5px;
		align-self:center;
	}

	.free-data{
		font-size: 34px;
		font-weight: bold;
		color:rgb(89,89,89);
		align-self:center;
		padding-left: 32px;
		padding-top:4px;
	}
	.entry-time{
		font-size: 28px;
		font-weight:bold;
		color: rgb(78,84,91);
	}

	.entry-attendee{
		font-size:32px;
		font-weight:bold;
		color: rgb(48,59,69);
	}

	.entry-data-wrapper{
		margin-left:30px;
		margin-top: 16px;
	}

	.entry-data-additional-attendees{
		font-size:32px;
		font-weight:bold;
		color: rgb(134,141,146);
		margin-top: 16px;
		margin-left: auto;
	}

</style>


