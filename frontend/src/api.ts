import axios from 'axios';
import {
  Account, AccountCreate, AccountServiceLine, AccountServiceLineCreate,
  Mentor, MentorCreate, GenC, GenCCreate, GenCFeedback, GenCFeedbackCreate,
  ApplicationUser, ApplicationUserCreate, Skill, SkillCreate, GenCSkill, GenCSkillCreate,
  RoleSkillRequirement, RoleSkillRequirementCreate, SkillMatrixEntry, RoleRequirementMatrix
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Account API
export const accountAPI = {
  getAll: () => api.get<Account[]>('/accounts/'),
  getById: (id: number) => api.get<Account>(`/accounts/${id}`),
  create: (data: AccountCreate) => api.post<Account>('/accounts/', data),
  update: (id: number, data: AccountCreate) => api.put<Account>(`/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounts/${id}`),
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/accounts/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAll: () => api.delete('/accounts/delete-all/')
};

// Account Service Line API
export const accountServiceLineAPI = {
  getAll: () => api.get<AccountServiceLine[]>('/account-service-lines/'),
  getById: (id: number) => api.get<AccountServiceLine>(`/account-service-lines/${id}`),
  getByAccount: (accountId: number) => api.get<AccountServiceLine[]>(`/accounts/${accountId}/service-lines/`),
  create: (data: AccountServiceLineCreate) => api.post<AccountServiceLine>('/account-service-lines/', data),
  update: (id: number, data: AccountServiceLineCreate) => api.put<AccountServiceLine>(`/account-service-lines/${id}`, data),
  delete: (id: number) => api.delete(`/account-service-lines/${id}`),
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/account-service-lines/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Mentor API
export const mentorAPI = {
  getAll: () => api.get<Mentor[]>('/mentors/'),
  getById: (id: number) => api.get<Mentor>(`/mentors/${id}`),
  create: (data: MentorCreate) => api.post<Mentor>('/mentors/', data),
  update: (id: number, data: MentorCreate) => api.put<Mentor>(`/mentors/${id}`, data),
  delete: (id: number) => api.delete(`/mentors/${id}`),
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/mentors/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Skill API
export const skillAPI = {
  getAll: () => api.get<Skill[]>('/skills/'),
  getById: (id: number) => api.get<Skill>(`/skills/${id}`),
  getByCategory: (category: string) => api.get<Skill[]>(`/skills/category/${category}`),
  create: (data: SkillCreate) => api.post<Skill>('/skills/', data),
  update: (id: number, data: SkillCreate) => api.put<Skill>(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`)
};

// GenC Skill API
export const genCSkillAPI = {
  getAll: () => api.get<GenCSkill[]>('/genc-skills/'),
  getById: (id: number) => api.get<GenCSkill>(`/genc-skills/${id}`),
  getByGenC: (gencId: number) => api.get<GenCSkill[]>(`/gencs/${gencId}/skills/`),
  getBySkill: (skillId: number) => api.get<GenCSkill[]>(`/skills/${skillId}/gencs/`),
  create: (data: GenCSkillCreate) => api.post<GenCSkill>('/genc-skills/', data),
  update: (id: number, data: Partial<GenCSkillCreate>) => api.put<GenCSkill>(`/genc-skills/${id}`, data),
  delete: (id: number) => api.delete(`/genc-skills/${id}`)
};

// Role Skill Requirement API
export const roleSkillRequirementAPI = {
  getAll: () => api.get<RoleSkillRequirement[]>('/role-skill-requirements/'),
  getById: (id: number) => api.get<RoleSkillRequirement>(`/role-skill-requirements/${id}`),
  getByRole: (role: string) => api.get<RoleSkillRequirement[]>(`/roles/${role}/requirements/`),
  create: (data: RoleSkillRequirementCreate) => api.post<RoleSkillRequirement>('/role-skill-requirements/', data),
  update: (id: number, data: RoleSkillRequirementCreate) => api.put<RoleSkillRequirement>(`/role-skill-requirements/${id}`, data),
  delete: (id: number) => api.delete(`/role-skill-requirements/${id}`)
};

// GenC API (updated)
export const genCAPI = {
  getAll: () => api.get<GenC[]>('/gencs/'),
  getById: (id: number) => api.get<GenC>(`/gencs/${id}`),
  create: (data: GenCCreate) => api.post<GenC>('/gencs/', data),
  update: (id: number, data: GenCCreate) => api.put<GenC>(`/gencs/${id}`, data),
  delete: (id: number) => api.delete(`/gencs/${id}`),
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/gencs/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// GenC Feedback API
export const genCFeedbackAPI = {
  getAll: () => api.get<GenCFeedback[]>('/genc-feedbacks/'),
  getById: (id: number) => api.get<GenCFeedback>(`/genc-feedbacks/${id}`),
  getByGenC: (gencId: number) => api.get<GenCFeedback[]>(`/gencs/${gencId}/feedbacks/`),
  create: (data: GenCFeedbackCreate) => api.post<GenCFeedback>('/genc-feedbacks/', data),
  update: (id: number, data: GenCFeedbackCreate) => api.put<GenCFeedback>(`/genc-feedbacks/${id}`, data),
  delete: (id: number) => api.delete(`/genc-feedbacks/${id}`)
};

// Application User API
export const applicationUserAPI = {
  getAll: () => api.get<ApplicationUser[]>('/application-users/'),
  getById: (id: number) => api.get<ApplicationUser>(`/application-users/${id}`),
  create: (data: ApplicationUserCreate) => api.post<ApplicationUser>('/application-users/', data),
  update: (id: number, data: ApplicationUserCreate) => api.put<ApplicationUser>(`/application-users/${id}`, data),
  delete: (id: number) => api.delete(`/application-users/${id}`)
};

// Skill Matrix API
export const skillMatrixAPI = {
  getSkillMatrix: () => api.get<SkillMatrixEntry[]>('/skill-matrix/'),
  getRoleRequirementsMatrix: () => api.get<RoleRequirementMatrix[]>('/role-requirements-matrix/')
};

// Enum API
export const enumAPI = {
  getStatuses: () => api.get('/enums/status'),
  getLocations: () => api.get('/enums/location'),
  getDesignations: () => api.get('/enums/designation'),
  getMentorDesignations: () => api.get('/enums/mentor-designation'),
  getUserTypes: () => api.get('/enums/user-type'),
  getProficiencyLevels: () => api.get('/enums/proficiency-level'),
  getStatusTransitions: () => api.get('/enums/status-transitions')
};

export default api; 