import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

// Shared views
import ProfileView from "@/views/ProfileView.vue"
import DashboardView from "@/views/landlord/DashboardView.vue"
import LoginView from "@/views/LoginView.vue"
import RegisterView from "@/views/RegisterView.vue"

// Lazy loaded views
const PropertyView = () => import('@/views/landlord/PropertyView.vue')
const PropertyDetailsView = () => import('@/views/landlord/PropertyDetailsView.vue')
const TenantView = () => import('@/views/TenantView.vue')
const LeaseView = () => import('@/views/landlord/LeaseView.vue')
const MaintenanceRequestView = () => import('@/views/landlord/MaintenanceRequestView.vue')
const PaymentView = () => import('@/views/landlord/PaymentView.vue')
const AddPropertyView = () => import('@/views/landlord/AddPropertyView.vue')

const LeaseTenantView = () => import('@/views/tenant/LeaseTenantView.vue')
const PaymentTenantView = () => import('@/views/tenant/PaymentTenantView.vue')
const MaintenanceRequestTenantView = () => import('@/views/tenant/MaintenanceRequestTenantView.vue')
const PaymentSuccesView = () => import('@/views/tenant/PaymentSuccesView.vue')
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue"
import UserManagementView from "@/views/admin/UserManagementView.vue"
import LogsView from "@/views/admin/LogsView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/payment/success',
            name: 'PaymentSuccess',
            component: PaymentSuccesView
        },
        { path: '/register', name: 'Register', component: RegisterView },
        { path: '/login', name: 'Login', component: LoginView },
        {
            path: '/',
            redirect: () => {
                const token = localStorage.getItem('token')
                if (token) {
                    const { authorities } = jwtDecode(token)
                    if (authorities.includes('ROLE_LANDLORD')) return '/landlord'
                    if (authorities.includes('ROLE_TENANT')) return '/tenant/leases'
                    if (authorities.includes('ROLE_ADMIN')) return '/admin/dashboard'
                }
                return '/login'
            }
        },
        { path: '/profile', name: 'Profile', component: ProfileView },

        // Landlord routes
        { path: '/landlord', name: 'Dashboard', component: DashboardView },
        { path: '/landlord/properties', name: 'Property', component: PropertyView },
        { path: '/landlord/property/:id', name: 'PropertyDetails', component: PropertyDetailsView },
        { path: '/landlord/tenants', name: 'Tenant', component: TenantView },
        { path: '/landlord/leases', name: 'Lease', component: LeaseView },
        { path: '/landlord/payments', name: 'Payment', component: PaymentView },
        { path: '/landlord/maintenance', name: 'Maintenance', component: MaintenanceRequestView },
        { path: '/landlord/add-property', name: 'AddProperty', component: AddPropertyView },

        // Tenant routes
        { path: '/tenant/leases', name: 'LeaseTenant', component: LeaseTenantView },
        { path: '/tenant/payments', name: 'PaymentTenant', component: PaymentTenantView },
        { path: '/tenant/maintenance', name: 'MaintenanceTenant', component: MaintenanceRequestTenantView },

        // Admin routes
        { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboardView },
        { path: '/admin/users', name: 'UserManagement', component: UserManagementView },
        { path: '/admin/logs', name: 'SystemLogs', component: LogsView }
    ]
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    const token = localStorage.getItem('token')

    if (authRequired && !token) return next('/login')

    if (token) {
        try {
            const { authorities } = jwtDecode(token)

            if (to.path.startsWith('/tenant') && !authorities.includes('ROLE_TENANT')) {
                return next('/login')
            }

            if (to.path.startsWith('/landlord') && !authorities.includes('ROLE_LANDLORD')) {
                return next('/login')
            }

            if (to.path.startsWith('/admin') && !authorities.includes('ROLE_ADMIN')) {
                return next('/login')
            }
        } catch (e) {
            localStorage.removeItem('token')
            return next('/login')
        }
    }

    next()
})

export default router
