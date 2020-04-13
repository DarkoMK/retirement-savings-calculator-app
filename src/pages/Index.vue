<template>
  <q-page class="row items-center justify-evenly">
    <calculator></calculator>
  </q-page>
</template>

<script lang="ts">
  import Calculator from 'components/Calculator.vue';

  export default {
    name: 'PageIndex',
    components: { Calculator },
    data() {
      return {};
    }
  };
</script>
