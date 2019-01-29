<template>
<div>
    Select the room to be displayed:
    <ul class="rooms">
        <li v-for="user in rooms" :key="user.id">
            <router-link :to="`/calendar/${user.id}`">
            {{user.name}}
            </router-link>
        </li>
    </ul>
</div>
</template>
<script>
import {
    getRooms
} from '@/roomsService'
export default {
    data(){return {
        rooms: [],
    }},
    async mounted(){
        this.getRooms();
    },
    methods:{
        async getRooms(){
            const rooms = (await getRooms())
            this.rooms = rooms.map(
                room=>({
                    name: room.displayName,
                    id: room.id
                })
            )
        },
    }
}
</script>

<style>
.rooms li{
    list-style: none;
}
</style>

