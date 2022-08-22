<script lang="ts" setup>
import playImg from "../assets/img/play.png";
import pauseImg from "../assets/img/pause.png";
import uploadImg from "../assets/img/upload.png";
import { ref, computed, onMounted } from "vue";
// import { Midi } from "@tonejs/midi";
// import * as Tone from "tone";

const { synth, storage } = defineProps(['synth', 'storage']);
let midiName = ref(storage.state.midiName);
let isPlaying = ref(storage.state.isPlaying);

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("midiName")) {
      midiName.value = storage.state.midiName;
    }
    if (o.hasOwnProperty("isPlaying")) {
      isPlaying.value = storage.state.isPlaying;
    }
  });
});

function loadMidi(e: Event) {
  const files = e.target?.files;

  if (files[0].type !== "audio/midi") {
    alert("请选择midi文件上传");
    return;
  }

  storage.setState({ midiName: files[0]?.name || "" });

  const reader = new FileReader();
  reader.onload = () => {
    // midi = new Midi(reader.result);
    synth.loadMIDI(reader.result);
  }
  reader.readAsArrayBuffer(files[0]);
}

function play() {
  if (!midiName.value) {
    alert("请选择需要播放的文件")
  }

  if (isPlaying.value) {
    synth.stopMIDI();
    storage.setState({ isPlaying: false })
  } else {
    storage.setState({ isPlaying: true })
    synth.playMIDI();

    // const now = Tone.now() + 0.5;
    // midi.tracks.forEach((track: any) => {
    //   const synth = new Tone.PolySynth(Tone.Synth, {
    //     envelope: {
    //       attack: 0.02,
    //       decay: 0.1,
    //       sustain: 0.3,
    //       release: 1,
    //     },
    //   }).toDestination();

    //   track.notes.forEach((note: any) => {
    //     synth.triggerAttackRelease(
    //       note.name,
    //       note.duration,
    //       note.time + now,
    //       note.velocity
    //     );
    //   });
    // });

    // synth.send(['ch', 'name', 'velocity', ''])
  }
}

const getSrc = computed(() => {
  return isPlaying.value ? playImg : pauseImg;
})
</script>

<template>
  <div class="flex-center">
    <div class="upload-container flex-center">
      <img width="24" :src="uploadImg" alt="">
      <input @change="loadMidi($event)" type="file" accept="audio/midi">
      <span class="upload-tip text-overflow">{{ midiName || '请选择midi文件'}}</span>
    </div>

        
    <img v-if="midiName" @click="play" :class="['play-icon', isPlaying && 'has-padding']" :src="getSrc" alt="">
  </div>
</template>

<style lang="less" scoped>
.upload-container {
  position: relative;
  overflow: hidden;
  cursor: pointer;

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