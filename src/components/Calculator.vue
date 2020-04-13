<template>
  <div class="col col-xs-12 col-sm-6">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Retirement Calculator</div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <span>I am <b>{{ variables.age }}</b> years old</span>
        <q-slider v-model="variables.age" :min="ageMin" :max="ageMax" label/>
        <span>I make <b>{{ formatter(variables.annualIncome) }}</b> a year</span>
        <q-slider v-model="variables.annualIncome" :min="incomeMin" :max="incomeMax" label
                  :label-value="formatter(variables.annualIncome)" :step="5000"/>
        <span>My desired pension amount is <b>{{ variables.neededIncomePercent }}%</b> of my yearly income</span>
        <q-slider v-model="variables.neededIncomePercent" :min="neededIncomePercentMin" :max="neededIncomePercentMax"
                  label :step="5"/>
        <span>I save <b>{{ variables.annualSavingsPercent }}% - {{ formatter((variables.annualIncome/100) * variables.annualSavingsPercent) }}</b> of my yearly income for the retirement</span>
        <q-slider v-model="variables.annualSavingsPercent" :min="annualSavingsPercentMin" :max="annualSavingsPercentMax"
                  label :step="5"/>
        <span>I expect and annual return of <b>{{ variables.annualReturnPercent }}%</b></span>
        <q-slider v-model="variables.annualReturnPercent" :min="annualReturnPercentMin" :max="annualReturnPercentMax"
                  label :step="0.10"/>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn outline color="primary" icon="fas fa-save" label="Save"></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
  import { Variables } from 'components/models';

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  export default {
    name: 'Calculator',
    data() {
      const variables: Variables = {
        age: 25,
        retirementAge: 65,
        annualIncome: 10000,
        neededIncomePercent: 85,
        annualSavingsPercent: 10,
        annualReturnPercent: 2
      };
      return {
        variables,
        ageMin: 25,
        ageMax: 65,
        incomeMin: 10000,
        incomeMax: 100000,
        neededIncomePercentMin: 10,
        neededIncomePercentMax: 200,
        annualSavingsPercentMin: 10,
        annualSavingsPercentMax: 50,
        annualReturnPercentMin: 0.10,
        annualReturnPercentMax: 20
      };
    },
    methods: {
      formatter(number: number) {
        return formatter.format(number);
      }
    }
  };
</script>
