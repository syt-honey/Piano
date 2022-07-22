<script lang="ts" setup>
import type { Note, KeyPressType } from "./typings";

import { Notes } from "../utils/index.js";
import { getToHandleList, getNoteByKeyCode } from "../utils/common.js";
import SmapleLibrary from "../lib/tonejs-instruments";
import { ref, onMounted, nextTick, onBeforeUnmount, reactive } from "vue";

let showPiano = ref(false);
let preNoteIdx: number = -1;
const isDev = ref(false);
const showKeyName = ref(true);
const showNoteName = ref(false);
const ShiftKeyCode = "16";
let enableBlackKey = false;

const noteList: Note[] = reactive(Notes);
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
  initKeyboardEvent();

  nextTick(() => {
    computeEleSize();
    showPiano.value = true
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
  document.onkeydown = e => toKeyDown(e)
  document.onkeyup = e => toKeyUp(e);
};

function toKeyUp(e: KeyboardEvent) {
  let keyCode = e.keyCode + "";
  if (keyCode == ShiftKeyCode) {
    enableBlackKey = false;
  }

  if (preNoteIdx !== -1) {
    noteList[preNoteIdx].actived = false;
  }
}

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
    // 连续触发同一个键时，应节流 + 延音
    if (!keyLock) {
      toPlayNote(null, keyCode, "keyboard");
      // 这里应该延音，解决中...
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
    toPlayNote(null, keyCode, "keyboard");
    lastKeyCode = keyCode;
  }

  e.preventDefault();
}

function toPlayNote(e: Event | null, keyCode: string, type?: KeyPressType): void {
  let { note, idx } = getNoteByKeyCode(noteList, keyCode);

  if (note) {
    playNote(note.name);

    if (type === "keyboard" && idx) {
      if (preNoteIdx !== -1) {
        noteList[preNoteIdx].actived = false;
      }

      preNoteIdx = idx;
      noteList[idx].actived = true;
    }
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
        <template v-for="note in noteList">
          <div
            :class="[
              'piano-key',
              getKeyType(note.type),
              note.actived && `${getKeyType(note.type)}-active`
            ]"
            :data-keyCode="note.keyCode"
            :data-name="note.name"
            @click.stop="toPlayNote($event, note.keyCode)"
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
      <input type="checkbox" id="keyname" v-model="showKeyName" />
      <i></i>
    </label>

    <label class="label">
      显示音名
      <input type="checkbox" id="notename" v-model="showNoteName" />
      <i></i>
    </label>
  </div>
</template>

<style lang="less">
@import "./piano.less";
</style>