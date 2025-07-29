from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import crud
from database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GenC Tracking System", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "GenC Tracking System API"}

# Account endpoints
@app.post("/accounts/", response_model=schemas.Account, status_code=status.HTTP_201_CREATED)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_name(db, account.account_name)
    if db_account:
        raise HTTPException(status_code=400, detail="Account name already registered")
    return crud.create_account(db=db, account=account)

@app.get("/accounts/", response_model=List[schemas.Account])
def read_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=skip, limit=limit)
    return accounts

@app.get("/accounts/{account_id}", response_model=schemas.Account)
def read_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@app.put("/accounts/{account_id}", response_model=schemas.Account)
def update_account(account_id: int, account: schemas.AccountUpdate, db: Session = Depends(get_db)):
    db_account = crud.update_account(db, account_id=account_id, account=account)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account

@app.delete("/accounts/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.delete_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted successfully"}

# Account Service Line endpoints
@app.post("/account-service-lines/", response_model=schemas.AccountServiceLine, status_code=status.HTTP_201_CREATED)
def create_account_service_line(service_line: schemas.AccountServiceLineCreate, db: Session = Depends(get_db)):
    return crud.create_account_service_line(db=db, service_line=service_line)

@app.get("/account-service-lines/", response_model=List[schemas.AccountServiceLine])
def read_account_service_lines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service_lines = crud.get_account_service_lines(db, skip=skip, limit=limit)
    return service_lines

@app.get("/account-service-lines/{service_line_id}", response_model=schemas.AccountServiceLine)
def read_account_service_line(service_line_id: int, db: Session = Depends(get_db)):
    db_service_line = crud.get_account_service_line(db, service_line_id=service_line_id)
    if db_service_line is None:
        raise HTTPException(status_code=404, detail="Account Service Line not found")
    return db_service_line

@app.get("/accounts/{account_id}/service-lines/", response_model=List[schemas.AccountServiceLine])
def read_service_lines_by_account(account_id: int, db: Session = Depends(get_db)):
    return crud.get_service_lines_by_account(db, account_id=account_id)

@app.put("/account-service-lines/{service_line_id}", response_model=schemas.AccountServiceLine)
def update_account_service_line(service_line_id: int, service_line: schemas.AccountServiceLineUpdate, db: Session = Depends(get_db)):
    db_service_line = crud.update_account_service_line(db, service_line_id=service_line_id, service_line=service_line)
    if db_service_line is None:
        raise HTTPException(status_code=404, detail="Account Service Line not found")
    return db_service_line

@app.delete("/account-service-lines/{service_line_id}")
def delete_account_service_line(service_line_id: int, db: Session = Depends(get_db)):
    db_service_line = crud.delete_account_service_line(db, service_line_id=service_line_id)
    if db_service_line is None:
        raise HTTPException(status_code=404, detail="Account Service Line not found")
    return {"message": "Account Service Line deleted successfully"}

# Mentor endpoints
@app.post("/mentors/", response_model=schemas.Mentor, status_code=status.HTTP_201_CREATED)
def create_mentor(mentor: schemas.MentorCreate, db: Session = Depends(get_db)):
    db_mentor = crud.get_mentor_by_associate_id(db, mentor.associate_id)
    if db_mentor:
        raise HTTPException(status_code=400, detail="Mentor associate ID already registered")
    return crud.create_mentor(db=db, mentor=mentor)

@app.get("/mentors/", response_model=List[schemas.Mentor])
def read_mentors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    mentors = crud.get_mentors(db, skip=skip, limit=limit)
    return mentors

@app.get("/mentors/{mentor_id}", response_model=schemas.Mentor)
def read_mentor(mentor_id: int, db: Session = Depends(get_db)):
    db_mentor = crud.get_mentor(db, mentor_id=mentor_id)
    if db_mentor is None:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return db_mentor

@app.put("/mentors/{mentor_id}", response_model=schemas.Mentor)
def update_mentor(mentor_id: int, mentor: schemas.MentorUpdate, db: Session = Depends(get_db)):
    db_mentor = crud.update_mentor(db, mentor_id=mentor_id, mentor=mentor)
    if db_mentor is None:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return db_mentor

