import type { NetlessApp } from "@netless/window-manager";

import { createApp } from "vue";
import styles from "./style.css?inline";
import App from "./components/App.vue";

const Counter: NetlessApp = {
  kind: "Piano",
  setup(context) {
    const box = context.getBox();
    box.mountStyles(styles);

    const $content = document.createElement("div");
    $content.className = "piano-container";
    box.mountContent($content);

    const app = createApp(App).provide("context", context);

    app.mount($content);

    context.emitter.on("destroy", () => {
      app.unmount();
    });
  },
};

export default Counter;
