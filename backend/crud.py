from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from typing import List, Optional
import models
import schemas

# Status transition rules for GenC
ALLOWED_STATUS_TRANSITIONS = {
    models.StatusEnum.IDLE: [
        models.StatusEnum.UNDER_PROJECT_TRAINING,
        models.StatusEnum.CUSTOMER_ONBOARDED,
        models.StatusEnum.RELEASED_RESIGNED
    ],
    models.StatusEnum.UNDER_PROJECT_TRAINING: [
        models.StatusEnum.CUSTOMER_ONBOARDED,
        models.StatusEnum.FEEDBACK_NOT_GOOD,
        models.StatusEnum.RELEASED_RESIGNED
    ],
    models.StatusEnum.CUSTOMER_ONBOARDED: [
        models.StatusEnum.BILLING_PLANNED,
        models.StatusEnum.FEEDBACK_NOT_GOOD,
        models.StatusEnum.RELEASED_RESIGNED
    ],
    models.StatusEnum.BILLING_PLANNED: [
        models.StatusEnum.FEEDBACK_NOT_GOOD,
        models.StatusEnum.BILLING_STARTED,
        models.StatusEnum.RELEASED_RESIGNED
    ],
    models.StatusEnum.BILLING_STARTED: [
        models.StatusEnum.GENC_REGULARIZED,
        models.StatusEnum.RELEASED_RESIGNED
    ],
    models.StatusEnum.FEEDBACK_NOT_GOOD: [],
    models.StatusEnum.GENC_REGULARIZED: [],
    models.StatusEnum.RELEASED_RESIGNED: []
}

def validate_status_transition(current_status: models.StatusEnum, new_status: models.StatusEnum) -> bool:
    """Validate if the status transition is allowed"""
    if current_status == new_status:
        return True
    return new_status in ALLOWED_STATUS_TRANSITIONS.get(current_status, [])

# Account CRUD
def get_account(db: Session, account_id: int):
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def get_account_by_name(db: Session, account_name: str):
    return db.query(models.Account).filter(models.Account.account_name == account_name).first()

def get_accounts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Account).offset(skip).limit(limit).all()

def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Account(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def update_account(db: Session, account_id: int, account: schemas.AccountUpdate):
    db_account = get_account(db, account_id)
    if db_account:
        for key, value in account.model_dump().items():
            setattr(db_account, key, value)
        db.commit()
        db.refresh(db_account)
    return db_account

def delete_account(db: Session, account_id: int):
    db_account = get_account(db, account_id)
    if db_account:
        db.delete(db_account)
        db.commit()
    return db_account

# Account Service Line CRUD
def get_account_service_line(db: Session, service_line_id: int):
    return db.query(models.AccountServiceLine).filter(models.AccountServiceLine.id == service_line_id).first()

def get_account_service_lines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AccountServiceLine).options(
        joinedload(models.AccountServiceLine.account)
    ).offset(skip).limit(limit).all()

def get_service_lines_by_account(db: Session, account_id: int):
    return db.query(models.AccountServiceLine).filter(models.AccountServiceLine.account_id == account_id).all()

def create_account_service_line(db: Session, service_line: schemas.AccountServiceLineCreate):
    db_service_line = models.AccountServiceLine(**service_line.model_dump())
    db.add(db_service_line)
    db.commit()
    db.refresh(db_service_line)
    return db_service_line

def update_account_service_line(db: Session, service_line_id: int, service_line: schemas.AccountServiceLineUpdate):
    db_service_line = get_account_service_line(db, service_line_id)
    if db_service_line:
        for key, value in service_line.model_dump().items():
            setattr(db_service_line, key, value)
        db.commit()
        db.refresh(db_service_line)
    return db_service_line

def delete_account_service_line(db: Session, service_line_id: int):
    db_service_line = get_account_service_line(db, service_line_id)
    if db_service_line:
        db.delete(db_service_line)
        db.commit()
    return db_service_line

# Mentor CRUD
def get_mentor(db: Session, mentor_id: int):
    return db.query(models.Mentor).filter(models.Mentor.id == mentor_id).first()

def get_mentor_by_associate_id(db: Session, associate_id: str):
    return db.query(models.Mentor).filter(models.Mentor.associate_id == associate_id).first()

def get_mentors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Mentor).offset(skip).limit(limit).all()

def create_mentor(db: Session, mentor: schemas.MentorCreate):
    db_mentor = models.Mentor(**mentor.model_dump())
    db.add(db_mentor)
    db.commit()
    db.refresh(db_mentor)
    return db_mentor

