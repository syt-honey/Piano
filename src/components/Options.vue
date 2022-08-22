<script lang="ts" setup>
import { onMounted, ref } from "vue";

const { storage } = defineProps(['storage']);
const showKeyName = ref(storage.state.showKeyName);
let showNoteName = ref(storage.state.showNoteName);

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("showKeyName")) {
      showKeyName.value = storage.state.showKeyName;
    }

    if (o.hasOwnProperty("showNoteName")) {
      showNoteName.value = storage.state.showNoteName;
    }
  });
});

function changeKeyStatus(k: any, v: any) {
  storage.setState({ [k]: v });
}

</script>

<template>
  <div class="piano-options">
    <label class="label">
      按键提示
      <input type="checkbox" @input="changeKeyStatus('showKeyName', !showKeyName)" id="keyname" v-model="showKeyName" />
      <i></i>
    </label>

    <label class="label">
      音名
      <input type="checkbox" id="notename" @input="changeKeyStatus('showNoteName', !showNoteName)" v-model="showNoteName" />
      <i></i>
    </label>
  </div>
</template>

<style lang="less" scoped>
@import "../assets/style/options.less";
</style>