import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ApplicationUserCreate, ApplicationUser, UserTypeEnum } from '../types';

interface ApplicationUserFormProps {
  initialData?: ApplicationUser;
  onSubmit: (data: ApplicationUserCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ApplicationUserForm({ initialData, onSubmit, onCancel, loading = false }: ApplicationUserFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplicationUserCreate>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const userTypeOptions = [
    { value: UserTypeEnum.PMO_MEMBER, label: 'PMO Member' },
    { value: UserTypeEnum.MDU_MEMBER, label: 'MDU Member' },
    { value: UserTypeEnum.MENTOR, label: 'Mentor' },
    { value: UserTypeEnum.SL_MEMBER, label: 'SL Member' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Associate ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Associate ID *
          </label>
          <input
            type="text"
            {...register('user_assoc_id', { required: 'User Associate ID is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user associate ID"
          />
          {errors.user_assoc_id && (
            <p className="text-red-500 text-sm mt-1">{errors.user_assoc_id.message}</p>
          )}
        </div>

        {/* User Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Name *
          </label>
          <input
            type="text"
            {...register('user_name', { required: 'User Name is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user name"
          />
          {errors.user_name && (
            <p className="text-red-500 text-sm mt-1">{errors.user_name.message}</p>
          )}
        </div>

        {/* User Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Type *
          </label>
          <select
            {...register('user_type', { required: 'User Type is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select User Type</option>
            {userTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.user_type && (
            <p className="text-red-500 text-sm mt-1">{errors.user_type.message}</p>
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