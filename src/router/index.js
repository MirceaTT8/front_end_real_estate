import {createRouter, createWebHistory} from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";
import PropertyView from "@/views/PropertyView.vue";
import TenantView from "@/views/TenantView.vue";
import LeaseView from "@/views/LeaseView.vue";
import MaintenanceRequestView from "@/views/MaintenanceRequestView.vue";
import PaymentView from "@/views/PaymentView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AddPropertyView from "@/views/AddPropertyView.vue";
import LeaseTenantView from "@/views/LeaseTenantView.vue";
import PaymentTenantView from "@/views/PaymentTenantView.vue";
import MaintenanceRequestTenantView from "@/views/MaintenanceRequestTenantView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: DashboardView
        },
        {
            path: '/properties',
            name: 'Property',
            component: PropertyView
        },
        {
            path: '/tenants',
            name: 'Tenant',
            component: TenantView
        },
        {
            path: '/leases',
            name: 'Lease',
            component: LeaseView
        },
        {
            path: '/payments',
            name: 'Payment',
            component: PaymentView
        },
        {
            path: '/maintenance',
            name: 'Maintenance',
            component: MaintenanceRequestView
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfileView
        },
        {
            path: '/add-property',
            name: 'AddProperty',
            component: AddPropertyView
        },
        {
            path: '/leases-tenant',
            name: 'LeaseTenant',
            component: LeaseTenantView
        },
        {
            path: '/payments-tenant',
            name: 'Payments',
            component: PaymentTenantView
        },
        {
            path: '/maintenance-tenant',
            name: 'MaintenanceTenant',
            component: MaintenanceRequestTenantView
        }


    ]
})

export default router;