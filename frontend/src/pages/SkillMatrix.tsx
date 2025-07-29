import { useState } from 'react';
import { useApiData } from '../hooks/useApi';
import { skillMatrixAPI } from '../api';
import { SkillMatrixEntry } from '../types';
import { Users, Award, Calendar, Info, AlertTriangle, CheckCircle, Target, ArrowUp } from 'lucide-react';

export default function SkillMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showOnlyGaps, setShowOnlyGaps] = useState<boolean>(false);

  const { data: skillMatrix, loading } = useApiData<SkillMatrixEntry>(() => skillMatrixAPI.getSkillMatrix());

  // Get unique categories and roles from the data
  const categories = [...new Set(
    skillMatrix.flatMap(entry => 
      entry.skills.map(skill => skill.category).filter(Boolean)
    )
  )].sort();

  const roles = [...new Set(skillMatrix.map(entry => entry.current_designation))].sort();

  // Filter data based on selected filters
  const filteredMatrix = skillMatrix.filter(entry => {
    const roleMatch = selectedRole === 'all' || entry.current_designation === selectedRole;
    const categoryMatch = selectedCategory === 'all' || 
      entry.skills.some(skill => skill.category === selectedCategory);
    const gapMatch = !showOnlyGaps || (entry.skill_gaps_count && entry.skill_gaps_count > 0);
    
    return roleMatch && categoryMatch && gapMatch;
  });

  const getProficiencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'technical': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'soft skills': return 'bg-green-50 border-green-200 text-green-800';
      case 'domain': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'programming': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'framework': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'database': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSkillGapIcon = (skill: any) => {
    if (skill.is_missing) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    if (skill.meets_requirement === false) {
      return <ArrowUp className="h-4 w-4 text-orange-600" />;
    }
    if (skill.meets_requirement === true && skill.is_mandatory) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (skill.required_proficiency_level && skill.meets_requirement === true) {
      return <Target className="h-4 w-4 text-blue-600" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Skill Matrix</h1>
          <p className="page-subtitle">Overview of GenC skills and proficiency levels</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="cognizant-card p-6">
              <div className="loading-shimmer h-6 rounded mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="loading-shimmer h-8 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Skill Matrix</h1>
        <p className="page-subtitle">Overview of GenC skills, proficiency levels, and role requirements</p>
      </div>

      {/* Filters */}
      <div className="mb-6 cognizant-card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select min-w-0 w-auto"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select min-w-0 w-auto"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showOnlyGaps}
                onChange={(e) => setShowOnlyGaps(e.target.checked)}
                className="mr-2"
              />
              Show only skill gaps
            </label>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              Showing {filteredMatrix.length} of {skillMatrix.length} GenCs
            </span>
          </div>
        </div>
      </div>

      {/* Skill Matrix Grid */}
      {filteredMatrix.length === 0 ? (
        <div className="cognizant-card">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">No GenCs found</p>
            <p className="text-gray-500">Try adjusting your filters or add some GenCs with skills.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatrix.map((entry) => (
            <div key={entry.associate_id} className="cognizant-card">
              <div className="p-6">
                {/* GenC Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.genc_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>ID: {entry.associate_id}</span>
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {entry.current_designation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Total Skills</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {entry.skills.length}
                        </div>
                      </div>
                      
                      {(entry.skill_gaps_count || 0) > 0 && (
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Skill Gaps</div>
                          <div className="text-2xl font-bold text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-5 w-5" />
                            {entry.skill_gaps_count}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Missing Mandatory Skills */}
                {entry.missing_mandatory_skills && entry.missing_mandatory_skills.length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium text-red-800">Missing Mandatory Skills</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {entry.missing_mandatory_skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border border-red-300 rounded p-2">
                          <span className="font-medium text-red-800">{skill.skill_name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.required_proficiency_level)}`}>
                            Required: {skill.required_proficiency_level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {entry.skills.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No skills recorded</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group skills by category */}
                    {Object.entries(
                      entry.skills.reduce((acc, skill) => {
                        const category = skill.category || 'General';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill);
                        return acc;
                      }, {} as Record<string, typeof entry.skills>)
                    ).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className={`text-sm font-medium mb-2 px-3 py-1 rounded-full inline-block border ${getCategoryColor(category)}`}>
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {skills.map((skill, index) => (
                            <div
                              key={`${skill.skill_name}-${index}`}
                              className={`bg-white border rounded-lg p-3 hover:shadow-md transition-shadow ${
                                skill.meets_requirement === false ? 'border-orange-300 bg-orange-50' : 
                                skill.is_mandatory && skill.meets_requirement ? 'border-green-300 bg-green-50' : 
                                'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {skill.skill_name}
                                  </span>
                                  {getSkillGapIcon(skill)}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency_level)}`}>
                                  {skill.proficiency_level}
                                </span>
                              </div>

                              {/* Role Requirement Info */}
                              {skill.required_proficiency_level && (
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                  <span>Required for {entry.current_designation}:</span>
                                  <div className="flex items-center gap-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.required_proficiency_level)}`}>
                                      {skill.required_proficiency_level}
                                    </span>
                                    {skill.is_mandatory && (
                                      <span className="text-red-600 font-medium">(Mandatory)</span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {skill.date_acquired && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(skill.date_acquired).toLocaleDateString()}
                                </div>
                              )}
                              
                              {skill.notes && (
                                <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                                  {skill.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 space-y-4">
        {/* Proficiency Levels */}
        <div className="cognizant-card p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Proficiency Levels</h3>
          <div className="flex flex-wrap gap-3">
            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
              <div key={level} className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(level)}`}>
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Icons */}
        <div className="cognizant-card p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Missing mandatory skill</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Below required level</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Meets mandatory requirement</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Meets role requirement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 