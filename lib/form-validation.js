export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  // Kenyan phone number validation
  const phoneRegex = /^(\+254|0)[17]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const validateIdNumber = (idNumber) => {
  // Basic Kenyan ID validation (8 digits)
  const idRegex = /^\d{8}$/
  return idRegex.test(idNumber)
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateForm = (formData, requiredFields) => {
  const errors = {}

  requiredFields.forEach((field) => {
    if (!validateRequired(formData[field])) {
      errors[field] = `${field} is required`
    }
  })

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid Kenyan phone number"
  }

  if (formData.idNumber && !validateIdNumber(formData.idNumber)) {
    errors.idNumber = "Please enter a valid 8-digit ID number"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
