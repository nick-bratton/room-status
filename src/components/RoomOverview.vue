<template>
    <div class="room-overview">
        <div v-for="room in rooms" class="room" :key="room.id">
            {{ room.displayName }}
        </div>
    </div>
</template>

<script>
    import {
        getRooms,
        client,
    } from '../calendarService'

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
        position: relative;
        height: 80px;
        .room {
            background-color: #BBB;
            margin: 10px;
            padding: 10px;
        }
    }
</style>
