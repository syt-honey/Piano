<script lang="ts" setup>
import Main from "./Main.vue";
import type { AppContext } from "@netless/window-manager";
import { inject } from "vue";

const context = inject < AppContext >("context");
if (!context) throw new Error("must call provide('context') before mount App");
</script>

<template>
  <Main :context="context"></Main>
</template>