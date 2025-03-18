<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";
import { PrimeIcons } from '@primevue/core/api';
import Popover from "primevue/popover";
import {Button} from "primevue";

const router = useRouter();

// Menubar items for property management
const items = ref([
  {

    label: "Properties",
    icon: PrimeIcons.HOME,
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

// Profile menu items
const op = ref();
const selectedMember = ref(null);
const members = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event) => {
  op.value.toggle(event);
}

const selectMember = (member) => {
  selectedMember.value = member;
  op.value.hide();
}
</script>

<template>
  <!-- Wrapper div with flexbox properties -->
  <div class="card w-full bg-blue-500 p-0 m-0">
    <Menubar :model="items" class="w-full p-0 m-0">
      <template #start >
        <span class="logo">Immobille</span>
      </template>
      <template #item="{ item }" #>
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
          <span class="font-bold">{{ item.label }} </span>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">


          <Button
              type="button"
              label="Your Profile"
              @click="toggle"
          />
          <Popover ref="op">
            <div>
              <div>
                <span class="font-medium block mb-2">Share this document</span>
              </div>
            </div>
          </Popover>
        </div>
      </template>

    </Menubar>
  </div>
</template>

<style scoped>

.logo {
  font-family: 'Brush Script MT', cursive;
  color:#ffffff;
  margin-left:10px;
}
</style>