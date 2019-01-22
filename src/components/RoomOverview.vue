<template>
    <div class="room-overview">
        <div v-for="room in rooms" class="room" :key="room.id">
            {{ room.displayName | niceRoomName }}
        </div>
    </div>
</template>

<script>
    import {
        getRooms,
        client,
    } from '../calendarService'
    import niceRoomName from './niceRoomName'

    export default {
        data() {
            return {
                rooms: []
            }
        },
        async mounted() {
            if (!client.session) await client.connect()
            this.getUsers()
        },
        filters: {
            niceRoomName
        },
        methods: {
            async getUsers() {
                const rooms = await getRooms(client)
                this.rooms = rooms.value
            }
        }
    }
</script>

<style lang="scss" scoped>
    .room-overview {
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        width: 100%;
        background-color: #666;
        height: 120px;
        padding: 10px;
        .room {
            background-color: #BBB;
            padding: 10px;
            margin: 10px;
        }
    }
</style>
