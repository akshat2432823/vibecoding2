from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from typing import List, Optional
import models
import schemas
import pandas as pd
import io
from fastapi import UploadFile

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

async def import_accounts_from_excel(db: Session, file: UploadFile):
    """Import accounts from Excel file"""
    try:
        # Read the uploaded file content
        contents = await file.read()
        
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(io.BytesIO(contents))
        
        # Define expected columns
        expected_columns = ['account_name', 'epl_name', 'edp_name']
        
        # Check if all required columns are present
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Clean the data
        df = df.dropna(subset=expected_columns)  # Remove rows with missing required data
        df = df[expected_columns]  # Keep only required columns
        
        # Track import results
        imported_count = 0
        skipped_count = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Check if account already exists
                existing_account = get_account_by_name(db, row['account_name'])
                if existing_account:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Account '{row['account_name']}' already exists")
                    continue
                
                # Create account data
                account_data = schemas.AccountCreate(
                    account_name=str(row['account_name']).strip(),
                    epl_name=str(row['epl_name']).strip(),
                    edp_name=str(row['edp_name']).strip()
                )
                
                # Create the account
                create_account(db, account_data)
                imported_count += 1
                
            except Exception as e:
                skipped_count += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        return {
            "message": "Import completed",
            "total_rows": len(df),
            "imported": imported_count,
            "skipped": skipped_count,
            "errors": errors[:10] if errors else []  # Limit errors to first 10
        }
        
    except Exception as e:
        raise ValueError(f"Failed to process Excel file: {str(e)}")

async def import_mentors_from_excel(db: Session, file: UploadFile):
    """Import mentors from Excel file"""
    try:
        # Read the uploaded file content
        contents = await file.read()
        
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(io.BytesIO(contents))
        
        # Define expected columns
        expected_columns = ['associate_id', 'mentor_name', 'designation', 'service_line']
        
        # Check if all required columns are present
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Clean the data
        df = df.dropna(subset=expected_columns)  # Remove rows with missing required data
        df = df[expected_columns]  # Keep only required columns
        
        # Track import results
        imported_count = 0
        skipped_count = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Check if mentor already exists
                existing_mentor = get_mentor_by_associate_id(db, row['associate_id'])
                if existing_mentor:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Mentor '{row['associate_id']}' already exists")
                    continue
                
                # Validate designation
                try:
                    designation = models.MentorDesignationEnum(row['designation'])
                except ValueError:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Invalid designation '{row['designation']}'. Valid values: D, AD, SM, M, SA, A")
                    continue
                
                # Create mentor data
                mentor_data = schemas.MentorCreate(
                    associate_id=str(row['associate_id']).strip(),
                    mentor_name=str(row['mentor_name']).strip(),
                    designation=designation,
                    service_line=str(row['service_line']).strip()
                )
                
                # Create the mentor
                create_mentor(db, mentor_data)
                imported_count += 1
                
            except Exception as e:
                skipped_count += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        return {
            "message": "Import completed",
            "total_rows": len(df),
            "imported": imported_count,
            "skipped": skipped_count,
            "errors": errors[:10] if errors else []  # Limit errors to first 10
        }
        
    except Exception as e:
        raise ValueError(f"Failed to process Excel file: {str(e)}")

async def import_account_service_lines_from_excel(db: Session, file: UploadFile):
    """Import account service lines from Excel file"""
    try:
        # Read the uploaded file content
        contents = await file.read()
        
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(io.BytesIO(contents))
        
        # Define expected columns
        expected_columns = ['account_name', 'service_line', 'edl_name', 'pdl_name', 'sl_spoc']
        
        # Check if all required columns are present
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Clean the data
        df = df.dropna(subset=expected_columns)  # Remove rows with missing required data
        df = df[expected_columns]  # Keep only required columns
        
        # Track import results
        imported_count = 0
        skipped_count = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Find account by name
                account = get_account_by_name(db, row['account_name'])
                if not account:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Account '{row['account_name']}' not found")
                    continue
                
                # Create service line data
                service_line_data = schemas.AccountServiceLineCreate(
                    account_id=account.id,
                    service_line=str(row['service_line']).strip(),
                    edl_name=str(row['edl_name']).strip(),
                    pdl_name=str(row['pdl_name']).strip(),
                    sl_spoc=str(row['sl_spoc']).strip()
                )
                
                # Create the service line
                create_account_service_line(db, service_line_data)
                imported_count += 1
                
            except Exception as e:
                skipped_count += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        return {
            "message": "Import completed",
            "total_rows": len(df),
            "imported": imported_count,
            "skipped": skipped_count,
            "errors": errors[:10] if errors else []  # Limit errors to first 10
        }
        
    except Exception as e:
        raise ValueError(f"Failed to process Excel file: {str(e)}")

