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
        getCalendarEntries
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
                calendarEntries: null,
                updateInterval: null
            }
        },
        async mounted() {
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
                const rawEntries = await getCalendarEntries(this.$route.params.user)
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
