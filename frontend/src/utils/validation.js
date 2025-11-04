// Real-time validation utilities
export const validators = {
  name: (value) => {
    if (!value?.trim()) return null;
    if (value.length < 2) return "Name must be at least 2 characters";
    if (value.length > 100) return "Name is too long (max 100 characters)";
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      return "Name can only contain letters, spaces, hyphens and apostrophes";
    }
    return null;
  },

  email: (value) => {
    if (!value?.trim()) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 8 || !/(?=.*[a-z])/.test(value) || !/(?=.*[A-Z])/.test(value) || !/(?=.*\d)/.test(value)) {
      return "Password must be at least 8 characters and contain uppercase, lowercase, and number";
    }
    return null;
  },

  interests: (interests) => {
    if (!interests || interests.length === 0) return "Please select at least 1 interest";
    if (interests.length > 5) return "Please select maximum 5 interests";
    return null;
  }
};