def update_mentor(db: Session, mentor_id: int, mentor: schemas.MentorUpdate):
    db_mentor = get_mentor(db, mentor_id)
    if db_mentor:
        for key, value in mentor.model_dump().items():
            setattr(db_mentor, key, value)
        db.commit()
        db.refresh(db_mentor)
    return db_mentor

def delete_mentor(db: Session, mentor_id: int):
    db_mentor = get_mentor(db, mentor_id)
    if db_mentor:
        db.delete(db_mentor)
        db.commit()
    return db_mentor

# Skill CRUD
def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id).first()

def get_skill_by_name(db: Session, skill_name: str):
    return db.query(models.Skill).filter(models.Skill.skill_name == skill_name).first()

def get_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Skill).offset(skip).limit(limit).all()

def get_skills_by_category(db: Session, category: str):
    return db.query(models.Skill).filter(models.Skill.category == category).all()

def create_skill(db: Session, skill: schemas.SkillCreate):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def update_skill(db: Session, skill_id: int, skill: schemas.SkillUpdate):
    db_skill = get_skill(db, skill_id)
    if db_skill:
        for key, value in skill.model_dump().items():
            setattr(db_skill, key, value)
        db.commit()
        db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if db_skill:
        db.delete(db_skill)
        db.commit()
    return db_skill

# GenC Skill CRUD
def get_genc_skill(db: Session, genc_skill_id: int):
    return db.query(models.GenCSkill).options(
        joinedload(models.GenCSkill.skill),
        joinedload(models.GenCSkill.genc)
    ).filter(models.GenCSkill.id == genc_skill_id).first()

def get_genc_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GenCSkill).options(
        joinedload(models.GenCSkill.skill),
        joinedload(models.GenCSkill.genc)
    ).offset(skip).limit(limit).all()

def get_skills_by_genc(db: Session, genc_id: int):
    return db.query(models.GenCSkill).options(
        joinedload(models.GenCSkill.skill)
    ).filter(models.GenCSkill.genc_id == genc_id).all()

def get_gencs_by_skill(db: Session, skill_id: int):
    return db.query(models.GenCSkill).options(
        joinedload(models.GenCSkill.genc)
    ).filter(models.GenCSkill.skill_id == skill_id).all()

def create_genc_skill(db: Session, genc_skill: schemas.GenCSkillCreate):
    # Check if this GenC-Skill combination already exists
    existing = db.query(models.GenCSkill).filter(
        and_(models.GenCSkill.genc_id == genc_skill.genc_id, 
             models.GenCSkill.skill_id == genc_skill.skill_id)
    ).first()
    
    if existing:
        # Update existing record
        for key, value in genc_skill.model_dump().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new record
        db_genc_skill = models.GenCSkill(**genc_skill.model_dump())
        db.add(db_genc_skill)
        db.commit()
        db.refresh(db_genc_skill)
        return db_genc_skill

def update_genc_skill(db: Session, genc_skill_id: int, genc_skill: schemas.GenCSkillUpdate):
    db_genc_skill = get_genc_skill(db, genc_skill_id)
    if db_genc_skill:
        for key, value in genc_skill.model_dump(exclude_unset=True).items():
            setattr(db_genc_skill, key, value)
        db.commit()
        db.refresh(db_genc_skill)
    return db_genc_skill

def delete_genc_skill(db: Session, genc_skill_id: int):
    db_genc_skill = get_genc_skill(db, genc_skill_id)
    if db_genc_skill:
        db.delete(db_genc_skill)
        db.commit()
    return db_genc_skill

# Role Skill Requirement CRUD
def get_role_skill_requirement(db: Session, requirement_id: int):
    return db.query(models.RoleSkillRequirement).options(
        joinedload(models.RoleSkillRequirement.skill)
    ).filter(models.RoleSkillRequirement.id == requirement_id).first()

def get_role_skill_requirements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.RoleSkillRequirement).options(
        joinedload(models.RoleSkillRequirement.skill)
    ).offset(skip).limit(limit).all()

def get_requirements_by_role(db: Session, role: models.DesignationEnum):
    return db.query(models.RoleSkillRequirement).options(
        joinedload(models.RoleSkillRequirement.skill)
    ).filter(models.RoleSkillRequirement.role == role).all()

def create_role_skill_requirement(db: Session, requirement: schemas.RoleSkillRequirementCreate):
    # Check if this role-skill combination already exists
    existing = db.query(models.RoleSkillRequirement).filter(
        and_(models.RoleSkillRequirement.role == requirement.role,
             models.RoleSkillRequirement.skill_id == requirement.skill_id)
    ).first()
    
    if existing:
        # Update existing record
        for key, value in requirement.model_dump().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new record
        db_requirement = models.RoleSkillRequirement(**requirement.model_dump())
        db.add(db_requirement)
        db.commit()
        db.refresh(db_requirement)
        return db_requirement

