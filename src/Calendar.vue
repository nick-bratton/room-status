<template>
    <div id="app">
        <TopBar></TopBar>
        <Schedule :entries="calendarEntries"/>
    </div>
</template>

<script>
    import Schedule from './components/Schedule.vue'
    import TopBar from './components/TopBar.vue'
    import {
        client,
        getRooms,
        getCalendarEntries,
        isOnline
    } from './calendarService'

    import {parse as parseDate} from 'date-fns'

    const refreshEveryMilliSeconds = 60000

    export default {
        name: 'calendar',
        components: {
            Schedule,
            TopBar
        },
        data() {
            return {
                users: [],
                calendarOwner: 'me',
                calendarEntries: [],
                fetch: fetch,
                updateInterval: null
            }
        },
        async mounted() {
            await client.connect()
            if (this.$route.params.user) {
                await this.refreshCalendar()
            }
            this.updateInterval = setInterval(this.refreshCalendar, refreshEveryMilliSeconds)
        },
        beforeDestroy() {
            clearInterval(this.updateInterval)
        },
        watch: {
            "$route"(to, from) {
                // this.refreshCalendar()
            }

        },
        methods: {

            async refreshCalendar() {
                const rawEntries = await getCalendarEntries(client, this.$route.params.user)
                const entries = rawEntries.value.map(entry => ({
                    attendees: entry.attendees.map(
                        attendee => attendee.emailAddress.name),
                    start: parseDate(entry.start.dateTime),
                    end: parseDate(entry.end.dateTime),
                    name: entry.subject,
                    location: entry.location,
                    organizer: entry.organizer
                }))
                // .filter(entry => {
                //     var end = new Date();
                //     end.setHours(23,59,59,999);

                //     var start = new Date();
                //     start.setHours(0,0,0,0);
                //     return entry.end < end && entry.start > start
                //   } )
                    .sort((first, second) => first.start - second.start)


                this.calendarEntries = entries;
            },
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