@app.delete("/mentors/{mentor_id}")
def delete_mentor(mentor_id: int, db: Session = Depends(get_db)):
    db_mentor = crud.delete_mentor(db, mentor_id=mentor_id)
    if db_mentor is None:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return {"message": "Mentor deleted successfully"}

# Skill endpoints
@app.post("/skills/", response_model=schemas.Skill, status_code=status.HTTP_201_CREATED)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db)):
    db_skill = crud.get_skill_by_name(db, skill.skill_name)
    if db_skill:
        raise HTTPException(status_code=400, detail="Skill name already registered")
    return crud.create_skill(db=db, skill=skill)

@app.get("/skills/", response_model=List[schemas.Skill])
def read_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    skills = crud.get_skills(db, skip=skip, limit=limit)
    return skills

@app.get("/skills/{skill_id}", response_model=schemas.Skill)
def read_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = crud.get_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@app.get("/skills/category/{category}", response_model=List[schemas.Skill])
def read_skills_by_category(category: str, db: Session = Depends(get_db)):
    return crud.get_skills_by_category(db, category=category)

@app.put("/skills/{skill_id}", response_model=schemas.Skill)
def update_skill(skill_id: int, skill: schemas.SkillUpdate, db: Session = Depends(get_db)):
    db_skill = crud.update_skill(db, skill_id=skill_id, skill=skill)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = crud.delete_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}

# GenC Skill endpoints
@app.post("/genc-skills/", response_model=schemas.GenCSkill, status_code=status.HTTP_201_CREATED)
def create_genc_skill(genc_skill: schemas.GenCSkillCreate, db: Session = Depends(get_db)):
    return crud.create_genc_skill(db=db, genc_skill=genc_skill)

@app.get("/genc-skills/", response_model=List[schemas.GenCSkill])
def read_genc_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    genc_skills = crud.get_genc_skills(db, skip=skip, limit=limit)
    return genc_skills

@app.get("/genc-skills/{genc_skill_id}", response_model=schemas.GenCSkill)
def read_genc_skill(genc_skill_id: int, db: Session = Depends(get_db)):
    db_genc_skill = crud.get_genc_skill(db, genc_skill_id=genc_skill_id)
    if db_genc_skill is None:
        raise HTTPException(status_code=404, detail="GenC Skill not found")
    return db_genc_skill

@app.get("/gencs/{genc_id}/skills/", response_model=List[schemas.GenCSkill])
def read_skills_by_genc(genc_id: int, db: Session = Depends(get_db)):
    return crud.get_skills_by_genc(db, genc_id=genc_id)

@app.get("/skills/{skill_id}/gencs/", response_model=List[schemas.GenCSkill])
def read_gencs_by_skill(skill_id: int, db: Session = Depends(get_db)):
    return crud.get_gencs_by_skill(db, skill_id=skill_id)

@app.put("/genc-skills/{genc_skill_id}", response_model=schemas.GenCSkill)
def update_genc_skill(genc_skill_id: int, genc_skill: schemas.GenCSkillUpdate, db: Session = Depends(get_db)):
    db_genc_skill = crud.update_genc_skill(db, genc_skill_id=genc_skill_id, genc_skill=genc_skill)
    if db_genc_skill is None:
        raise HTTPException(status_code=404, detail="GenC Skill not found")
    return db_genc_skill

@app.delete("/genc-skills/{genc_skill_id}")
def delete_genc_skill(genc_skill_id: int, db: Session = Depends(get_db)):
    db_genc_skill = crud.delete_genc_skill(db, genc_skill_id=genc_skill_id)
    if db_genc_skill is None:
        raise HTTPException(status_code=404, detail="GenC Skill not found")
    return {"message": "GenC Skill deleted successfully"}

