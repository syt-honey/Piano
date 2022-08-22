<script lang="ts" setup>
import SelectProgram from "./SelectProgram.vue";
// import UploadMidi from "./UploadMidi.vue";

import { getToHandleList, getNoteByKeyCode, getNoteByTick } from "../utils/common.js";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import type { Note } from "../utils/typings";
import { Notes } from "../utils/index.js";

const { storage, context, synth } = defineProps(['storage', 'context', 'synth']);

let noteList: Note[] = Notes;
let currentIdx = ref(storage.state.currentIdx);
let showNoteName = ref(storage.state.showNoteName);
let noteName = ref(storage.state.noteName);
const showKeyName = ref(storage.state.showKeyName);
const stepper: number[] = getToHandleList();

const curNoteName = ref(storage.state.curNoteName);

const ShiftKeyCode = "16";
let enableBlackKey = false;

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("showKeyName")) {
      showKeyName.value = storage.state.showKeyName;
    }

    if (o.hasOwnProperty("showNoteName")) {
      showNoteName.value = storage.state.showNoteName;
    }

    if (o.hasOwnProperty("currentIdx")) {
      currentIdx.value = storage.state.currentIdx;
    }

    if (o.hasOwnProperty("curNoteName")) {
      curNoteName.value = storage.state.curNoteName;
    }

    if (o.hasOwnProperty("noteName")) {
      noteName.value = storage.state.noteName;

      if (noteName.value && currentIdx.value !== -1) {
        context.dispatchMagixEvent(
          "play",
          noteName.value
        );
        storage.setState({ noteName: "" });
      }
    }
  });

  initKeyboardEvent();

  nextTick(() => {
    computeEleSize();
  });
});

context.addMagixEventListener("play", (e: any) => {
  playNote(e.payload);
})

window?.manager.emitter.on("boxStateChange", (state) => {
  if (state === "minimized") {
    clearKeyboardEvent();
  }
});

onBeforeUnmount(() => {
  clearKeyboardEvent();
});

function clearKeyboardEvent() {
  document.onkeydown = null;
  document.onkeyup = null;
}

function initKeyboardEvent(): void {
  document.onkeydown = e => toKeyDown(e);
  document.onkeyup = e => toKeyUp(e);
};

function computeEleSize(): void {
    const key = document.getElementById('piano-key-wrap');
    const wkey_width = 0.02775;
    const bkey_width = 0.0222;

    if (key) {
      key.style.height = (key.getBoundingClientRect().width / 36) * 7 + 'px';

      const bk = document.getElementsByClassName('bkey');
      if (bk.length) {
        Array.from(bk).reduce((pre, cur, idx)=> {
          let bleft = pre + wkey_width;

          if (stepper.includes(idx)) {
            bleft =  pre + wkey_width * 2
          }

          cur.style.left = bleft * 100 + "%";
          return bleft;
        }, - bkey_width / 2);
      }
    }
}

function toKeyUp(e: KeyboardEvent) {
  let keyCode = e.keyCode + "";
  if (keyCode == ShiftKeyCode) {
    enableBlackKey = false;
  }
  storage.setState({ currentIdx: -1});
}

function toKeyDown(e: KeyboardEvent) {
  let lastKeyCode = "";
  let keyLock = false;
  let keydownTimer = 0;
  let keyCode = e.keyCode + "";

  // 按住Shfit键，则启用黑色按键
  if (keyCode == ShiftKeyCode) {
    enableBlackKey = true;
  }

  if (enableBlackKey) keyCode = "b" + keyCode;

  if (keyCode == lastKeyCode) {
    if (!keyLock) {
      toPlayNote(keyCode);
      lastKeyCode = keyCode;
      keyLock = true;
    }
    if (keydownTimer) {
      clearTimeout(keydownTimer);
      keydownTimer = 0;
    }

    keydownTimer = setTimeout(() => {
      keyLock = false;
    }, 120);

  } else {
    toPlayNote(keyCode);
    lastKeyCode = keyCode;
  }

  e.preventDefault();
}

function getKeyType(type: string) {
  return type === "black" ? "bkey" : "wkey";
}

function toMouseDown(e: Event, keyCode: string) {
  toPlayNote(keyCode)
}

function playNote(notename: string = "60"): void {
  if (!synth) return;
  try {
    const note = getNoteByTick(noteList, notename);
    note && storage.setState({ curNoteName: note });
    synth.send([0x90, notename, 100]);
  } catch (e) {}
};

function toMouseUp() {
  storage.setState({ currentIdx: -1});
}

function toPlayNote(keyCode: string): void {
  const { note, idx } = getNoteByKeyCode(noteList, keyCode);

  if (note) {
    storage.setState({ currentIdx: idx, noteName: note.note });
  }
}
</script>

<template>
  <div class="piano-band flex-center">
    <div class="piano-tip flex-center">
      <div v-if="curNoteName" class="piano-tip__view" style="width: 30px">{{ curNoteName }}</div>

      <div>
        乐器：<SelectProgram :synth="synth" :storage="storage"></SelectProgram>
      </div>

      <!-- <div>
        <UploadMidi :synth="synth" :storage="storage"></UploadMidi>
      </div> -->
    </div>
  </div>
  <div id="piano-key-wrap" class="piano-key-wrap">
    <template v-for="(note, idx) in noteList">
      <div
        :class="[
          'piano-key',
          getKeyType(note.type),
          idx === currentIdx && `${getKeyType(note.type)}-active`
        ]"
        :data-keyCode="note.keyCode"
        :data-name="note.name"
        @mousedown.stop="toMouseDown($event, note.keyCode)"
        @mouseup.stop="toMouseUp()"
      >
        <div class="keytip">
          <div
            v-if="note.type == 'black'"
            v-show="showKeyName"
            class="keyname"
            v-html="note.key"
          ></div>
          <div v-else class="keytip">
            <div class="keyname" v-show="showKeyName">{{ note.key }}</div>
            <div class="notename" v-show="showNoteName">
              {{ note.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
@import "../assets/style/piano.less";
</style>