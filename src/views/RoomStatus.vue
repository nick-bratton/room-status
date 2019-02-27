<template>
    <div id="app">
        <TopBar :room-name="roomName"></TopBar>
        <Schedule :entries="calendarEntries"/>
    </div>
</template>

<script>
    import Schedule from '@/components/Schedule.vue'
    import TopBar from '@/components/TopBar.vue'
    import {getCalendarEntries} from '@/services/calendarService'
    import {getRoomName} from '@/services/roomsService'

    import {parse as parseDate} from 'date-fns'

    const refreshEveryMilliSeconds = 60000;

    export default {
        name: 'calendar',
        components: {
            Schedule,
            TopBar
        },
        data() {
            return {
                calendarEntries: null,
                roomName: null,
                updateInterval: null
            }
        },
        async mounted() {
            if (this.$route.params.user) {
                await this.refreshCalendar()
                await this.refreshRoomName()
                localStorage.setItem(
                    'default_room',
                    this.$route.params.user
                )
            }
            this.updateInterval = setInterval(this.refreshCalendar, refreshEveryMilliSeconds)
        },
        beforeDestroy() {
            clearInterval(this.updateInterval)
        },
        watch: {
            "$route"() {
                this.refreshCalendar()
                this.refreshRoomName()
            }
        },
        methods: {
            async refreshCalendar() {
                const rawEntries = await getCalendarEntries(this.$route.params.user)
                if (!rawEntries || rawEntries.error) {
                    return
                }
                const entries = rawEntries.map(entry => ({
                    attendees: entry.attendees.map(
                        attendee => attendee.emailAddress.name),
                    start: parseDate(entry.start.dateTime),
                    end: parseDate(entry.end.dateTime),
                    name: entry.subject,
                    location: entry.location,
                    organizer: entry.organizer
                }))
                    .sort((first, second) => first.start - second.start)
                this.calendarEntries = entries;
            },
            async refreshRoomName() {
                const roomName = await getRoomName(this.$route.params.user)
                this.roomName = roomName

            }
        }
    }
</script>

<style scoped>

    #app {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

</style>
