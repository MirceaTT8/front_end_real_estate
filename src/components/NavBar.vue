<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";
import { PrimeIcons } from '@primevue/core/api';
import Popover from "primevue/popover";
import {Button} from "primevue";

const router = useRouter();

const items = ref([
  {
    label: "Dashboard",
    icon: PrimeIcons.TWITTER,
    route: "/"
  },
  {
    label: "Property",
    icon: PrimeIcons.HOME,
    route: "/properties"
  },
  {
    label: "Tenants",
    icon: "pi pi-users",
    route: "/tenants"
  },
  {
    label: "Leases",
    icon: "pi pi-file",
    route: "/leases"
  },
  {
    label: "Payments",
    icon: "pi pi-dollar",
    route: "/payments"
  },
  {
    label: "Maintenance",
    icon: "pi pi-wrench",
    route: "/maintenance"
  },
]);

const settings = ref([
  {
    label: "Profile",
    icon: PrimeIcons.GITHUB,
    route: "/Profile"
  }
]);
// Profile menu items
const op = ref();
const selectedMember = ref(null);

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
      <template #item="{ item,props }" #>
        <div class="flex items-center gap-2 p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span class="font-bold">{{ item.label }} </span>
            </a>
          </router-link>
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