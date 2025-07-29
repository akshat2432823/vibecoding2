import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AccountServiceLineCreate, AccountServiceLine } from '../types';
import { accountAPI } from '../api';
import { useApiData } from '../hooks/useApi';

interface AccountServiceLineFormProps {
  initialData?: AccountServiceLine;
  onSubmit: (data: AccountServiceLineCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AccountServiceLineForm({ initialData, onSubmit, onCancel, loading = false }: AccountServiceLineFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AccountServiceLineCreate>();
  const { data: accounts } = useApiData(() => accountAPI.getAll());

  useEffect(() => {
    if (initialData) {
      // Transform the data to match the form structure
      const formData: AccountServiceLineCreate = {
        account_id: initialData.account_id,
        service_line: initialData.service_line,
        edl_name: initialData.edl_name,
        pdl_name: initialData.pdl_name,
        sl_spoc: initialData.sl_spoc,
      };
      reset(formData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account */}
        <div className="md:col-span-2">
          <label className="form-label">
            Account *
          </label>
          <select
            {...register('account_id', { 
              required: 'Account is required',
              valueAsNumber: true 
            })}
            className="form-select"
          >
            <option value="">Select Account</option>
            {accounts.map((account: any) => (
              <option key={account.id} value={account.id}>
                {account.account_name}
              </option>
            ))}
          </select>
          {errors.account_id && (
            <p className="text-red-500 text-sm mt-1">{errors.account_id.message}</p>
          )}
        </div>

        {/* Service Line */}
        <div>
          <label className="form-label">
            Service Line *
          </label>
          <input
            type="text"
            {...register('service_line', { required: 'Service Line is required' })}
            className="form-input"
            placeholder="Enter service line"
          />
          {errors.service_line && (
            <p className="text-red-500 text-sm mt-1">{errors.service_line.message}</p>
          )}
        </div>

        {/* EDL Name */}
        <div>
          <label className="form-label">
            EDL Name *
          </label>
          <input
            type="text"
            {...register('edl_name', { required: 'EDL Name is required' })}
            className="form-input"
            placeholder="Enter EDL name"
          />
          {errors.edl_name && (
            <p className="text-red-500 text-sm mt-1">{errors.edl_name.message}</p>
          )}
        </div>

        {/* PDL Name */}
        <div>
          <label className="form-label">
            PDL Name *
          </label>
          <input
            type="text"
            {...register('pdl_name', { required: 'PDL Name is required' })}
            className="form-input"
            placeholder="Enter PDL name"
          />
          {errors.pdl_name && (
            <p className="text-red-500 text-sm mt-1">{errors.pdl_name.message}</p>
          )}
        </div>

        {/* SL SPOC */}
        <div>
          <label className="form-label">
            SL SPOC *
          </label>
          <input
            type="text"
            {...register('sl_spoc', { required: 'SL SPOC is required' })}
            className="form-input"
            placeholder="Enter SL SPOC"
          />
          {errors.sl_spoc && (
            <p className="text-red-500 text-sm mt-1">{errors.sl_spoc.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="cognizant-button-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="cognizant-button-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
} 