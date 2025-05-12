import { formatTimeAgo } from './dateUtils.js'

export function formatActivityLogs(logs) {
    return logs.map(log => {
        let icon = '✉️'
        let description = log.actionType
        let parsedDetails

        try {
            parsedDetails = typeof log.details === 'string'
                ? JSON.parse(log.details)
                : log.details
        } catch {
            parsedDetails = log.details
        }

        switch (log.actionType) {
            case 'CREATE_PROPERTY':
                icon = '🏠'
                description = `Created property "${parsedDetails?.name || 'Unnamed'}"`
                break
            case 'CREATE_LEASE':
                icon = '📄'
                description = `Created lease for property #${parsedDetails?.propertyId || '?'}`
                break
            case 'UPDATE_MAINTENANCE_STATUS':
                icon = '🛠️'
                description = `Maintenance updated: ${parsedDetails?.oldStatus} → ${parsedDetails?.newStatus}`
                break
            case 'SEND_PAYMENT_NOTIFICATION':
                icon = '💬'
                description = 'Payment notification sent'
                break
            default:
                icon = '🔔'
                description = log.actionType.replace(/_/g, ' ')
        }

        return {
            icon,
            description,
            time: formatTimeAgo(log.createdAt)
        }
    })
}
