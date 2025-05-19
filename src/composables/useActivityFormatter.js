
export function useActivityFormatter() {
    function formatDescription(activity) {
        let details = {}

        try {
            details = typeof activity.details === 'string'
                ? JSON.parse(activity.details)
                : activity.details
        } catch {
            return activity.details || 'Performed an action'
        }

        switch (activity.actionType) {
            case 'CREATE_PROPERTY':
                return `Created property “${details.name}” at ${details.address}`

            case 'DELETE_PROPERTY':
                return activity.details || `Deleted a property (ID: ${activity.entityId})`

            case 'CREATE_LEASE':
                return `Created lease for tenant #${details.tenantId} on property #${details.propertyId} starting ${details.startDate}`

            case 'PROCESS_PAYMENT':
                return `Processed payment of €${details.amount} for ${details.property}`

            case 'SEND_PAYMENT_NOTIFICATION':
                return details

            case 'CREATE_MAINTENANCE_REQUEST':
                return `New maintenance request: “${details.description}” (Status: ${details.status})`

            case 'UPDATE_MAINTENANCE_STATUS':
                return `Maintenance status updated: ${details.oldStatus} → ${details.newStatus}`

            default:
                return `${(activity.actionType || 'Unknown Action').replace(/_/g, ' ')} on ${activity.entityType || 'Unknown Entity'}`
        }
    }

    function getIcon(activity) {
        switch (activity.entityType) {
            case 'Payment':
                return '💰'
            case 'MaintenanceRequest':
                return '🛠️'
            case 'Lease':
                return '📄'
            case 'Property':
                return '🏠'
            case 'Notification':
                return '📩'
            default:
                return '🔔'
        }
    }

    return {
        formatDescription,
        getIcon
    }
}
