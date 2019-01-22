<template>
    <div class="schedule-slot" :class="{free: entry.type === 'free'}">
        <div class="bg-progress" :style="bgProgressStyle"></div>
        <div class="row time start-end">{{entry.start | hhmm}} — {{entry.end | hhmm}}</div>
        <div class="row flex">
            <div class="time total">
                {{totalTime | niceDistance}}
            </div>
            <div class="middle-block time">
                <div v-if="entry.type === 'free'" class="free">
                    Free
                </div>
                <div class="attendees" v-else>
                    <div class="attendee" v-for="(attendee, attendeeIndex) in attendees"
                         v-bind:key="attendeeIndex" :class="{organizer: attendee.isOrganizer}">
                        {{attendee.name}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {format, distanceInWords, distanceInWordsStrict} from 'date-fns'
    import {getProgressUntilEntryEnd} from "../calendarService";

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
                }).sort((a,b) => a.isOrganizer && !(b.isOrganizer))
            },
            bgProgressStyle() {
                const progress = getProgressUntilEntryEnd(this.entry)
                return 'transform: scaleX(' + progress + ')'
            },
            totalTime() {
                return distanceInWordsStrict(this.entry.end, this.entry.start)
            }
        },
        methods: {
            isOrganizer(attendeeName) {
                return this.entry.organizer && this.entry.organizer.emailAddress && this.entry.organizer.emailAddress.name === attendeeName
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'colors';

    .schedule-slot {
        background-color: $color-occupied;
        clear: both;
        color: white;
        width: 100%;
        min-height: 160px;
        padding: 20px 30px;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        position: relative;
        &.free {
            background-color: $color-free;
        }

        .bg-progress {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.2);
            transform-origin: left;
        }
    }

    .time-block {
        display: inline-block;
        width: 40%;
        float: left;
    }

    .middle-block {
        margin-left: 2em;
    }

    .schedule-slot.highlight {
        background-color: black;
    }

    .attendee {
        display: inline-block;
        font-weight: 100;
        margin-right: 1em;
        &.organizer {
            font-weight: bold;
        }
    }

    .schedule-slot.schedule-slot.highlight > .time-block > * {
        color: white;
    }

    .schedule-slot.highlight > .middle-block > * {
        color: white;
    }

    .schedule-slot.highlight > .middle-block > * > * {
        color: rgba(255, 255, 255, 0.8);
    }

    .schedule-slot > .middle-block > div.title {
        display: none;
    }

    .schedule-slot.highlight > .middle-block > div.title {
        display: block;
    }

    .attendee-counter {
        float: right;
        display: inline-block;
        box-sizing: border-box;

        /* background-color: red; */

        width: 10%;
        height: 2em;
        overflow: hidden;
    }

    .title {
        font-weight: 900;
        text-align: left;
    }

    .time-relative {
        margin-bottom: 20px;
    }

    .time.start-end {
        font-size: 40px;
    }

    .time .free {
        font-size: 60px;
    }

    .row {
        position: relative;
    }

    .row.flex {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        .time.total {
            font-size: 60px;
            white-space: nowrap;
        }
        .attendees {
            font-size: 30px;
        }
    }

</style>