# Role Skill Requirement endpoints
@app.post("/role-skill-requirements/", response_model=schemas.RoleSkillRequirement, status_code=status.HTTP_201_CREATED)
def create_role_skill_requirement(requirement: schemas.RoleSkillRequirementCreate, db: Session = Depends(get_db)):
    return crud.create_role_skill_requirement(db=db, requirement=requirement)

@app.get("/role-skill-requirements/", response_model=List[schemas.RoleSkillRequirement])
def read_role_skill_requirements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requirements = crud.get_role_skill_requirements(db, skip=skip, limit=limit)
    return requirements

@app.get("/role-skill-requirements/{requirement_id}", response_model=schemas.RoleSkillRequirement)
def read_role_skill_requirement(requirement_id: int, db: Session = Depends(get_db)):
    db_requirement = crud.get_role_skill_requirement(db, requirement_id=requirement_id)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail="Role Skill Requirement not found")
    return db_requirement

@app.get("/roles/{role}/requirements/", response_model=List[schemas.RoleSkillRequirement])
def read_requirements_by_role(role: models.DesignationEnum, db: Session = Depends(get_db)):
    return crud.get_requirements_by_role(db, role=role)

@app.put("/role-skill-requirements/{requirement_id}", response_model=schemas.RoleSkillRequirement)
def update_role_skill_requirement(requirement_id: int, requirement: schemas.RoleSkillRequirementUpdate, db: Session = Depends(get_db)):
    db_requirement = crud.update_role_skill_requirement(db, requirement_id=requirement_id, requirement=requirement)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail="Role Skill Requirement not found")
    return db_requirement

@app.delete("/role-skill-requirements/{requirement_id}")
def delete_role_skill_requirement(requirement_id: int, db: Session = Depends(get_db)):
    db_requirement = crud.delete_role_skill_requirement(db, requirement_id=requirement_id)
    if db_requirement is None:
        raise HTTPException(status_code=404, detail="Role Skill Requirement not found")
    return {"message": "Role Skill Requirement deleted successfully"}

# GenC endpoints (updated without skills field)
@app.post("/gencs/", response_model=schemas.GenC, status_code=status.HTTP_201_CREATED)
def create_genc(genc: schemas.GenCCreate, db: Session = Depends(get_db)):
    db_genc = crud.get_genc_by_associate_id(db, genc.associate_id)
    if db_genc:
        raise HTTPException(status_code=400, detail="GenC associate ID already registered")
    return crud.create_genc(db=db, genc=genc)

@app.get("/gencs/", response_model=List[schemas.GenC])
def read_gencs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    gencs = crud.get_gencs(db, skip=skip, limit=limit)
    return gencs

@app.get("/gencs/{genc_id}", response_model=schemas.GenC)
def read_genc(genc_id: int, db: Session = Depends(get_db)):
    db_genc = crud.get_genc(db, genc_id=genc_id)
    if db_genc is None:
        raise HTTPException(status_code=404, detail="GenC not found")
    return db_genc

@app.put("/gencs/{genc_id}", response_model=schemas.GenC)
def update_genc(genc_id: int, genc: schemas.GenCUpdate, db: Session = Depends(get_db)):
    try:
        db_genc = crud.update_genc(db, genc_id=genc_id, genc=genc)
        if db_genc is None:
            raise HTTPException(status_code=404, detail="GenC not found")
        return db_genc
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/gencs/{genc_id}")
def delete_genc(genc_id: int, db: Session = Depends(get_db)):
    db_genc = crud.delete_genc(db, genc_id=genc_id)
    if db_genc is None:
        raise HTTPException(status_code=404, detail="GenC not found")
    return {"message": "GenC deleted successfully"}

