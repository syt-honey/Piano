<script lang="ts" setup>
import { watch, ref } from "vue";

const { synth } = defineProps(['synth']);
let selectedProg = ref(0);
const progs = getProgs();

watch(selectedProg, (i) => {
  if (synth) {
    synth.send([0xc0, i]);
  }
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
  <select class="piano-select" v-model="selectedProg">
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