def update_role_skill_requirement(db: Session, requirement_id: int, requirement: schemas.RoleSkillRequirementUpdate):
    db_requirement = get_role_skill_requirement(db, requirement_id)
    if db_requirement:
        for key, value in requirement.model_dump().items():
            setattr(db_requirement, key, value)
        db.commit()
        db.refresh(db_requirement)
    return db_requirement

def delete_role_skill_requirement(db: Session, requirement_id: int):
    db_requirement = get_role_skill_requirement(db, requirement_id)
    if db_requirement:
        db.delete(db_requirement)
        db.commit()
    return db_requirement

# GenC CRUD (updated with relationships)
def get_genc(db: Session, genc_id: int):
    return db.query(models.GenC).options(
        joinedload(models.GenC.account),
        joinedload(models.GenC.service_line_obj),
        joinedload(models.GenC.mentor),
        joinedload(models.GenC.skills).joinedload(models.GenCSkill.skill)
    ).filter(models.GenC.id == genc_id).first()

def get_genc_by_associate_id(db: Session, associate_id: str):
    return db.query(models.GenC).options(
        joinedload(models.GenC.account),
        joinedload(models.GenC.service_line_obj),
        joinedload(models.GenC.mentor),
        joinedload(models.GenC.skills).joinedload(models.GenCSkill.skill)
    ).filter(models.GenC.associate_id == associate_id).first()

def get_gencs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GenC).options(
        joinedload(models.GenC.account),
        joinedload(models.GenC.service_line_obj),
        joinedload(models.GenC.mentor),
        joinedload(models.GenC.skills).joinedload(models.GenCSkill.skill)
    ).offset(skip).limit(limit).all()

def create_genc(db: Session, genc: schemas.GenCCreate):
    db_genc = models.GenC(**genc.model_dump())
    db.add(db_genc)
    db.commit()
    db.refresh(db_genc)
    return db_genc

def update_genc(db: Session, genc_id: int, genc: schemas.GenCUpdate):
    db_genc = get_genc(db, genc_id)
    if db_genc:
        # Validate status transition if status is being changed
        if hasattr(genc, 'status') and genc.status != db_genc.status:
            if not validate_status_transition(db_genc.status, genc.status):
                raise ValueError(f"Invalid status transition from {db_genc.status.value} to {genc.status.value}")
        
        for key, value in genc.model_dump().items():
            setattr(db_genc, key, value)
        db.commit()
        db.refresh(db_genc)
    return db_genc

def delete_genc(db: Session, genc_id: int):
    db_genc = get_genc(db, genc_id)
    if db_genc:
        db.delete(db_genc)
        db.commit()
    return db_genc

# GenC Feedback CRUD
def get_genc_feedback(db: Session, feedback_id: int):
    return db.query(models.GenCFeedback).options(
        joinedload(models.GenCFeedback.genc),
        joinedload(models.GenCFeedback.mentor)
    ).filter(models.GenCFeedback.id == feedback_id).first()

def get_genc_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GenCFeedback).options(
        joinedload(models.GenCFeedback.genc),
        joinedload(models.GenCFeedback.mentor)
    ).offset(skip).limit(limit).all()

def get_feedbacks_by_genc(db: Session, genc_id: int):
    return db.query(models.GenCFeedback).options(
        joinedload(models.GenCFeedback.mentor)
    ).filter(models.GenCFeedback.genc_id == genc_id).all()

def create_genc_feedback(db: Session, feedback: schemas.GenCFeedbackCreate):
    db_feedback = models.GenCFeedback(**feedback.model_dump())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def update_genc_feedback(db: Session, feedback_id: int, feedback: schemas.GenCFeedbackUpdate):
    db_feedback = get_genc_feedback(db, feedback_id)
    if db_feedback:
        for key, value in feedback.model_dump().items():
            setattr(db_feedback, key, value)
        db.commit()
        db.refresh(db_feedback)
    return db_feedback

def delete_genc_feedback(db: Session, feedback_id: int):
    db_feedback = get_genc_feedback(db, feedback_id)
    if db_feedback:
        db.delete(db_feedback)
        db.commit()
    return db_feedback

# Application User CRUD
def get_application_user(db: Session, user_id: int):
    return db.query(models.ApplicationUser).filter(models.ApplicationUser.id == user_id).first()

