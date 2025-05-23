
/**
 * Formats payment method enum values to display-friendly text
 * @param {string} paymentMethod - The payment method enum value (e.g., 'CREDIT_CARD')
 * @returns {string} - Formatted payment method (e.g., 'Credit Card')
 */
export const formatPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return ''

    const methodMap = {
        'CREDIT_CARD': 'Credit Card',
        'BANK_TRANSFER': 'Bank Transfer',
        'CASH': 'Cash'
    }

    return methodMap[paymentMethod] || paymentMethod
}

/**
 * Generic utility to convert enum-style strings to title case
 * @param {string} enumValue - The enum value (e.g., 'SOME_VALUE')
 * @returns {string} - Title case string (e.g., 'Some Value')
 */
export const formatEnumToTitleCase = (enumValue) => {
    if (!enumValue) return ''

    return enumValue
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}