# GenC Feedback endpoints
@app.post("/genc-feedbacks/", response_model=schemas.GenCFeedback, status_code=status.HTTP_201_CREATED)
def create_genc_feedback(feedback: schemas.GenCFeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_genc_feedback(db=db, feedback=feedback)

@app.get("/genc-feedbacks/", response_model=List[schemas.GenCFeedback])
def read_genc_feedbacks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    feedbacks = crud.get_genc_feedbacks(db, skip=skip, limit=limit)
    return feedbacks

@app.get("/genc-feedbacks/{feedback_id}", response_model=schemas.GenCFeedback)
def read_genc_feedback(feedback_id: int, db: Session = Depends(get_db)):
    db_feedback = crud.get_genc_feedback(db, feedback_id=feedback_id)
    if db_feedback is None:
        raise HTTPException(status_code=404, detail="GenC Feedback not found")
    return db_feedback

@app.get("/gencs/{genc_id}/feedbacks/", response_model=List[schemas.GenCFeedback])
def read_feedbacks_by_genc(genc_id: int, db: Session = Depends(get_db)):
    return crud.get_feedbacks_by_genc(db, genc_id=genc_id)

@app.put("/genc-feedbacks/{feedback_id}", response_model=schemas.GenCFeedback)
def update_genc_feedback(feedback_id: int, feedback: schemas.GenCFeedbackUpdate, db: Session = Depends(get_db)):
    db_feedback = crud.update_genc_feedback(db, feedback_id=feedback_id, feedback=feedback)
    if db_feedback is None:
        raise HTTPException(status_code=404, detail="GenC Feedback not found")
    return db_feedback

@app.delete("/genc-feedbacks/{feedback_id}")
def delete_genc_feedback(feedback_id: int, db: Session = Depends(get_db)):
    db_feedback = crud.delete_genc_feedback(db, feedback_id=feedback_id)
    if db_feedback is None:
        raise HTTPException(status_code=404, detail="GenC Feedback not found")
    return {"message": "GenC Feedback deleted successfully"}

# Application User endpoints
@app.post("/application-users/", response_model=schemas.ApplicationUser, status_code=status.HTTP_201_CREATED)
def create_application_user(user: schemas.ApplicationUserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_application_user_by_assoc_id(db, user.user_assoc_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User associate ID already registered")
    return crud.create_application_user(db=db, user=user)

@app.get("/application-users/", response_model=List[schemas.ApplicationUser])
def read_application_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_application_users(db, skip=skip, limit=limit)
    return users

@app.get("/application-users/{user_id}", response_model=schemas.ApplicationUser)
def read_application_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_application_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Application User not found")
    return db_user

@app.put("/application-users/{user_id}", response_model=schemas.ApplicationUser)
def update_application_user(user_id: int, user: schemas.ApplicationUserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_application_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Application User not found")
    return db_user

@app.delete("/application-users/{user_id}")
def delete_application_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_application_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Application User not found")
    return {"message": "Application User deleted successfully"}

# Skill Matrix endpoints
@app.get("/skill-matrix/")
def get_skill_matrix(db: Session = Depends(get_db)):
    """Get skill matrix showing all GenCs with their skills and proficiency levels"""
    return crud.get_skill_matrix(db)

@app.get("/role-requirements-matrix/")
def get_role_requirements_matrix(db: Session = Depends(get_db)):
    """Get role requirements matrix showing required skills for each role"""
    return crud.get_role_requirements_matrix(db)

# Utility endpoints
@app.get("/enums/status")
def get_status_enum():
    return {status.name: status.value for status in models.StatusEnum}

@app.get("/enums/location")
def get_location_enum():
    return {location.name: location.value for location in models.LocationEnum}

@app.get("/enums/designation")
def get_designation_enum():
    return {designation.name: designation.value for designation in models.DesignationEnum}

@app.get("/enums/mentor-designation")
def get_mentor_designation_enum():
    return {designation.name: designation.value for designation in models.MentorDesignationEnum}

@app.get("/enums/user-type")
def get_user_type_enum():
    return {user_type.name: user_type.value for user_type in models.UserTypeEnum}

@app.get("/enums/proficiency-level")
def get_proficiency_level_enum():
    return {level.name: level.value for level in models.ProficiencyLevelEnum}

@app.get("/enums/status-transitions")
def get_status_transitions():
    return {status.value: [transition.value for transition in transitions] 
            for status, transitions in crud.ALLOWED_STATUS_TRANSITIONS.items()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 