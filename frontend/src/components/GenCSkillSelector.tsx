import { useState, useEffect } from 'react';
import { skillAPI } from '../api';
import { useApiData } from '../hooks/useApi';
import { Skill, ProficiencyLevelEnum } from '../types';
import { Plus, Trash2, Award } from 'lucide-react';

export interface SelectedSkill {
  skill_id: number;
  skill_name: string;
  proficiency_level: ProficiencyLevelEnum;
  date_acquired?: string;
  notes?: string;
}

interface GenCSkillSelectorProps {
  value: SelectedSkill[];
  onChange: (skills: SelectedSkill[]) => void;
  label?: string;
  required?: boolean;
}

export default function GenCSkillSelector({ 
  value = [], 
  onChange, 
  label = "Skills & Proficiency", 
  required = false 
}: GenCSkillSelectorProps) {
  const { data: allSkills } = useApiData<Skill>(() => skillAPI.getAll());
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const proficiencyOptions = [
    { value: ProficiencyLevelEnum.BEGINNER, label: 'Beginner', color: 'bg-red-100 text-red-800' },
    { value: ProficiencyLevelEnum.INTERMEDIATE, label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: ProficiencyLevelEnum.ADVANCED, label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { value: ProficiencyLevelEnum.EXPERT, label: 'Expert', color: 'bg-green-100 text-green-800' },
  ];

  const getProficiencyColor = (level: ProficiencyLevelEnum) => {
    const option = proficiencyOptions.find(opt => opt.value === level);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const availableSkills = allSkills.filter(skill => 
    !value.some(selected => selected.skill_id === skill.id)
  );

  const addSkill = () => {
    if (availableSkills.length > 0) {
      const newSkill: SelectedSkill = {
        skill_id: availableSkills[0].id,
        skill_name: availableSkills[0].skill_name,
        proficiency_level: ProficiencyLevelEnum.BEGINNER,
        date_acquired: new Date().toISOString().split('T')[0],
        notes: ''
      };
      onChange([...value, newSkill]);
      setIsAddingSkill(false);
    }
  };

  const updateSkill = (index: number, updates: Partial<SelectedSkill>) => {
    const updatedSkills = value.map((skill, i) => {
      if (i === index) {
        // If skill_id is being updated, also update skill_name
        if (updates.skill_id) {
          const selectedSkill = allSkills.find(s => s.id === updates.skill_id);
          updates.skill_name = selectedSkill?.skill_name || skill.skill_name;
        }
        return { ...skill, ...updates };
      }
      return skill;
    });
    onChange(updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = value.filter((_, i) => i !== index);
    onChange(updatedSkills);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && '*'}
      </label>

      {/* Selected Skills */}
      <div className="space-y-3 mb-4">
        {value.map((selectedSkill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Skill Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill
                </label>
                <select
                  value={selectedSkill.skill_id}
                  onChange={(e) => updateSkill(index, { skill_id: Number(e.target.value) })}
                  className="form-select text-sm"
                >
                  <option value={selectedSkill.skill_id}>
                    {selectedSkill.skill_name}
                  </option>
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skill_name} {skill.category && `(${skill.category})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency
                </label>
                <select
                  value={selectedSkill.proficiency_level}
                  onChange={(e) => updateSkill(index, { proficiency_level: e.target.value as ProficiencyLevelEnum })}
                  className="form-select text-sm"
                >
                  {proficiencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Acquired */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Acquired
                </label>
                <input
                  type="date"
                  value={selectedSkill.date_acquired || ''}
                  onChange={(e) => updateSkill(index, { date_acquired: e.target.value })}
                  className="form-input text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="cognizant-button-secondary text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2"
                  title="Remove skill"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={selectedSkill.notes || ''}
                onChange={(e) => updateSkill(index, { notes: e.target.value })}
                placeholder="Additional notes about this skill"
                className="form-input text-sm"
              />
            </div>

            {/* Skill Badge Display */}
            <div className="mt-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {selectedSkill.skill_name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(selectedSkill.proficiency_level)}`}>
                {selectedSkill.proficiency_level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Button */}
      {availableSkills.length > 0 && (
        <button
          type="button"
          onClick={addSkill}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Skill</span>
        </button>
      )}

      {/* No Skills Available Message */}
      {availableSkills.length === 0 && value.length === allSkills.length && (
        <div className="text-center py-4 text-gray-500">
          <Award className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">All available skills have been added</p>
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Award className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-gray-500 text-sm mb-3">No skills added yet</p>
          {availableSkills.length > 0 && (
            <button
              type="button"
              onClick={addSkill}
              className="cognizant-button-primary text-sm"
            >
              Add First Skill
            </button>
          )}
        </div>
      )}

      {/* Skills Summary */}
      {value.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{value.length}</strong> skill{value.length !== 1 ? 's' : ''} selected
            {value.length > 0 && (
              <span className="ml-2">
                • {value.filter(s => s.proficiency_level === ProficiencyLevelEnum.EXPERT).length} Expert
                • {value.filter(s => s.proficiency_level === ProficiencyLevelEnum.ADVANCED).length} Advanced
                • {value.filter(s => s.proficiency_level === ProficiencyLevelEnum.INTERMEDIATE).length} Intermediate
                • {value.filter(s => s.proficiency_level === ProficiencyLevelEnum.BEGINNER).length} Beginner
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
} 