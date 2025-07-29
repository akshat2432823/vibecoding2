import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RoleSkillRequirementCreate, RoleSkillRequirement, DesignationEnum, ProficiencyLevelEnum } from '../types';
import { skillAPI } from '../api';
import { useApiData } from '../hooks/useApi';

interface RoleSkillRequirementFormProps {
  initialData?: RoleSkillRequirement;
  onSubmit: (data: RoleSkillRequirementCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function RoleSkillRequirementForm({ initialData, onSubmit, onCancel, loading = false }: RoleSkillRequirementFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RoleSkillRequirementCreate>();
  const { data: skills } = useApiData(() => skillAPI.getAll());

  useEffect(() => {
    if (initialData) {
      reset({
        role: initialData.role,
        skill_id: initialData.skill_id,
        required_proficiency_level: initialData.required_proficiency_level,
        is_mandatory: initialData.is_mandatory,
      });
    }
  }, [initialData, reset]);

  const roleOptions = [
    { value: DesignationEnum.A, label: 'A - Associate' },
    { value: DesignationEnum.PA, label: 'PA - Principal Associate' },
    { value: DesignationEnum.PAT, label: 'PAT - Principal Associate Trainee' },
  ];

  const proficiencyOptions = [
    { value: ProficiencyLevelEnum.BEGINNER, label: 'Beginner' },
    { value: ProficiencyLevelEnum.INTERMEDIATE, label: 'Intermediate' },
    { value: ProficiencyLevelEnum.ADVANCED, label: 'Advanced' },
    { value: ProficiencyLevelEnum.EXPERT, label: 'Expert' },
  ];

  const mandatoryOptions = [
    { value: 'Yes', label: 'Yes - Mandatory' },
    { value: 'No', label: 'No - Optional' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Role */}
        <div className="form-group">
          <label className="form-label">
            Role *
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="form-select"
          >
            <option value="">Select Role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Skill */}
        <div className="form-group">
          <label className="form-label">
            Skill *
          </label>
          <select
            {...register('skill_id', { required: 'Skill is required', valueAsNumber: true })}
            className="form-select"
          >
            <option value="">Select Skill</option>
            {skills.map((skill: any) => (
              <option key={skill.id} value={skill.id}>
                {skill.skill_name} {skill.category && `(${skill.category})`}
              </option>
            ))}
          </select>
          {errors.skill_id && (
            <p className="text-red-500 text-sm mt-1">{errors.skill_id.message}</p>
          )}
        </div>

        {/* Required Proficiency Level */}
        <div className="form-group">
          <label className="form-label">
            Required Proficiency Level *
          </label>
          <select
            {...register('required_proficiency_level', { required: 'Proficiency level is required' })}
            className="form-select"
          >
            <option value="">Select Proficiency Level</option>
            {proficiencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.required_proficiency_level && (
            <p className="text-red-500 text-sm mt-1">{errors.required_proficiency_level.message}</p>
          )}
        </div>

        {/* Mandatory */}
        <div className="form-group">
          <label className="form-label">
            Mandatory *
          </label>
          <select
            {...register('is_mandatory', { required: 'Mandatory field is required' })}
            className="form-select"
          >
            <option value="">Select</option>
            {mandatoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.is_mandatory && (
            <p className="text-red-500 text-sm mt-1">{errors.is_mandatory.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Role requirements define the expected skill levels for each role. 
          These will be used to assess GenC readiness for promotions and role assignments.
        </p>
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