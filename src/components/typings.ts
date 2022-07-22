export interface Note {
  type: string,
  id: number,
  keyCode: string,
  name: string,
  key: string,
  actived?: boolean
}

export type KeyPressType = "mouse" | "keyboard";

