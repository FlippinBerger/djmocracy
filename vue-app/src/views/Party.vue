<script setup lang="ts">
import SongList from '@/components/SongList.vue'
import AddSongModal from '@/components/AddSongModal.vue'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DateTime as DT } from 'luxon';

var route = useRoute();

const title = ref("");
const time = ref("");
const creatorId = ref("");
const showAddModal = ref(false);

interface Song {
    artist: string,
    title: string,
    votes: number,
}

const songs = ref<Song[]>([]);

watch(() => route.params.partyId, fetchParty, { immediate: true })

async function fetchParty() {
    try {
        const response = await fetch(`http://localhost:1323/api/parties/${route.params.partyId}`);
        if (response.status === 401) {
            //TODO handle not auth'd
        }

        if (response.status !== 200) {
            // TODO handle all other errors
            throw new Error(`Unable to fetch party with id ${route.params.partyId}`);
        }

        const data = await response.json();
        title.value = data.name;
        songs.value = data.songs;
        creatorId.value = data.creator;
        time.value = DT.fromISO(data.time).toLocal().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' });
    } catch (e) {
        console.log('an error occurred while fetching a party', e);
    }
}

const addClicked = () => {
    showAddModal.value = true;
}

const addSong = (title: string, artist: string) => {
    showAddModal.value = false;
    songs.value.push({ artist: artist, title: title, votes: 0 })
}

</script>

<template>
    <div class='party'>
        <h1 class='title'>{{ title }}</h1>
        <h2 class='title'>{{ time }}</h2>
        <div class='list-wrapper'>
            <SongList :songs='songs' />
        </div>
        <AddSongModal v-if='showAddModal' @add-song='addSong' />
    </div>
    <div class='footer'>
        <div class='btn-circle'>
            <button @click='addClicked' class='add-button'>+</button>
        </div>
    </div>
</template>

<style scoped>
.party {
    margin: 24px 16px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.list-wrapper {
    margin: 0 48px;
}

.title {
    align-self: center;
}

.footer {
    align-self: flex-end;
    position: sticky;
    bottom: 32px;
    right: 32px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-button {
    background: none;
    border: none;
    color: white;
    font-size: 48px;
    cursor: pointer;
}
</style>
