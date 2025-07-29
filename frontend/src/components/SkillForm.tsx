import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SkillCreate, Skill } from '../types';

interface SkillFormProps {
  initialData?: Skill;
  onSubmit: (data: SkillCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SkillForm({ initialData, onSubmit, onCancel, loading = false }: SkillFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SkillCreate>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const categoryOptions = [
    { value: 'Technical', label: 'Technical' },
    { value: 'Soft Skills', label: 'Soft Skills' },
    { value: 'Domain', label: 'Domain' },
    { value: 'Programming', label: 'Programming' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Database', label: 'Database' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Security', label: 'Security' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Design', label: 'Design' },
    { value: 'Management', label: 'Management' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Skill Name */}
        <div className="form-group">
          <label className="form-label">
            Skill Name *
          </label>
          <input
            type="text"
            {...register('skill_name', { required: 'Skill name is required' })}
            className="form-input"
            placeholder="e.g., JavaScript, React, Communication"
          />
          {errors.skill_name && (
            <p className="text-red-500 text-sm mt-1">{errors.skill_name.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">
            Category
          </label>
          <select
            {...register('category')}
            className="form-select"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="form-input"
            placeholder="Brief description of the skill and its application"
          />
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