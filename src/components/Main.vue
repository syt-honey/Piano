<script lang="ts" setup>
import Piano from "./Piano.vue";
import Options from "./Options.vue";
import WebAudioTinySynth from 'webaudio-tinysynth';
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";

const synth = new WebAudioTinySynth({ quality: 1, useReverb: 0 });
const { context } = defineProps(['context']);

const storage = context.createStorage("Piano", {
  showKeyName: true,
  showNoteName: false,
  showPiano: false,
  currentIdx: -1,
  noteName: ""
});

let showPiano = ref(storage.state.showPiano);

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("showPiano")) {
      showPiano.value = storage.state.showPiano;
    }
  });

  nextTick(() => {
    storage.setState({ showPiano: true });
  });
});

onBeforeUnmount(() => {
  storage.deleteStorage();
});

</script>

<template>
  <div class="piano-scroll-wrap">
    <div :class="['piano-wrap', showPiano && 'visible']">
      <Piano :synth="synth" :context="context" :storage="storage"></Piano>
    </div>
    <Options :storage="storage"></Options>
  </div>
</template>

<style lang="less">
@import "../assets/style/main.less";
</style>