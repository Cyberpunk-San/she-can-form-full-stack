import { useState } from 'react';
import api from '../services/api';
import { FormField } from '../types';
import toast from 'react-hot-toast';

export const useForm = (fields: FormField[]) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializeForm = () => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.fieldName] = '';
    });
    setFormData(initialData);
  };

  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }
    const isEmailField = field.type === 'email' || field.fieldName.toLowerCase().includes('email');
    if (isEmailField && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    const field = fields.find(f => f.fieldName === fieldName);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.fieldName] || '');
      if (error) newErrors[field.fieldName] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (onSuccess?: () => void) => {
    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return false;
    }

    setIsSubmitting(true);
    try {
      await api.post('/submissions', { formData });
      toast.success('Form Submitted Successfully!');
      initializeForm();
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    submitForm,
    initializeForm,
  };
};