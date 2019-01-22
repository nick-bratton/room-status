<template>
    <div class="schedule-close">
        <div v-for="(entry, entryIndex) in shownEntries" v-bind:key="entryIndex">
            <div class="day-indicator" v-if="isDifferentDay(entryIndex)">
                {{ entry.start | niceDay }}
            </div>
            <ScheduleSlot class="div-slot" :entry="entry"/>
        </div>
    </div>
</template>

<script>
    import ScheduleSlot from './ScheduleSlot.vue'
    import startOfDay from 'date-fns/start_of_day'
    import {format} from 'date-fns'

    const officeCloseTime = {hours: 18, minutes: 0}
    const officeOpenTime = {hours: 10, minutes: 0}

    export default {
        props: {
            msg: String,
            entries: Array
        },
        components: {
            ScheduleSlot
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
                return startOfDay(previousEntry.start).getTime() != startOfDay(currentEntry.start).getTime()
            }
        },
        computed: {
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
                                type: 'free'
                            })
                        }
                    }
                    if (now <= entry.end) {
                        entries.push(entry)
                        lastEntryEnd = entry.end
                    }
                }
                return entries
            }
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
        }
    }
</script>

<style lang="scss" scoped>
    .schedule-close {
        overflow: auto;
        .day-indicator {
            background-color: black;
            color: white;
            height: 100px;
            font-size: 40px;
            padding: 45px 30px 5px;
        }
    }
</style>