import type { Note } from "./../components/typings";
/**
 * 观察可知，黑键为 2 个、3 个间隔排放。所以可以将 idx 从 0 开始计算，同时与 2、3间隔相加，即可得出需要特殊处理的黑键下标。
 * @returns 需要黑键中特殊处理键的下标列表。
 */
export function getToHandleList(): number[] {
  let idx = 0;
  const maxIdx = 24;
  const list = [];

  let f = true;
  while (idx < maxIdx) {
    if (idx > 0) list.push(idx);
    idx += f ? 2 : 3;
    f = !f;
  }

  return list;
}

/**
 * 根据 keyCode 获取对应的音源信息
 * @param noteList 音源列表
 * @param keyCode 键入的 keyCode
 * @returns 音源列表中对应 keyCode 的项
 */
type R = {
  note: Note | null,
  idx: number
};
export function getNoteByKeyCode(noteList: Note[], keyCode: string): R {
  let idx = 0;
  const note: Note | null =
    noteList.find((n, i) => {
      if (n.keyCode == keyCode) idx = i;
      return n.keyCode == keyCode
    }) || null;

  return {
    note,
    idx
  };
}