def get_application_user_by_assoc_id(db: Session, user_assoc_id: str):
    return db.query(models.ApplicationUser).filter(models.ApplicationUser.user_assoc_id == user_assoc_id).first()

def get_application_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ApplicationUser).offset(skip).limit(limit).all()

def create_application_user(db: Session, user: schemas.ApplicationUserCreate):
    db_user = models.ApplicationUser(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_application_user(db: Session, user_id: int, user: schemas.ApplicationUserUpdate):
    db_user = get_application_user(db, user_id)
    if db_user:
        for key, value in user.model_dump().items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_application_user(db: Session, user_id: int):
    db_user = get_application_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# Skill Matrix functions
def get_skill_matrix(db: Session):
    """Get skill matrix for all GenCs with role requirements and gap analysis"""
    gencs = db.query(models.GenC).options(
        joinedload(models.GenC.skills).joinedload(models.GenCSkill.skill)
    ).all()
    
    # Get all role requirements for comparison
    role_requirements = db.query(models.RoleSkillRequirement).options(
        joinedload(models.RoleSkillRequirement.skill)
    ).all()
    
    # Create a mapping of role -> skill -> requirement
    role_skill_map = {}
    for req in role_requirements:
        role_key = req.role.value
        if role_key not in role_skill_map:
            role_skill_map[role_key] = {}
        role_skill_map[role_key][req.skill.skill_name] = {
            "required_proficiency_level": req.required_proficiency_level.value,
            "is_mandatory": req.is_mandatory
        }
    
    # Proficiency level hierarchy for comparison
    proficiency_levels = {
        "Beginner": 1,
        "Intermediate": 2,
        "Advanced": 3,
        "Expert": 4
    }
    
    result = []
    
    for genc in gencs:
        genc_skills = []
        current_role = genc.current_designation.value
        role_requirements_for_genc = role_skill_map.get(current_role, {})
        
        for skill_rel in genc.skills:
            skill_name = skill_rel.skill.skill_name
            current_proficiency = skill_rel.proficiency_level.value
            current_level_value = proficiency_levels.get(current_proficiency, 0)
            
            # Check if this skill has requirements for the current role
            requirement = role_requirements_for_genc.get(skill_name)
            meets_requirement = True
            required_proficiency = None
            is_mandatory = False
            
            if requirement:
                required_proficiency = requirement["required_proficiency_level"]
                is_mandatory = requirement["is_mandatory"] == "Yes"
                required_level_value = proficiency_levels.get(required_proficiency, 0)
                meets_requirement = current_level_value >= required_level_value
            
            genc_skills.append({
                "skill_name": skill_rel.skill.skill_name,
                "proficiency_level": current_proficiency,
                "category": skill_rel.skill.category,
                "date_acquired": skill_rel.date_acquired.isoformat() if skill_rel.date_acquired else None,
                "notes": skill_rel.notes,
                "required_proficiency_level": required_proficiency,
                "is_mandatory": is_mandatory,
                "meets_requirement": meets_requirement
            })
        
        # Check for missing mandatory skills
        missing_skills = []
        for skill_name, requirement in role_requirements_for_genc.items():
            if requirement["is_mandatory"] == "Yes":
                # Check if GenC has this skill
                has_skill = any(skill["skill_name"] == skill_name for skill in genc_skills)
                if not has_skill:
                    missing_skills.append({
                        "skill_name": skill_name,
                        "required_proficiency_level": requirement["required_proficiency_level"],
                        "is_mandatory": True,
                        "is_missing": True
                    })
        
        result.append({
            "associate_id": genc.associate_id,
            "genc_name": genc.genc_name,
            "current_designation": genc.current_designation.value,
            "skills": genc_skills,
            "missing_mandatory_skills": missing_skills,
            "skill_gaps_count": len([s for s in genc_skills if not s["meets_requirement"]]) + len(missing_skills)
        })
    
    return result

def get_role_requirements_matrix(db: Session):
    """Get role requirements matrix for all roles"""
    roles = db.query(models.RoleSkillRequirement.role).distinct().all()
    result = []
    
    for role_tuple in roles:
        role = role_tuple[0]
        requirements = get_requirements_by_role(db, role)
        
        role_requirements = []
        for req in requirements:
            role_requirements.append({
                "skill_name": req.skill.skill_name,
                "required_proficiency_level": req.required_proficiency_level.value,
                "is_mandatory": req.is_mandatory,
                "category": req.skill.category
            })
        
        result.append({
            "role": role.value,
            "requirements": role_requirements
        })
    
    return result 