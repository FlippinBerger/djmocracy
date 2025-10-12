<script setup lang='ts'>
    import { ref } from 'vue';

    const emit = defineEmits(['addSong'])

    const title = ref('');
    const artist = ref('')


    const addSongHandler = () => {
        console.log(`adding song ${title.value} by ${artist.value}`);

        emit('addSong', title.value, artist.value);
        title.value = '';
        artist.value = '';
    }
</script>

<template>
    <div class='modal'>
        <label class='label' for='search'>Title</label>
        <input v-model='title' name='search' class='in' type="search" />

        <label class='label' for='search'>Artist</label>
        <input v-model='artist' name='search' class='in' type="search" />

        <label class='label' for='search'>Add a song</label>
        <input name='search' class='in' type="search" />

        <button class='btn' @click='addSongHandler'>Add Song</button>
    </div>
</template>

<style scoped>
.modal {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    align-self: center;
    height: 40%;
    width: 60%;
    border-radius: 16px;
    border: solid;
    border-color: white;
}

.in {
    padding: 6px;
}

.btn {
    margin-top: 8px;
    padding: 4px;
}

</style>
