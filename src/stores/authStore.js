import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        role: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.role
    },
    actions: {
        initialize() {
            if (this.token) {
                try {
                    const decoded = jwtDecode(this.token)
                    const authorities = decoded.authorities || []
                    this.role = authorities[0] || null
                } catch (e) {
                    this.logout()
                }
            }
        },
        login(token) {
            this.token = token
            localStorage.setItem('token', token)
            this.initialize()
        },
        logout() {
            this.token = null
            this.role = null
            localStorage.removeItem('token')
        }
    }
})