async def import_gencs_from_excel(db: Session, file: UploadFile):
    """Import GenCs from Excel file"""
    try:
        # Read the uploaded file content
        contents = await file.read()
        
        # Load the Excel file into a pandas DataFrame
        df = pd.read_excel(io.BytesIO(contents))
        
        # Define expected columns
        expected_columns = ['associate_id', 'genc_name', 'account_name', 'service_line', 'mentor_associate_id', 
                          'status', 'date_of_joining', 'location', 'current_designation']
        
        # Check if all required columns are present
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Clean the data - only check required columns for NaN
        required_cols = ['associate_id', 'genc_name', 'account_name', 'service_line', 'mentor_associate_id', 
                        'status', 'date_of_joining', 'location', 'current_designation']
        df = df.dropna(subset=required_cols)
        
        # Track import results
        imported_count = 0
        skipped_count = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Check if GenC already exists
                existing_genc = get_genc_by_associate_id(db, row['associate_id'])
                if existing_genc:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: GenC '{row['associate_id']}' already exists")
                    continue
                
                # Find account by name
                account = get_account_by_name(db, row['account_name'])
                if not account:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Account '{row['account_name']}' not found")
                    continue
                
                # Find service line by account and service line name
                service_line = db.query(models.AccountServiceLine).filter(
                    models.AccountServiceLine.account_id == account.id,
                    models.AccountServiceLine.service_line == row['service_line']
                ).first()
                if not service_line:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Service line '{row['service_line']}' not found for account '{row['account_name']}'")
                    continue
                
                # Find mentor by associate ID
                mentor = get_mentor_by_associate_id(db, row['mentor_associate_id'])
                if not mentor:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Mentor '{row['mentor_associate_id']}' not found")
                    continue
                
                # Validate enums
                try:
                    status = models.StatusEnum(row['status'])
                except ValueError:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Invalid status '{row['status']}'")
                    continue
                
                try:
                    location = models.LocationEnum(row['location'])
                except ValueError:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Invalid location '{row['location']}'")
                    continue
                
                try:
                    designation = models.DesignationEnum(row['current_designation'])
                except ValueError:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Invalid designation '{row['current_designation']}'")
                    continue
                
                # Parse date
                try:
                    if isinstance(row['date_of_joining'], str):
                        from datetime import datetime
                        date_of_joining = datetime.strptime(row['date_of_joining'], '%Y-%m-%d').date()
                    else:
                        date_of_joining = row['date_of_joining'].date() if hasattr(row['date_of_joining'], 'date') else row['date_of_joining']
                except ValueError:
                    skipped_count += 1
                    errors.append(f"Row {index + 2}: Invalid date format for date_of_joining. Use YYYY-MM-DD format")
                    continue
                
                # Create GenC data
                genc_data = schemas.GenCCreate(
                    associate_id=str(row['associate_id']).strip(),
                    genc_name=str(row['genc_name']).strip(),
                    account_id=account.id,
                    service_line_id=service_line.id,
                    mentor_id=mentor.id,
                    status=status,
                    date_of_joining=date_of_joining,
                    location=location,
                    current_designation=designation,
                    # Optional fields
                    date_of_allocation=None,
                    allocation_project=None,
                    team_name=None,
                    planned_billing_start_date=None,
                    actual_billing_start_date=None
                )
                
                # Create the GenC
                create_genc(db, genc_data)
                imported_count += 1
                
            except Exception as e:
                skipped_count += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        return {
            "message": "Import completed",
            "total_rows": len(df),
            "imported": imported_count,
            "skipped": skipped_count,
            "errors": errors[:10] if errors else []  # Limit errors to first 10
        }
        
    except Exception as e:
        raise ValueError(f"Failed to process Excel file: {str(e)}")

def delete_all_accounts_and_related_data(db: Session):
    """Delete all accounts and their related data in the correct order"""
    try:
        # Get counts before deletion for reporting
        gencs_count = db.query(models.GenC).count()
        genc_skills_count = db.query(models.GenCSkill).count()
        genc_feedbacks_count = db.query(models.GenCFeedback).count()
        service_lines_count = db.query(models.AccountServiceLine).count()
        accounts_count = db.query(models.Account).count()
        
        # Delete in order to respect foreign key constraints
        # 1. Delete GenC Skills (depends on GenC)
        db.query(models.GenCSkill).filter(
            models.GenCSkill.genc_id.in_(
                db.query(models.GenC.id).filter(
                    models.GenC.account_id.in_(
                        db.query(models.Account.id)
                    )
                )
            )
        ).delete(synchronize_session=False)
        
        # 2. Delete GenC Feedback (depends on GenC)
        db.query(models.GenCFeedback).filter(
            models.GenCFeedback.genc_id.in_(
                db.query(models.GenC.id).filter(
                    models.GenC.account_id.in_(
                        db.query(models.Account.id)
                    )
                )
            )
        ).delete(synchronize_session=False)
        
        # 3. Delete GenCs (depends on Account and AccountServiceLine)
        db.query(models.GenC).filter(
            models.GenC.account_id.in_(
                db.query(models.Account.id)
            )
        ).delete(synchronize_session=False)
        
        # 4. Delete Account Service Lines (depends on Account)
        db.query(models.AccountServiceLine).filter(
            models.AccountServiceLine.account_id.in_(
                db.query(models.Account.id)
            )
        ).delete(synchronize_session=False)
        
        # 5. Delete Accounts
        db.query(models.Account).delete(synchronize_session=False)
        
        # Commit all deletions
        db.commit()
        
        return {
            "message": "All accounts and related data deleted successfully",
            "deleted_counts": {
                "genc_skills": genc_skills_count,
                "genc_feedbacks": genc_feedbacks_count,
                "gencs": gencs_count,
                "account_service_lines": service_lines_count,
                "accounts": accounts_count
            }
        }
        
    except Exception as e:
        db.rollback()
        raise ValueError(f"Failed to delete accounts and related data: {str(e)}")

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