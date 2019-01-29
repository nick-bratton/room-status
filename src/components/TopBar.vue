<template>
    <div class="top-bar">
        <div class="room-name" v-if="currentRoomName">
            {{ currentRoomName | niceRoomName }}
        </div>
        <div class="current-time" v-if="currentTime">
            {{ currentTime | niceTime }}
        </div>
    </div>
</template>

<script>
    const refreshTimeEveryMilliSeconds = 1000
    import {getRoomName} from '@/roomsService'
    import leftPad from 'left-pad'

    export default {
        data() {
            return {
                currentRoomName: null,
                currentTime: null,
                updateTimeInterval: null
            }
        },
        async mounted() {
            this.updateTimeInterval = setInterval(this.refreshTime, refreshTimeEveryMilliSeconds)
            if (this.$route.params.user) {
                await this.refreshRoomName()
            }
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
            async refreshRoomName() {
                const roomName = await getRoomName(this.$route.params.user)
                this.currentRoomName = roomName
            },
            refreshTime() {
                this.currentTime = new Date()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .top-bar {
        display: flex;
        align-items: center;
        padding: 60px 30px;
        height: 101px;
        width: 100%;
        font-size: 60px;
        background-color: black;
        color: white;
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
