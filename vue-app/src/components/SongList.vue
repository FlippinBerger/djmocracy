<script setup lang='ts'>
    const {songs} = defineProps(['songs']);

</script>

<template>
    <ul>
        <li v-for="song in songs">
            <div class='item'>
                <h3>{{song.votes}}</h3>
                <h2>{{song.title}} by {{song.artist}}</h2>
            </div>
        </li>
    </ul>
</template>

<style>
li {
    color: white;
    list-style-type: none;
}

.item {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 8px;
}

</style>
