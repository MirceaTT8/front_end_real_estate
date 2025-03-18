<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

const router = useRouter();

// Menubar items for property management
const items = ref([
  {

    label: "Properties",
    icon: "pi pi-home",
    items: [
      { label: "View Properties" },
      { separator: true} ,
      { label: "Add Property" }
    ],
  },
  {
    label: "Tenants",
    icon: "pi pi-users",
    items: [
      { label: "View Tenants" },
      { label: "Add Tenant" },
    ],
  },
  {
    label: "Leases",
    icon: "pi pi-file",
    items: [
      { label: "View Leases" },
      { label: "Create Lease" },
    ],
  },
  {
    label: "Payments",
    icon: "pi pi-dollar",
    items: [
      { label: "View Payments" },
      { label: "Generate Invoice" },
    ],
  },
  {
    label: "Maintenance",
    icon: "pi pi-wrench",
    items: [
      { label: "View Requests" },
      { label: "Create Request" },
    ],
  },
]);


</script>

<template>
  <!-- Wrapper div with flexbox properties -->
  <div class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="items" class="w-full p-0 m-0">
      <template #item="{ item }">
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"> >
          <span class="font-bold">{{ item.label }} </span>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>


</style>