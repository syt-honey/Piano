import type { WindowManager } from "@netless/window-manager";

declare global {
  const __APP_VERSION__: string;

  declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  interface Window {
    manager: WindowManager;
  }
}

export {};
