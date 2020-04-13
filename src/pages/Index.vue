<template>
  <q-page>
    <div class="row q-pa-md justify-center">
      <calculator></calculator>
    </div>
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
