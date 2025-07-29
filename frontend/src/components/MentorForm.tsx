import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MentorCreate, Mentor, MentorDesignationEnum } from '../types';

interface MentorFormProps {
  initialData?: Mentor;
  onSubmit: (data: MentorCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MentorForm({ initialData, onSubmit, onCancel, loading = false }: MentorFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MentorCreate>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const designationOptions = [
    { value: MentorDesignationEnum.D, label: 'D - Director' },
    { value: MentorDesignationEnum.AD, label: 'AD - Associate Director' },
    { value: MentorDesignationEnum.SM, label: 'SM - Senior Manager' },
    { value: MentorDesignationEnum.M, label: 'M - Manager' },
    { value: MentorDesignationEnum.SA, label: 'SA - Senior Associate' },
    { value: MentorDesignationEnum.A, label: 'A - Associate' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Associate ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Associate ID *
          </label>
          <input
            type="text"
            {...register('associate_id', { required: 'Associate ID is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter associate ID"
          />
          {errors.associate_id && (
            <p className="text-red-500 text-sm mt-1">{errors.associate_id.message}</p>
          )}
        </div>

        {/* Mentor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mentor Name *
          </label>
          <input
            type="text"
            {...register('mentor_name', { required: 'Mentor Name is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mentor name"
          />
          {errors.mentor_name && (
            <p className="text-red-500 text-sm mt-1">{errors.mentor_name.message}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation *
          </label>
          <select
            {...register('designation', { required: 'Designation is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Designation</option>
            {designationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
          )}
        </div>

        {/* Service Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Line *
          </label>
          <input
            type="text"
            {...register('service_line', { required: 'Service Line is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service line"
          />
          {errors.service_line && (
            <p className="text-red-500 text-sm mt-1">{errors.service_line.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
} 