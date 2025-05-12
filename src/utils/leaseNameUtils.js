export const getPropertyNameByLeaseId = (leaseId, leases = [], properties = []) => {
    const lease = leases.find(l => l.leaseId === leaseId)
    if (!lease) return 'Unknown Lease'
    const property = properties.find(p => p.propertyId === lease.propertyId)
    return property ? property.name : 'Unknown Property'
}

export const getTenantNameByLeaseId = (leaseId, leases = [], tenants = []) => {
    const lease = leases.find(l => l.leaseId === leaseId)
    if (!lease) return 'Unknown Lease'
    const tenant = tenants.find(t => t.userId === lease.tenantId)
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant'
}
