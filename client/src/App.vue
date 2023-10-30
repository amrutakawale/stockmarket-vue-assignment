<template>
  <div id="app">
    <h1>Mock Data from Express.js</h1>
      
      <div class="input-container">
        <input v-model="symbol" placeholder="Enter Stock Symbol" />
        <select v-model="period">
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
        </select>
        <button class="fetch-button" @click="fetchData">Fetch Data</button>
      </div>
      <div class="chart" id="chart-container"></div>
      <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import { createChart } from 'lightweight-charts';


export default {
  data() {
    return {
      symbol: 'AAPL', 
      period: 'daily', 
      chart: null,
      lineSeries: null,
      error: null,
      showGraph: false,
    };
  },
  mounted() {
    this.renderChart();
  },
  created() {
    this.axios.get('/api/data').then((response) => {
      this.data = response.data;
    });
  },
   methods: {
     renderChart() {
      this.chart = createChart('chart-container', { width: 800, height: 400 });
      this.lineSeries = this.chart.addCandlestickSeries();
    },
    async fetchData() {
      try {
        this.error = null; 
        const response = await this.axios.get(`/api/search?symbol=${this.symbol}&period=${this.period}`);
        this.showGraph = true
        const data = response.data;
        data.sort((a, b) => a.time - b.time);
        const formattedData = data.map(item => ({
          time: new Date(item.time).getTime(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        if (this.lineSeries) {
          this.chart.removeSeries(this.lineSeries);
        }

        this.lineSeries = this.chart.addCandlestickSeries();
        this.lineSeries.setData(formattedData);

      } catch (error) {
        console.error(error);
        this.error = 'Failed to fetch data. Please try again.'; 
      }
    },
  },
};
</script>
<style scoped>
.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input-container input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
}

.input-container select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  margin-right: 10px;
}

.fetch-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.fetch-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
    .input-container {
    padding: 10px;
  }
}
</style>