// Enums
export enum StatusEnum {
  IDLE = "Idle",
  UNDER_PROJECT_TRAINING = "Under Project Training",
  CUSTOMER_ONBOARDED = "Customer Onboarded",
  BILLING_PLANNED = "Billing Planned",
  FEEDBACK_NOT_GOOD = "Feedback Not Good",
  BILLING_STARTED = "Billing Started",
  GENC_REGULARIZED = "GenC Regularized",
  RELEASED_RESIGNED = "Released/Resigned"
}

export enum LocationEnum {
  MUMBAI = "Mumbai",
  DELHI = "Delhi",
  BANGALORE = "Bangalore",
  HYDERABAD = "Hyderabad",
  CHENNAI = "Chennai",
  KOLKATA = "Kolkata",
  PUNE = "Pune",
  AHMEDABAD = "Ahmedabad",
  SURAT = "Surat",
  JAIPUR = "Jaipur"
}

export enum DesignationEnum {
  A = "A",
  PA = "PA",
  PAT = "PAT"
}

export enum MentorDesignationEnum {
  D = "D",
  AD = "AD",
  SM = "SM",
  M = "M",
  SA = "SA",
  A = "A"
}

export enum UserTypeEnum {
  PMO_MEMBER = "PMO Member",
  MDU_MEMBER = "MDU Member",
  MENTOR = "Mentor",
  SL_MEMBER = "SL Member"
}

export enum ProficiencyLevelEnum {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert"
}

// Base interfaces
export interface Account {
  id: number;
  account_name: string;
  epl_name: string;
  edp_name: string;
}

export interface AccountServiceLine {
  id: number;
  account_id: number;
  service_line: string;
  edl_name: string;
  pdl_name: string;
  sl_spoc: string;
  account?: Account;
}

export interface Mentor {
  id: number;
  associate_id: string;
  mentor_name: string;
  designation: MentorDesignationEnum;
  service_line: string;
}

export interface Skill {
  id: number;
  skill_name: string;
  description?: string;
  category?: string;
}

export interface GenCSkill {
  id: number;
  genc_id: number;
  skill_id: number;
  proficiency_level: ProficiencyLevelEnum;
  date_acquired?: string;
  notes?: string;
  skill?: Skill;
  genc?: GenC;
}

export interface RoleSkillRequirement {
  id: number;
  role: DesignationEnum;
  skill_id: number;
  required_proficiency_level: ProficiencyLevelEnum;
  is_mandatory: string;
  skill?: Skill;
}

export interface GenC {
  id: number;
  associate_id: string;
  genc_name: string;
  account_id: number;
  service_line_id: number;
  mentor_id: number;
  status: StatusEnum;
  date_of_joining: string;
  date_of_allocation?: string;
  allocation_project?: string;
  team_name?: string;
  location: LocationEnum;
  current_designation: DesignationEnum;
  planned_billing_start_date?: string;
  actual_billing_start_date?: string;
  account?: Account;
  service_line_obj?: AccountServiceLine;
  mentor?: Mentor;
  skills?: GenCSkill[];
}

export interface GenCFeedback {
  id: number;
  genc_id: number;
  mentor_id: number;
  date_of_feedback: string;
  feedback: string;
  genc?: GenC;
  mentor?: Mentor;
}

export interface ApplicationUser {
  id: number;
  user_assoc_id: string;
  user_name: string;
  user_type: UserTypeEnum;
}

// Create types (without id and computed fields)
export type AccountCreate = Omit<Account, 'id'>;
export type AccountServiceLineCreate = Omit<AccountServiceLine, 'id' | 'account'>;
export type MentorCreate = Omit<Mentor, 'id'>;
export type SkillCreate = Omit<Skill, 'id'>;
export type GenCSkillCreate = Omit<GenCSkill, 'id' | 'skill' | 'genc'>;
export type RoleSkillRequirementCreate = Omit<RoleSkillRequirement, 'id' | 'skill'>;
export type GenCCreate = Omit<GenC, 'id' | 'account' | 'service_line_obj' | 'mentor' | 'skills'>;
export type GenCFeedbackCreate = Omit<GenCFeedback, 'id' | 'genc' | 'mentor'>;
export type ApplicationUserCreate = Omit<ApplicationUser, 'id'>;

// Skill Matrix interfaces
export interface SkillMatrixEntry {
  associate_id: string;
  genc_name: string;
  current_designation: string;
  skills: {
    skill_name: string;
    proficiency_level: string;
    category?: string;
    date_acquired?: string;
    notes?: string;
    required_proficiency_level?: string;
    is_mandatory?: boolean;
    meets_requirement?: boolean;
  }[];
  missing_mandatory_skills?: {
    skill_name: string;
    required_proficiency_level: string;
    is_mandatory: boolean;
    is_missing: boolean;
  }[];
  skill_gaps_count?: number;
}

export interface RoleRequirementMatrix {
  role: string;
  requirements: {
    skill_name: string;
    required_proficiency_level: string;
    is_mandatory: string;
    category?: string;
  }[];
} 