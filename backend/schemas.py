from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from models import StatusEnum, LocationEnum, DesignationEnum, MentorDesignationEnum, UserTypeEnum, ProficiencyLevelEnum

# Account schemas
class AccountBase(BaseModel):
    account_name: str
    epl_name: str
    edp_name: str

class AccountCreate(AccountBase):
    pass

class AccountUpdate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    
    class Config:
        from_attributes = True

# Account Service Line schemas
class AccountServiceLineBase(BaseModel):
    account_id: int
    service_line: str
    edl_name: str
    pdl_name: str
    sl_spoc: str

class AccountServiceLineCreate(AccountServiceLineBase):
    pass

class AccountServiceLineUpdate(AccountServiceLineBase):
    pass

class AccountServiceLine(AccountServiceLineBase):
    id: int
    
    class Config:
        from_attributes = True

# Mentor schemas
class MentorBase(BaseModel):
    associate_id: str
    mentor_name: str
    designation: MentorDesignationEnum
    service_line: str

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class Mentor(MentorBase):
    id: int
    
    class Config:
        from_attributes = True

# Skill schemas
class SkillBase(BaseModel):
    skill_name: str
    description: Optional[str] = None
    category: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    
    class Config:
        from_attributes = True

# GenC Skill schemas
class GenCSkillBase(BaseModel):
    genc_id: int
    skill_id: int
    proficiency_level: ProficiencyLevelEnum
    date_acquired: Optional[date] = None
    notes: Optional[str] = None

class GenCSkillCreate(GenCSkillBase):
    pass

class GenCSkillUpdate(BaseModel):
    proficiency_level: Optional[ProficiencyLevelEnum] = None
    date_acquired: Optional[date] = None
    notes: Optional[str] = None

class GenCSkill(GenCSkillBase):
    id: int
    
    class Config:
        from_attributes = True

# Role Skill Requirement schemas
class RoleSkillRequirementBase(BaseModel):
    role: DesignationEnum
    skill_id: int
    required_proficiency_level: ProficiencyLevelEnum
    is_mandatory: str = "Yes"

class RoleSkillRequirementCreate(RoleSkillRequirementBase):
    pass

class RoleSkillRequirementUpdate(RoleSkillRequirementBase):
    pass

class RoleSkillRequirement(RoleSkillRequirementBase):
    id: int
    
    class Config:
        from_attributes = True

# GenC schemas (updated without skills field)
class GenCBase(BaseModel):
    associate_id: str
    genc_name: str
    account_id: int
    service_line_id: int
    mentor_id: int
    status: StatusEnum
    date_of_joining: date
    date_of_allocation: Optional[date] = None
    allocation_project: Optional[str] = None
    team_name: Optional[str] = None
    location: LocationEnum
    current_designation: DesignationEnum
    planned_billing_start_date: Optional[date] = None
    actual_billing_start_date: Optional[date] = None

class GenCCreate(GenCBase):
    pass

class GenCUpdate(GenCBase):
    pass

class GenC(GenCBase):
    id: int
    
    class Config:
        from_attributes = True

# GenC Feedback schemas
class GenCFeedbackBase(BaseModel):
    genc_id: int
    mentor_id: int
    date_of_feedback: date
    feedback: str

class GenCFeedbackCreate(GenCFeedbackBase):
    pass

class GenCFeedbackUpdate(GenCFeedbackBase):
    pass

class GenCFeedback(GenCFeedbackBase):
    id: int
    
    class Config:
        from_attributes = True

# Application User schemas
class ApplicationUserBase(BaseModel):
    user_assoc_id: str
    user_name: str
    user_type: UserTypeEnum

class ApplicationUserCreate(ApplicationUserBase):
    pass

class ApplicationUserUpdate(ApplicationUserBase):
    pass

class ApplicationUser(ApplicationUserBase):
    id: int
    
    class Config:
        from_attributes = True

# Skill Matrix Response schemas
class GenCSkillMatrix(BaseModel):
    associate_id: str
    genc_name: str
    skills: List[dict]  # [{skill_name, proficiency_level, category}]
    
    class Config:
        from_attributes = True

class RoleRequirementMatrix(BaseModel):
    role: str
    requirements: List[dict]  # [{skill_name, required_proficiency_level, is_mandatory, category}]
    
    class Config:
        from_attributes = True

# Status transition schema
class StatusTransition(BaseModel):
    from_status: StatusEnum
    to_status: StatusEnum 