// validationSchema.js
import * as yup from 'yup';

export const mealSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  category: yup.string().required('Category is required'),
  ingredients: yup.array().of(yup.string()).min(1, 'At least one ingredient is required'),
  status: yup.string().required('Status is required'),
  sortOrder: yup.number().required('Sort Order is required').positive('Sort Order must be a positive number'),
  image: yup.mixed().required('Image is required'),
});
