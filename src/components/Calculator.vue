<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Retirement Calculator</div>
    </q-card-section>

    <q-separator/>

    <q-card-section>
      ...
    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn outline color="primary" icon="fas fa-save" label="Save"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
  import { Variables } from 'components/models';

  export default {
    name: 'Calculator',
    data() {
      const variables: Variables = {
        age: 25,
        retirementAge: 65
      };
      return { variables };
    }
  };
</script>
