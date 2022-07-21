<script lang="ts" setup>
import Piano from "./Piano.vue";
import Footer from "./Footer.vue";
import type { AppContext } from "@netless/window-manager";
import { inject } from "vue";

const context = inject < AppContext >("context");
if (!context) throw new Error("must call provide('context') before mount App");
</script>

<template>
  <Piano :context="context"></Piano>
  <!-- <Footer></Footer> -->
</template>