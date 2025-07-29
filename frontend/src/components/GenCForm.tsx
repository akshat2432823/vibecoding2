import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GenCCreate, GenC, StatusEnum, LocationEnum, DesignationEnum } from '../types';
import { accountAPI, mentorAPI, accountServiceLineAPI } from '../api';
import { useApiData } from '../hooks/useApi';
import GenCSkillSelector, { SelectedSkill } from './GenCSkillSelector';

interface GenCFormData extends GenCCreate {
  skills?: SelectedSkill[];
}

interface GenCFormProps {
  initialData?: GenC;
  onSubmit: (data: GenCFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GenCForm({ initialData, onSubmit, onCancel, loading = false }: GenCFormProps) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<GenCCreate>();
  
  const { data: accounts } = useApiData(() => accountAPI.getAll());
  const { data: mentors } = useApiData(() => mentorAPI.getAll());
  const [serviceLines, setServiceLines] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  
  const watchedAccountId = watch('account_id');

  useEffect(() => {
    if (watchedAccountId) {
      // Fetch service lines for selected account
      accountServiceLineAPI.getByAccount(Number(watchedAccountId))
        .then(response => setServiceLines(response.data))
        .catch(() => setServiceLines([]));
    } else {
      setServiceLines([]);
    }
  }, [watchedAccountId]);

  useEffect(() => {
    if (initialData) {
      // Convert date strings to proper format for input[type="date"]
      const formData = {
        ...initialData,
        date_of_joining: initialData.date_of_joining ? new Date(initialData.date_of_joining).toISOString().split('T')[0] : '',
        date_of_allocation: initialData.date_of_allocation ? new Date(initialData.date_of_allocation).toISOString().split('T')[0] : '',
        planned_billing_start_date: initialData.planned_billing_start_date ? new Date(initialData.planned_billing_start_date).toISOString().split('T')[0] : '',
        actual_billing_start_date: initialData.actual_billing_start_date ? new Date(initialData.actual_billing_start_date).toISOString().split('T')[0] : '',
      };
      reset(formData);

      // Set initial skills if available
      if (initialData.skills) {
        const skills: SelectedSkill[] = initialData.skills.map(skill => ({
          skill_id: skill.skill_id,
          skill_name: skill.skill?.skill_name || 'Unknown Skill',
          proficiency_level: skill.proficiency_level,
          date_acquired: skill.date_acquired ? new Date(skill.date_acquired).toISOString().split('T')[0] : '',
          notes: skill.notes || ''
        }));
        setSelectedSkills(skills);
      }
    }
  }, [initialData, reset]);

  const handleFormSubmit = (formData: GenCCreate) => {
    const submitData: GenCFormData = {
      ...formData,
      skills: selectedSkills
    };
    onSubmit(submitData);
  };

  const statusOptions = [
    { value: StatusEnum.IDLE, label: 'Idle' },
    { value: StatusEnum.UNDER_PROJECT_TRAINING, label: 'Under Project Training' },
    { value: StatusEnum.CUSTOMER_ONBOARDED, label: 'Customer Onboarded' },
    { value: StatusEnum.BILLING_PLANNED, label: 'Billing Planned' },
    { value: StatusEnum.FEEDBACK_NOT_GOOD, label: 'Feedback Not Good' },
    { value: StatusEnum.BILLING_STARTED, label: 'Billing Started' },
    { value: StatusEnum.GENC_REGULARIZED, label: 'GenC Regularized' },
    { value: StatusEnum.RELEASED_RESIGNED, label: 'Released/Resigned' },
  ];

  const locationOptions = [
    { value: LocationEnum.MUMBAI, label: 'Mumbai' },
    { value: LocationEnum.DELHI, label: 'Delhi' },
    { value: LocationEnum.BANGALORE, label: 'Bangalore' },
    { value: LocationEnum.HYDERABAD, label: 'Hyderabad' },
    { value: LocationEnum.CHENNAI, label: 'Chennai' },
    { value: LocationEnum.KOLKATA, label: 'Kolkata' },
    { value: LocationEnum.PUNE, label: 'Pune' },
    { value: LocationEnum.AHMEDABAD, label: 'Ahmedabad' },
    { value: LocationEnum.SURAT, label: 'Surat' },
    { value: LocationEnum.JAIPUR, label: 'Jaipur' },
  ];

  const designationOptions = [
    { value: DesignationEnum.A, label: 'A' },
    { value: DesignationEnum.PA, label: 'PA' },
    { value: DesignationEnum.PAT, label: 'PAT' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Associate ID */}
        <div className="form-group">
          <label className="form-label">
            Associate ID *
          </label>
          <input
            type="text"
            {...register('associate_id', { required: 'Associate ID is required' })}
            className="form-input"
          />
          {errors.associate_id && (
            <p className="text-red-500 text-sm mt-1">{errors.associate_id.message}</p>
          )}
        </div>

        {/* GenC Name */}
        <div className="form-group">
          <label className="form-label">
            GenC Name *
          </label>
          <input
            type="text"
            {...register('genc_name', { required: 'GenC Name is required' })}
            className="form-input"
          />
          {errors.genc_name && (
            <p className="text-red-500 text-sm mt-1">{errors.genc_name.message}</p>
          )}
        </div>

        {/* Account */}
        <div className="form-group">
          <label className="form-label">
            Account *
          </label>
          <select
            {...register('account_id', { required: 'Account is required', valueAsNumber: true })}
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
        <div className="form-group">
          <label className="form-label">
            Service Line *
          </label>
          <select
            {...register('service_line_id', { required: 'Service Line is required', valueAsNumber: true })}
            className="form-select"
            disabled={!watchedAccountId}
          >
            <option value="">Select Service Line</option>
            {serviceLines.map((serviceLine: any) => (
              <option key={serviceLine.id} value={serviceLine.id}>
                {serviceLine.service_line}
              </option>
            ))}
          </select>
          {errors.service_line_id && (
            <p className="text-red-500 text-sm mt-1">{errors.service_line_id.message}</p>
          )}
        </div>

        {/* Mentor */}
        <div className="form-group">
          <label className="form-label">
            Mentor *
          </label>
          <select
            {...register('mentor_id', { required: 'Mentor is required', valueAsNumber: true })}
            className="form-select"
          >
            <option value="">Select Mentor</option>
            {mentors.map((mentor: any) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.mentor_name}
              </option>
            ))}
          </select>
          {errors.mentor_id && (
            <p className="text-red-500 text-sm mt-1">{errors.mentor_id.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">
            Status *
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="form-select"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Date of Joining */}
        <div className="form-group">
          <label className="form-label">
            Date of Joining *
          </label>
          <input
            type="date"
            {...register('date_of_joining', { required: 'Date of Joining is required' })}
            className="form-input"
          />
          {errors.date_of_joining && (
            <p className="text-red-500 text-sm mt-1">{errors.date_of_joining.message}</p>
          )}
        </div>

        {/* Date of Allocation */}
        <div className="form-group">
          <label className="form-label">
            Date of Allocation
          </label>
          <input
            type="date"
            {...register('date_of_allocation')}
            className="form-input"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">
            Location *
          </label>
          <select
            {...register('location', { required: 'Location is required' })}
            className="form-select"
          >
            <option value="">Select Location</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Current Designation */}
        <div className="form-group">
          <label className="form-label">
            Current Designation *
          </label>
          <select
            {...register('current_designation', { required: 'Current Designation is required' })}
            className="form-select"
          >
            <option value="">Select Designation</option>
            {designationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.current_designation && (
            <p className="text-red-500 text-sm mt-1">{errors.current_designation.message}</p>
          )}
        </div>

        {/* Allocation Project */}
        <div className="form-group">
          <label className="form-label">
            Allocation Project
          </label>
          <input
            type="text"
            {...register('allocation_project')}
            className="form-input"
          />
        </div>

        {/* Team Name */}
        <div className="form-group">
          <label className="form-label">
            Team Name
          </label>
          <input
            type="text"
            {...register('team_name')}
            className="form-input"
          />
        </div>

        {/* Planned Billing Start Date */}
        <div className="form-group">
          <label className="form-label">
            Planned Billing Start Date
          </label>
          <input
            type="date"
            {...register('planned_billing_start_date')}
            className="form-input"
          />
        </div>

        {/* Actual Billing Start Date */}
        <div className="form-group">
          <label className="form-label">
            Actual Billing Start Date
          </label>
          <input
            type="date"
            {...register('actual_billing_start_date')}
            className="form-input"
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="border-t border-gray-200 pt-6">
        <GenCSkillSelector
          value={selectedSkills}
          onChange={setSelectedSkills}
          label="Skills & Proficiency Levels"
        />
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