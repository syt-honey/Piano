<script lang="ts" setup>
import type { Note } from "./typings";

import { Notes } from "../utils/index.js";
import SmapleLibrary from "../lib/tonejs-instruments";
import { getToHandleList, getNoteByKeyCode } from "../utils/common.js";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";

const { context } = defineProps(['context']);

const storage = context.createStorage("APianoni1234435", {
  showKeyName: true,
  showNoteName: false,
  showPiano: false,
  currentIdx: -1,
  noteName: ""
});

const showKeyName = ref(storage.state.showKeyName);
let showNoteName = ref(storage.state.showNoteName);
let showPiano = ref(storage.state.showPiano);
let currentIdx = ref(storage.state.currentIdx);
let noteName = ref(storage.state.noteName);
let noteList: Note[] = Notes;

const isDev = ref(false);
const ShiftKeyCode = "16";
let enableBlackKey = false;

const stepper: number[] = getToHandleList();

const synth = SmapleLibrary.load({
  instruments: "piano"
}).toMaster();

window?.manager.emitter.on("boxStateChange", (state) => {
  if (state === "minimized") {
    clearKeyboardEvent();
  }
});

onMounted(() => {
  storage.addStateChangedListener((o: any) => {
    if (o.hasOwnProperty("showKeyName")) {
      showKeyName.value = storage.state.showKeyName;
    }

    if (o.hasOwnProperty("showNoteName")) {
      showNoteName.value = storage.state.showNoteName;
    }

    if (o.hasOwnProperty("showPiano")) {
      showPiano.value = storage.state.showPiano;
    }

    if (o.hasOwnProperty("currentIdx")) {
      currentIdx.value = storage.state.currentIdx;
      noteName.value = storage.state.playNote;
      playNote(noteName.value)
    }
  });

  initKeyboardEvent();

  nextTick(() => {
    computeEleSize();
    storage.setState({ ...storage.state, showPiano: true });
  });
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

function toKeyDown(e: KeyboardEvent) {
  let lastKeyCode = "";
  let keyLock = false;
  let keydownTimer = 0;
  let keyCode = e.keyCode + "";

  if (isDev.value) console.log("keydown", keyCode);

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

function toKeyUp(e: KeyboardEvent) {
  let keyCode = e.keyCode + "";
  if (keyCode == ShiftKeyCode) {
    enableBlackKey = false;
  }
  storage.setState({ currentIdx: -1});
}

function toMouseDown(e: Event, keyCode: string) {
  toPlayNote(keyCode)
}

function toMouseUp() {
  currentIdx.value = -1;
  storage.setState({ currentIdx: -1});
}

function toPlayNote(keyCode: string): void {
  let { note, idx } = getNoteByKeyCode(noteList, keyCode);

  if (note) {
    storage.setState({ currentIdx: idx, noteName: note.name});
  }
}

function playNote(notename: string = "C4", duration: string = "1n"): void {
  if (!synth) return;
  try {
    synth.triggerAttackRelease(notename, duration);
  } catch (e) {}
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

function getKeyType(type: string) {
  return type === "black" ? "bkey" : "wkey";
}

function changeKeyStatus(k: any, v: any) {
  storage.setState({ [k]: v });
}
</script>

<template>
  <div class="piano-scroll-wrap">
    <div
      class="piano-wrap responsive-section-a"
      :class="{ visible: showPiano }"
    >
      <div class="piano-band">
        <div class="piano-tip">⇧ 代表 shift 键</div>
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
    </div>
  </div>

  <div class="piano-options">
    <label class="label">
      显示按键提示
      <input type="checkbox" @input="changeKeyStatus('showKeyName', !showKeyName)" id="keyname" v-model="showKeyName" />
      <i></i>
    </label>

    <label class="label">
      显示音名
      <input type="checkbox" id="notename" @input="changeKeyStatus('showNoteName', !showNoteName)" v-model="showNoteName" />
      <i></i>
    </label>
  </div>
</template>

<style lang="less">
@import "./piano.less";
</style>