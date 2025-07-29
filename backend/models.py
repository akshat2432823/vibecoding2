from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from database import Base
import enum

class StatusEnum(enum.Enum):
    IDLE = "Idle"
    UNDER_PROJECT_TRAINING = "Under Project Training"
    CUSTOMER_ONBOARDED = "Customer Onboarded"
    BILLING_PLANNED = "Billing Planned"
    FEEDBACK_NOT_GOOD = "Feedback Not Good"
    BILLING_STARTED = "Billing Started"
    GENC_REGULARIZED = "GenC Regularized"
    RELEASED_RESIGNED = "Released/Resigned"

class LocationEnum(enum.Enum):
    MUMBAI = "Mumbai"
    DELHI = "Delhi"
    BANGALORE = "Bangalore"
    HYDERABAD = "Hyderabad"
    CHENNAI = "Chennai"
    KOLKATA = "Kolkata"
    PUNE = "Pune"
    AHMEDABAD = "Ahmedabad"
    SURAT = "Surat"
    JAIPUR = "Jaipur"

class DesignationEnum(enum.Enum):
    A = "A"
    PA = "PA"
    PAT = "PAT"

class MentorDesignationEnum(enum.Enum):
    D = "D"
    AD = "AD"
    SM = "SM"
    M = "M"
    SA = "SA"
    A = "A"

class UserTypeEnum(enum.Enum):
    PMO_MEMBER = "PMO Member"
    MDU_MEMBER = "MDU Member"
    MENTOR = "Mentor"
    SL_MEMBER = "SL Member"

class ProficiencyLevelEnum(enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String(255), unique=True, index=True, nullable=False)
    epl_name = Column(String(255), nullable=False)
    edp_name = Column(String(255), nullable=False)
    
    # Relationships
    service_lines = relationship("AccountServiceLine", back_populates="account")
    gencs = relationship("GenC", back_populates="account")

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    associate_id = Column(String(50), unique=True, index=True, nullable=False)
    mentor_name = Column(String(255), nullable=False)
    designation = Column(SQLEnum(MentorDesignationEnum), nullable=False)
    service_line = Column(String(255), nullable=False)
    
    # Relationships
    gencs = relationship("GenC", back_populates="mentor")
    feedbacks = relationship("GenCFeedback", back_populates="mentor")

class AccountServiceLine(Base):
    __tablename__ = "account_service_lines"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    service_line = Column(String(255), nullable=False)
    edl_name = Column(String(255), nullable=False)
    pdl_name = Column(String(255), nullable=False)
    sl_spoc = Column(String(255), nullable=False)
    
    # Relationships
    account = relationship("Account", back_populates="service_lines")
    gencs = relationship("GenC", back_populates="service_line_obj")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text)
    category = Column(String(100))  # e.g., "Technical", "Soft Skills", "Domain"
    
    # Relationships
    genc_skills = relationship("GenCSkill", back_populates="skill")
    role_requirements = relationship("RoleSkillRequirement", back_populates="skill")

class GenC(Base):
    __tablename__ = "gencs"
    
    id = Column(Integer, primary_key=True, index=True)
    associate_id = Column(String(50), unique=True, index=True, nullable=False)
    genc_name = Column(String(255), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    service_line_id = Column(Integer, ForeignKey("account_service_lines.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("mentors.id"), nullable=False)
    status = Column(SQLEnum(StatusEnum), nullable=False, default=StatusEnum.IDLE)
    date_of_joining = Column(Date, nullable=False)
    date_of_allocation = Column(Date)
    allocation_project = Column(String(255))
    team_name = Column(String(255))
    location = Column(SQLEnum(LocationEnum), nullable=False)
    current_designation = Column(SQLEnum(DesignationEnum), nullable=False)
    planned_billing_start_date = Column(Date)
    actual_billing_start_date = Column(Date)
    
    # Relationships
    account = relationship("Account", back_populates="gencs")
    service_line_obj = relationship("AccountServiceLine", back_populates="gencs")
    mentor = relationship("Mentor", back_populates="gencs")
    feedbacks = relationship("GenCFeedback", back_populates="genc")
    skills = relationship("GenCSkill", back_populates="genc")

class GenCSkill(Base):
    __tablename__ = "genc_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    genc_id = Column(Integer, ForeignKey("gencs.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(SQLEnum(ProficiencyLevelEnum), nullable=False)
    date_acquired = Column(Date)
    notes = Column(Text)
    
    # Relationships
    genc = relationship("GenC", back_populates="skills")
    skill = relationship("Skill", back_populates="genc_skills")

class RoleSkillRequirement(Base):
    __tablename__ = "role_skill_requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(SQLEnum(DesignationEnum), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_proficiency_level = Column(SQLEnum(ProficiencyLevelEnum), nullable=False)
    is_mandatory = Column(String(10), default="Yes")  # "Yes" or "No"
    
    # Relationships
    skill = relationship("Skill", back_populates="role_requirements")

class GenCFeedback(Base):
    __tablename__ = "genc_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    genc_id = Column(Integer, ForeignKey("gencs.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("mentors.id"), nullable=False)
    date_of_feedback = Column(Date, nullable=False)
    feedback = Column(Text, nullable=False)
    
    # Relationships
    genc = relationship("GenC", back_populates="feedbacks")
    mentor = relationship("Mentor", back_populates="feedbacks")

class ApplicationUser(Base):
    __tablename__ = "application_users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_assoc_id = Column(String(50), unique=True, index=True, nullable=False)
    user_name = Column(String(255), nullable=False)
    user_type = Column(SQLEnum(UserTypeEnum), nullable=False) 