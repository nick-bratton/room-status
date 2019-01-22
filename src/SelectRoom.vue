<template>
<div>
    Select the room to be displayed:
    <ul class="rooms">
        <li v-for="user in users" :key="user.id">
            <router-link :to="`/calendar/${user.id}`">
            {{user.name}}
            </router-link>
        </li>
    </ul>
</div>
</template>
<script>
import {
    getRooms,
    client,
} from '@/calendarService'
export default {
    data(){return {
        users: [],
    }},
    async mounted(){
        if(!client.session) await client.connect()
        this.getUsers();
    },
    methods:{
        async getUsers(){
            const user = (await getRooms(client))
            this.users = user.value.map(
                user=>({
                    name: user.displayName,
                    id: user.id
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

