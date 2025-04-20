import { createRouter, createWebHistory } from 'vue-router'

// Shared views
import ProfileView from "@/views/ProfileView.vue";
import DashboardView from "@/views/landlord/DashboardView.vue";

// Landlord views
const PropertyView = () => import('@/views/landlord/PropertyView.vue');
const TenantView = () => import('@/views/TenantView.vue');
const LeaseView = () => import('@/views/landlord/LeaseView.vue');
const MaintenanceRequestView = () => import('@/views/landlord/MaintenanceRequestView.vue');
const PaymentView = () => import('@/views/landlord/PaymentView.vue');
const AddPropertyView = () => import('@/views/landlord/AddPropertyView.vue');

// Tenant views
const LeaseTenantView = () => import('@/views/LeaseTenantView.vue');
const PaymentTenantView = () => import('@/views/PaymentTenantView.vue');
const MaintenanceRequestTenantView = () => import('@/views/MaintenanceRequestTenantView.vue');

// Admin views
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import UserManagementView from "@/views/admin/UserManagementView.vue";
import SystemSettingsView from "@/views/admin/SystemSettingsView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Shared routes

        {
            path: '/profile',
            name: 'Profile',
            component: ProfileView
        },
        {
            path: '/landlord',
            name: 'Dashboard',
            component: DashboardView
        },
        {
            path: '/landlord',
            children: [

                {
                    path: 'properties',
                    name: 'Property',
                    component: PropertyView
                },
                {
                    path: 'tenants',
                    name: 'Tenant',
                    component: TenantView
                },
                {
                    path: 'leases',
                    name: 'Lease',
                    component: LeaseView
                },
                {
                    path: 'payments',
                    name: 'Payment',
                    component: PaymentView
                },
                {
                    path: 'maintenance',
                    name: 'Maintenance',
                    component: MaintenanceRequestView
                },
                {
                    path: 'add-property',
                    name: 'AddProperty',
                    component: AddPropertyView
                }
            ]
        },

        // Tenant routes
        {
            path: '/tenant',
            children: [
                {
                    path: 'leases',
                    name: 'LeaseTenant',
                    component: LeaseTenantView
                },
                {
                    path: 'payments',
                    name: 'PaymentTenant',
                    component: PaymentTenantView
                },
                {
                    path: 'maintenance',
                    name: 'MaintenanceTenant',
                    component: MaintenanceRequestTenantView
                }
            ]
        },
        {
            path: '/admin',
            // meta: { requiresAdmin: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'AdminDashboard',
                    component: AdminDashboardView
                },
                {
                    path: 'users',
                    name: 'UserManagement',
                    component: UserManagementView
                },
                {
                    path: 'settings',
                    name: 'SystemSettings',
                    component: SystemSettingsView
                }
            ]
        }
    ]
})

export default router