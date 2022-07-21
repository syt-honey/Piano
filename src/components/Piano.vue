<script lang="ts" setup>
import { Notes } from "../utils/index.js";
import SmapleLibrary from "../lib/tonejs-instruments";
import { defineProps } from 'vue'
import { ref } from "vue";

export interface Note {
  type: string,
  id: number,
  keyCode: string,
  name: string,
  key: string
}

const isDev = ref(false);
let showPiano = ref(false);
const showKeyName = ref(true);
const showNoteName = ref(false);

const synth = SmapleLibrary.load({
  instruments: "piano"
}).toMaster();
const Note: Note[] = Notes;

const bindKeyBoradEvent = () => {
  let enableBlackKey = false;
  let lastKeyCode = "";
  let keyLock = false;
  let keydownTimer = 0;
  const ShiftKeyCode = "16";
  document.addEventListener(
    "keydown",
    e => {
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
          playNoteByKeyCode(keyCode);
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
        playNoteByKeyCode(keyCode);
        lastKeyCode = keyCode;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    e => {
      let keyCode = e.keyCode + "";
      // 松开Shfit键，则禁用黑色按键
      if (keyCode == ShiftKeyCode) {
        enableBlackKey = false;
      }
    },
    false
  );
};

bindKeyBoradEvent();

const getNoShowList = (): number[] => {
  let list = [2];
  let sum = 3;
  let f = false; // 对应是要加 2 还是要加 3，true 为 2
  while(sum < 23) {
    sum += f ? 2 : 3;
    list.push(sum - 1);
    f = !f;
  }
  return list;
}

const stepper: number[] = getNoShowList();

const computeEleSize = () => {
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

setTimeout(() => {
  computeEleSize();
  showPiano.value = true
}, 300)

// 根据键值播放音符
const playNoteByKeyCode = (keyCode: string) => {
  let pressedNote = getNoteByKeyCode(keyCode);
  if (pressedNote) {
    playNote(pressedNote.name);
  }
};

const getNoteByKeyCode = (keyCode: string) => {
  let target;
  let len = Note.length || 0;
  for (let i = 0; i < len; i++) {
    let note = Note[i];
    if (note.keyCode == keyCode) {
      target = note;
      break;
    }
  }
  return target;
};

const playNote = (notename = "C4", duration = "1n") => {
  if (!synth) return;
  try {
    synth.triggerAttackRelease(notename, duration);
  } catch (e) {}
};

const clickPianoKey = (e: Event, keyCode: string) => {
  let pressedNote = getNoteByKeyCode(keyCode)
  if (pressedNote) {
    playNote(pressedNote.name)
  }
}
</script>

<template>
  <div class="component-autopiano" ref="PianoComponent">
    <div class="piano-scroll-wrap">
      <div
        class="piano-wrap responsive-section-a"
        :class="{'visible': showPiano}"
      >
        <div class="piano-band">
          <div class="piano-tip">⇧ 代表 shift 键</div>
        </div>
        <div id="piano-key-wrap" class="piano-key-wrap">
          <template v-for="note in Note">
            <div
              :class="['piano-key', note.type == 'black' ? 'bkey' : 'wkey']"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  v-if="note.type == 'black'"
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
                <div v-else class="keytip">
                  <div class="keyname" v-show="showKeyName">{{ note.key }}</div>
                  <div class="notename" v-show="showNoteName">{{ note.name }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="piano-options responsive-section-a">
      <div class="option-item-wrap">
        <div class="option-item">
          <label class="label">
            显示按键提示
            <input type="checkbox" id="keyname" v-model="showKeyName" />
            <i></i>
          </label>
        </div>

        <div class="option-item">
          <label class="label">
            显示音名
            <input type="checkbox" id="notename" v-model="showNoteName" />
            <i></i>
          </label>
        </div>
      </div>
    </div>

    <canvas id="audioEffectCanvas" ref="audioEffectCanvas"
      >您的浏览器不支持
      <pre>Canvas</pre>
      。请升级到最新版的chrome、firefox、edge等浏览器。</canvas
    >
  </div>
</template>

<style lang="less">
@import "./piano.less";
</style>