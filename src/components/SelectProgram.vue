<script lang="ts" setup>
import { watch, ref, onMounted } from "vue";

const { synth, storage } = defineProps(['synth', 'storage']);
let program = ref(storage.state.program);
const progs = getProgs();

watch(program, (i) => {
  storage.setState({ program: i })
  if (synth) {
    synth.send([0xc0, i]);
  }
});

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("program")) {
      program.value = storage.state.program;
    }
  });
});

function getProgs() {
  let res = [];
  if (synth) {
    for(let i = 0; i < 128; ++i){
      res.push(synth.getTimbreName(0, i));
    }
  }
    return res;
}
</script>
<template>
  <select class="piano-select" v-model="program">
    <option v-for="(t, idx) in progs" :value="idx">{{t}}</option>
  </select>
</template>

<style lang="less" scoped>
.piano-select {
  padding: 0 8px;
}

select {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

select:focus {
  border: none;
  outline: none;
}
</style>