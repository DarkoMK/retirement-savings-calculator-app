<template>
  <div class="row q-pa-md justify-center">
    <div class="col col-xs-12 col-sm-8">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Saved Results</div>
        </q-card-section>

        <q-separator></q-separator>

        <q-table
          :data="tableData"
          :columns="tableColumns"
          row-key="name"
          separator="cell"
          dense
          :loading="loading"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="age" :props="props">
                {{ props.row.age }}
              </q-td>
              <q-td key="retirementAge" :props="props">
                {{ props.row.retirementAge }}
              </q-td>
              <q-td key="annualIncome" :props="props">
                ${{ props.row.annualIncome }}
              </q-td>
              <q-td key="neededIncomePercent" :props="props">
                {{ props.row.neededIncomePercent }}%
              </q-td>
              <q-td key="annualSavingsPercent" :props="props">
                {{ props.row.annualSavingsPercent }}%
              </q-td>
              <q-td key="annualReturnPercent" :props="props">
                {{ props.row.annualReturnPercent }}%
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-separator></q-separator>

        <q-card-actions align="right">
          <q-btn outline icon="fas fa-arrow-left" label="Back" to="/"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>

</template>

<script lang="ts">
  import { Variables } from 'components/models';
  import Calculator from 'components/Calculator.vue';
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Results',
    components: { Calculator },
    data() {
      const tableData: Variables[] = [];
      return {
        filter: '',
        filterTimeout: setTimeout(() => '', 1000),
        loading: true,
        tableData,
        tableColumns: [
          { name: 'name', label: 'Name', field: 'year', sortable: false, align: 'left' },
          { name: 'age', label: 'Age', field: 'age', sortable: false, align: 'left' },
          { name: 'retirementAge', label: 'Retirement Age', field: 'retirementAge', sortable: false, align: 'left' },
          { name: 'annualIncome', label: 'Annual Income($)', field: 'annualIncome', sortable: false, align: 'left' },
          {
            name: 'neededIncomePercent',
            label: 'Desired Pension(%)',
            field: 'neededIncomePercent',
            sortable: false,
            align: 'left'
          },
          {
            name: 'annualSavingsPercent',
            label: 'Annual Savings(%)',
            field: 'annualSavingsPercent',
            sortable: false,
            align: 'left'
          },
          {
            name: 'annualReturnPercent',
            label: 'Annual Return(%)',
            field: 'annualReturnPercent',
            sortable: false,
            align: 'left'
          }
        ]
      };
    },
    watch: {
      filter() {
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
          this.fetchData();
        }, 500);
      }
    },
    mounted(): void {
      this.fetchData();
    },
    methods: {
      fetchData(): void {
        this.$axios.get('http://localhost:8000/api/calculator?q=' + this.filter)
          .then(res => {
            this.tableData = res.data.data;
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
            this.$q.notify({ message: 'Error happened.', type: 'warning', position: 'bottom-left' });
          });
      }
    }
  });
</script>
