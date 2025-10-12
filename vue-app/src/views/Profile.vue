<script setup lang='ts'>
import { useUsersStore } from '@/stores/users';
import { ref, watch } from 'vue';

const user = useUsersStore();

const username = ref('');

interface Party {
    id: string,
    creator: string,
    name: string,
    time: string,
    songs: any,
    owners: any,
}

const parties = ref<Party[]>([]);

watch(() => user.userId, fetchProfile, { immediate: true })

async function fetchProfile() {
    try {
        const response = await fetch(`http://localhost:1323/api/profiles/${user.userId}`);
        if (response.status === 401) {
            //TODO handle not auth'd
        }

        if (response.status !== 200) {
            // TODO handle all other errors
            throw new Error(`Unable to fetch user profile with id ${user.userId}`);
        }

        const data = await response.json();
        parties.value = data;
        console.log('data in fetch profile is', data);
    } catch (e) {
        console.log("couldn't fetch user profile: ", e);
    }
}

function getURL(party: Party): string {
   return `/parties/${party.id}` 
}
</script>

<template>
    <div class='page'>
        <h1 class='title'>Profile page</h1>
        <h2>Welcome {{username}}</h2>
        <ul v-if='parties.length !== 0'>
            <li v-for="party in parties">
            </li>
        </ul>

        <!-- TODO fetch all the users parties here -->
    </div>
</template>

<style scoped>
.title {
    margin: 16px;
}

.controls {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    width: 75%;
    margin: 0 auto;
    gap: 8px
}

input {
    padding: 4px;
    min-width: 20%;
}

.btn {
    padding: 4px;
    /* width: 10%; */
    align-self: center;
    min-width: 25%;
}

@media (min-width: 1024px) {
    .controls {
        flex-direction: row;
        justify-content: center;
    }

    .btn {
        min-width: 5%;
        width: 10%;
    }
}
</style>
