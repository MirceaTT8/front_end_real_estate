<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

// Recent Activity Data
const activities = ref([
  { type: 'payment', description: 'Jane Smith paid rent for Downtown Loft', time: '2 hours ago' },
  { type: 'maintenance', description: 'New maintenance request for Sunset Apartments', time: '1 day ago' },
  { type: 'lease', description: 'Mike Johnson signed lease renewal', time: '3 days ago' },
  { type: 'message', description: 'New message from Sarah Williams', time: '5 days ago' }
])

// Quick Actions
const quickActions = [
  { icon: '📝', label: 'Create Lease', action: () => navigateTo('/leases/new') },
  { icon: '💰', label: 'Record Payment', action: () => navigateTo('/payments/new') },
  { icon: '🔧', label: 'Manage Requests', action: () => navigateTo('/maintenance') },
  { icon: '✉️', label: 'Send Notice', action: () => navigateTo('/messages/new') }
]

// Chart Data
const chartData = ref()
const chartOptions = ref()

const initChart = () => {
  chartData.value = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rent Collection',
        data: [12000, 15000, 18000, 12000, 15000, 18000],
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Maintenance Costs',
        data: [2000, 1500, 3000, 2500, 1800, 2200],
        backgroundColor: '#FF9800'
      }
    ]
  }

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false
  }
}

// Deadlines
const deadlines = ref([
  { type: 'lease', description: 'Lease renewal for Apt 3B', date: '2024-06-15' },
  { type: 'inspection', description: 'Annual property inspection', date: '2024-06-20' },
  { type: 'tax', description: 'Property tax due', date: '2024-06-30' }
])

// Helper functions
const navigateTo = (path) => {
  console.log('Navigating to:', path)
  // In a real app: this.$router.push(path)
}

const daysUntil = (dateString) => {
  const today = new Date()
  const deadline = new Date(dateString)
  const diffTime = deadline - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="dashboard-view">
    <h1 class="page-title">Landlord Dashboard</h1>

    <!-- Quick Actions -->
    <section class="dashboard-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <button
            v-for="(action, index) in quickActions"
            :key="index"
            @click="action.action"
            class="action-button"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="dashboard-section">
      <h2 class="section-title">Recent Activity</h2>
      <div class="activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="activity-item">
          <div class="activity-icon">
            <span v-if="activity.type === 'payment'">💰</span>
            <span v-else-if="activity.type === 'maintenance'">🔧</span>
            <span v-else-if="activity.type === 'lease'">📝</span>
            <span v-else>✉️</span>
          </div>
          <div class="activity-content">
            <p class="activity-description">{{ activity.description }}</p>
            <p class="activity-time">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts and Graphs -->
    <section class="dashboard-section">
      <h2 class="section-title">Financial Overview</h2>
      <div class="chart-container">
        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="dashboard-chart"
        />
      </div>
    </section>

    <!-- Deadlines -->
    <section class="dashboard-section">
      <h2 class="section-title">Upcoming Deadlines</h2>
      <div class="deadlines-list">
        <div v-for="(deadline, index) in deadlines" :key="index" class="deadline-item">
          <div class="deadline-icon">
            <span v-if="deadline.type === 'lease'">📝</span>
            <span v-else-if="deadline.type === 'inspection'">🔍</span>
            <span v-else>💰</span>
          </div>
          <div class="deadline-content">
            <p class="deadline-description">{{ deadline.description }}</p>
            <p class="deadline-date">
              Due in {{ daysUntil(deadline.date) }} days ({{ new Date(deadline.date).toLocaleDateString() }})
            </p>
          </div>
          <button class="deadline-reminder">Set Reminder</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.page-title {
  grid-column: 1 / -1;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.dashboard-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 1.3rem;
  color: #444;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.action-label {
  font-weight: 500;
}

/* Recent Activity */
.activity-list {
  display: grid;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.activity-item:hover {
  background-color: #f8f9fa;
}

.activity-icon {
  font-size: 1.5rem;
  padding-top: 0.2rem;
}

.activity-content {
  flex: 1;
}

.activity-description {
  margin: 0;
  font-weight: 500;
}

.activity-time {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #666;
}

/* Charts */
.chart-container {
  height: 300px;
  position: relative;
}

.dashboard-chart {
  width: 100%;
  height: 100%;
}

/* Deadlines */
.deadlines-list {
  display: grid;
  gap: 1rem;
}

.deadline-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.deadline-icon {
  font-size: 1.5rem;
}

.deadline-content {
  flex: 1;
}

.deadline-description {
  margin: 0;
  font-weight: 500;
}

.deadline-date {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #666;
}

.deadline-reminder {
  padding: 0.5rem 1rem;
  background: #e3f2fd;
  color: #2196f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.deadline-reminder:hover {
  background: #bbdefb;
}

/* Grid Layout */
.dashboard-section:nth-child(2) { /* Quick Actions */
  grid-column: span 12;
}

.dashboard-section:nth-child(3) { /* Recent Activity */
  grid-column: span 6;
}

.dashboard-section:nth-child(4) { /* Charts */
  grid-column: span 6;
}

.dashboard-section:nth-child(5) { /* Deadlines */
  grid-column: span 12;
}

@media (max-width: 1024px) {
  .dashboard-section:nth-child(3),
  .dashboard-section:nth-child(4) {
    grid-column: span 12;
  }
}
</style>