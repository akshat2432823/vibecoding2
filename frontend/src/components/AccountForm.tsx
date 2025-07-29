import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AccountCreate, Account } from '../types';

interface AccountFormProps {
  initialData?: Account;
  onSubmit: (data: AccountCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AccountForm({ initialData, onSubmit, onCancel, loading = false }: AccountFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AccountCreate>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            {...register('account_name', { required: 'Account Name is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter account name"
          />
          {errors.account_name && (
            <p className="text-red-500 text-sm mt-1">{errors.account_name.message}</p>
          )}
        </div>

        {/* EPL Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EPL Name *
          </label>
          <input
            type="text"
            {...register('epl_name', { required: 'EPL Name is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter EPL name"
          />
          {errors.epl_name && (
            <p className="text-red-500 text-sm mt-1">{errors.epl_name.message}</p>
          )}
        </div>

        {/* EDP Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EDP Name *
          </label>
          <input
            type="text"
            {...register('edp_name', { required: 'EDP Name is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter EDP name"
          />
          {errors.edp_name && (
            <p className="text-red-500 text-sm mt-1">{errors.edp_name.message}</p>
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