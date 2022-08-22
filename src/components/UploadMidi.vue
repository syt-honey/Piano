<script lang="ts" setup>
import playImg from "../assets/img/play.png";
import pauseImg from "../assets/img/pause.png";
import uploadImg from "../assets/img/upload.png";
import { ref, computed } from "vue";

const { synth } = defineProps(['synth']);
let name = ref("");
const isPlaying = ref(false);

function loadMidi(e: Event) {
  const files = e.target?.files;

  if (files[0].type !== "audio/midi") {
    alert("请选择midi文件上传");
    return;
  }

  name.value = files[0]?.name || "";

  const reader = new FileReader();
  reader.onload = () => {
    synth.loadMIDI(reader.result);
  }
  reader.readAsArrayBuffer(files[0]);
}

function play() {
  if (!name.value) {
    alert("请选择需要播放的文件")
  }

  if (isPlaying.value) {
    synth.stopMIDI();
    isPlaying.value = false;
  } else {
    isPlaying.value = true;
    synth.playMIDI();
  }
}

const getSrc = computed(() => {
  return isPlaying.value ? playImg : pauseImg;
})
</script>

<template>
  <div class="flex-center">
    <div class="upload-container">
      <img width="24" :src="uploadImg" alt="">
      <input @change="loadMidi($event)" type="file">
    </div>

    <span class="upload-tip text-overflow">{{ name || '请选择midi文件'}}</span>
        
    <img v-if="name" @click="play" :class="['play-icon', isPlaying && 'has-padding']" :src="getSrc" alt="">
  </div>
</template>

<style lang="less" scoped>
.upload-container {
  position: relative;
  width: 24px;
  height: 24px;
  overflow: hidden;

  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
}

.upload-tip {
  width: 85px;
  margin-top: 5px;
  margin-left: 12px;
  font-size: 12px;
}

.play-icon {
  margin-left: 12px;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.has-padding {
  padding: 4px;
}
</style>