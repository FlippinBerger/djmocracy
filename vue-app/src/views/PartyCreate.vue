<script setup lang="ts">
import { ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import {DateTime as DT} from 'luxon';
import { useRouter } from 'vue-router';

const partyName = ref("");
const partyDate = ref("")
const partyTime = ref("");

const store = useUsersStore();
const router = useRouter();

const getPartyTime = (): string => {
    var datePieces = partyDate.value.split('-').map((s) => +s);
    var timePieces = partyTime.value.split(':').map((s) => +s);

    return DT.local(datePieces[0], datePieces[1], datePieces[2], timePieces[0], timePieces[1]).toUTC().toString();
}

const createParty = async () => {
    // simple validation for now, form must be filled out
    if (partyName.value === '' || partyDate.value === '' || partyTime.value === '') {
        return;
    }

    const response = await fetch('http://localhost:1323/api/party', {
        body: JSON.stringify({
            name: partyName.value,
            time: getPartyTime(),
            creator: store.userId,
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        credentials: 'include',
    })

    if (response.status === 401) {
        //TODO handle not auth'd
    }

    if (response.status !== 200) {
        // TODO handle all other errors
        throw new Error("Unable to create party");
    }

    const data = await response.json();
    router.push(`/parties/${data.partyId}`)
}
</script>

<template>
    <div class='page'>
        <h1>Create Party</h1>
        <form class='form'>
            <input v-model="partyName" placeholder='Event name' />

            <label for='date'>What day is your party?</label>
            <input type='date' name='date' v-model="partyDate" />

            <label for='time'>What time is your party?</label>
            <input type='time' name='time' v-model="partyTime" />

            <!-- <input type="datetime-local" v-model="partyTime" /> -->
            <button type='button' class='btn' @click="createParty">Create</button>
        </form>
    </div>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

input {
    margin-bottom: 16px;
    padding: 4px;
}

.btn {
    align-self: center;
    width: 25%;
}
</style>
