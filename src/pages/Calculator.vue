<template>
  <q-page>
    <div class="row q-pa-md justify-center">
      <div class="col col-xs-12 col-sm-6">
        <q-card class="q-pa-md" v-if="step === 1">
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
            <q-slider v-model="variables.neededIncomePercent" :min="neededIncomePercentMin"
                      :max="neededIncomePercentMax"
                      label :step="5"/>
            <span>I save <b>{{ variables.annualSavingsPercent }}% - {{ formatter((variables.annualIncome/100) * variables.annualSavingsPercent) }}</b> of my yearly income for the retirement</span>
            <q-slider v-model="variables.annualSavingsPercent" :min="annualSavingsPercentMin"
                      :max="annualSavingsPercentMax"
                      label :step="5"/>
            <span>I expect and annual return of <b>{{ variables.annualReturnPercent }}%</b></span>
            <q-slider v-model="variables.annualReturnPercent" :min="annualReturnPercentMin"
                      :max="annualReturnPercentMax"
                      label :step="0.10"/>
          </q-card-section>

          <q-separator/>

          <q-card-actions align="right">
            <q-btn outline icon="fas fa-save" label="List Saved Results" to="/results"></q-btn>
            <q-btn outline color="primary" icon="fas fa-calculator" label="Calculate" @click="calculate"></q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="q-pa-md" v-if="step === 2">
          <q-card-section>
            <div class="text-h6">Retirement Calculator</div>

            <q-separator/>
            <q-card-section>
              <q-table
                :data="tableData"
                :columns="tableColumns"
                row-key="year"
                separator="cell"
                dense
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="year" :props="props">
                      {{ props.row.year }}
                    </q-td>
                    <q-td key="invested" :props="props">
                      {{ formatter(props.row.invested) }}
                    </q-td>
                    <q-td key="accYield" :props="props">
                      {{ formatter(props.row.accYield) }}
                    </q-td>
                    <q-td key="yearlyYield" :props="props">
                      {{ formatter(props.row.yearlyYield) }}
                    </q-td>
                    <q-td key="amountSaved" :props="props">
                      {{ formatter(props.row.amountSaved) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card-section>

            <q-card-section>
          <span>
            Currently you are making <b>{{ formatter(variables.annualIncome) }}</b> per year and your desired pension is <b>{{ formatter(desiredPension) }}</b> per year.
            Based on the parameters you provided, you can save total of <b>{{ formatter(tableData[tableData.length - 1].amountSaved) }}</b> or that will be <b>{{ formatter(tableData[tableData.length - 1].amountSaved / 25) }}</b> per year taken that the retirement duration is 25 years.
          </span>
              <p>The yearly difference between the desired pension and the saved is <b style="color: red">{{
                formatter(desiredPension - tableData[tableData.length - 1].amountSaved / 25) }}</b>.
                <br>
                The monthly difference between the desired pension and the saved is <b style="color: red">{{
                  formatter(desiredPension / 12 - tableData[tableData.length - 1].amountSaved / 25 / 12) }}</b>.</p>
            </q-card-section>

            <q-separator/>

            <q-card-section>
              <highcharts :options="chartOptions"></highcharts>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline icon="fas fa-arrow-left" label="Back" @click="step = 1"></q-btn>
              <q-btn outline color="primary" icon="fas fa-save" label="Save to DB" @click="saveDB"></q-btn>
              <q-btn outline color="secondary" icon="fas fa-file-pdf" label="Save as PDF" @click="savePDF"></q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import { Variables, TableData, ChartOptionSeries } from 'components/models';
  import Vue from 'vue';
  import { Chart } from 'highcharts-vue';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import { UserOptions } from 'jspdf-autotable';

  interface JsPDFwithPlugin extends jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  export default Vue.extend({
    name: 'Calculator',
    components: {
      highcharts: Chart
    },
    data() {
      const variables: Variables = {
        id: 0,
        name: '',
        age: 25,
        retirementAge: 65,
        annualIncome: 10000,
        neededIncomePercent: 85,
        annualSavingsPercent: 10,
        annualReturnPercent: 2
      };
      const tableData: TableData[] = [];
      const series: ChartOptionSeries[] = [];
      const formattedData: Array<Array<string>> = [];
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
        annualReturnPercentMax: 20,
        step: 1,
        tableData,
        formattedData,
        tableColumns: [
          { name: 'year', label: 'Year', field: 'year', sortable: false, align: 'left' },
          { name: 'invested', label: 'Invested($)', field: 'invested', sortable: false, align: 'left' },
          { name: 'accYield', label: 'Accumulated Yield($)', field: 'accYield', sortable: false, align: 'left' },
          { name: 'yearlyYield', label: 'Yearly Yield($)', field: 'yearlyYield', sortable: false, align: 'left' },
          { name: 'amountSaved', label: 'Saved($)', field: 'amountSaved', sortable: false, align: 'left' }
        ],
        chartOptions: {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Difference'
          },
          xAxis: {
            categories: ['Yearly', 'Monthly']
          },
          series
        }
      };
    },
    computed: {
      desiredPension(): number {
        return (this.variables.annualIncome / 100) * this.variables.neededIncomePercent;
      }
    },
    mounted(): void {
      if (Object.keys(this.$route.params).length && 'loadID' in this.$route.params) {
        this.$q.loading.show();
        this.$axios.get('http://localhost:8000/api/calculator/' + this.$route.params.loadID)
          .then(res => {
            this.variables = res.data.data[0];
            this.$q.loading.hide();
            this.calculate();
          })
          .catch(error => {
            console.log(error);
            this.$q.notify({ message: 'Error happened.', type: 'warning', position: 'bottom-left' });
            this.$q.loading.hide();
          });
      } else if (this.variables.name === '') {
        this.$q.dialog({
          title: 'Prompt',
          message: 'What is your name? (Minimum 3 characters)',
          prompt: {
            model: '',
            isValid: (val: string) => val.length > 2,
            type: 'text'
          },
          cancel: false,
          persistent: true
        }).onOk((data: string) => {
          this.variables.name = data;
        });
      }
    },
    methods: {
      formatter(number: number): string {
        return formatter.format(number);
      },
      calculate(): void {
        this.tableData = [];
        const yearsUntilRetirement = 65 - this.variables.age;
        const firstYearInvestment = (this.variables.annualIncome / 100) * this.variables.annualSavingsPercent;

        for (let y = 1; y <= yearsUntilRetirement; y++) {
          const currentYearInvestment = (y === 1) ? firstYearInvestment : this.tableData[this.tableData.length - 1].amountSaved + firstYearInvestment;
          const accYield = (y === 1) ? 0 : this.tableData[this.tableData.length - 1].yearlyYield + this.tableData[this.tableData.length - 1].accYield;
          const currentYearYield = (currentYearInvestment / 100) * this.variables.annualReturnPercent;
          const amountSaved = currentYearInvestment + currentYearYield;
          this.tableData.push({
            year: y,
            invested: currentYearInvestment,
            accYield: accYield,
            yearlyYield: currentYearYield,
            amountSaved: amountSaved
          });

          this.formattedData.push([y.toString(), this.formatter(currentYearInvestment), this.formatter(accYield), this.formatter(currentYearYield), this.formatter(amountSaved)]);
        }
        //populate Chart data
        this.chartOptions.series = [
          {
            name: 'What you may have',
            data: [this.tableData[this.tableData.length - 1].amountSaved / 25, this.tableData[this.tableData.length - 1].amountSaved / 25 / 12]
          },
          {
            name: 'Desired pension',
            data: [this.desiredPension, this.desiredPension / 12]
          }
        ];

        this.step = 2;
      },
      savePDF(): void {
        const doc = new jsPDF('portrait', 'px', 'a4') as JsPDFwithPlugin;
        doc.autoTable({
          head: [['Year', 'Invested($)', 'Accumulated Yield($)', 'Yearly Yield($)', 'Saved($)']],
          body: this.formattedData
        });

        doc.save('Calculation.pdf');
      },
      saveDB() {
        this.$axios.post('http://localhost:8000/api/calculator', this.variables)
          .then(res => {
            // console.log(res);
            this.$q.notify({ message: res.data.message, type: 'info', position: 'bottom-left' });
            this.$router.push('/results');
          })
          .catch(error => {
            console.log(error);
            this.$q.notify({ message: 'Error happened.', type: 'warning', position: 'bottom-left' });
          });
      }
    }
  });
</script>
