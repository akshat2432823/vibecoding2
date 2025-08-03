#!/usr/bin/env python3
"""
Test data creation script for GenC Tracking System
Run this script to populate the database with sample data for all entities.
"""

import sys
import os
from datetime import datetime, date, timedelta
import random

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models
import crud
import schemas

# Create all tables
models.Base.metadata.create_all(bind=engine)

def create_test_data():
    """Create comprehensive test data for all entities"""
    db = SessionLocal()
    
    try:
        print("🚀 Creating test data for GenC Tracking System...")
        
        # 1. Create Skills
        print("📚 Creating Skills...")
        skills_data = [
            # Technical Skills
            {"skill_name": "Python", "description": "Python programming language", "category": "Programming"},
            {"skill_name": "JavaScript", "description": "JavaScript programming language", "category": "Programming"},
            {"skill_name": "Java", "description": "Java programming language", "category": "Programming"},
            {"skill_name": "C#", "description": "C# programming language", "category": "Programming"},
            {"skill_name": "SQL", "description": "Structured Query Language", "category": "Database"},
            {"skill_name": "MongoDB", "description": "NoSQL database", "category": "Database"},
            {"skill_name": "PostgreSQL", "description": "Relational database", "category": "Database"},
            
            # Frameworks
            {"skill_name": "React", "description": "Frontend JavaScript framework", "category": "Framework"},
            {"skill_name": "Angular", "description": "Frontend JavaScript framework", "category": "Framework"},
            {"skill_name": "Django", "description": "Python web framework", "category": "Framework"},
            {"skill_name": "Spring Boot", "description": "Java framework", "category": "Framework"},
            {"skill_name": "FastAPI", "description": "Python API framework", "category": "Framework"},
            
            # Cloud & DevOps
            {"skill_name": "AWS", "description": "Amazon Web Services", "category": "Cloud"},
            {"skill_name": "Azure", "description": "Microsoft Azure", "category": "Cloud"},
            {"skill_name": "Docker", "description": "Containerization platform", "category": "DevOps"},
            {"skill_name": "Kubernetes", "description": "Container orchestration", "category": "DevOps"},
            {"skill_name": "Jenkins", "description": "CI/CD tool", "category": "DevOps"},
            
            # Technical Skills
            {"skill_name": "Machine Learning", "description": "ML algorithms and models", "category": "Technical"},
            {"skill_name": "Data Analysis", "description": "Data analysis and visualization", "category": "Technical"},
            {"skill_name": "API Development", "description": "REST API development", "category": "Technical"},
            {"skill_name": "System Design", "description": "Software system architecture", "category": "Technical"},
            
            # Soft Skills
            {"skill_name": "Communication", "description": "Effective communication skills", "category": "Soft Skills"},
            {"skill_name": "Leadership", "description": "Team leadership abilities", "category": "Soft Skills"},
            {"skill_name": "Problem Solving", "description": "Analytical problem-solving", "category": "Soft Skills"},
            {"skill_name": "Time Management", "description": "Efficient time management", "category": "Soft Skills"},
            {"skill_name": "Teamwork", "description": "Collaborative teamwork", "category": "Soft Skills"},
            
            # Domain Skills
            {"skill_name": "Banking Domain", "description": "Banking and financial services", "category": "Domain"},
            {"skill_name": "Healthcare Domain", "description": "Healthcare and medical systems", "category": "Domain"},
            {"skill_name": "E-commerce", "description": "E-commerce platforms", "category": "Domain"},
            {"skill_name": "Insurance Domain", "description": "Insurance industry knowledge", "category": "Domain"},
        ]
        
        created_skills = []
        for skill_data in skills_data:
            try:
                skill = crud.create_skill(db, schemas.SkillCreate(**skill_data))
                created_skills.append(skill)
                print(f"   ✅ Created skill: {skill.skill_name}")
            except Exception as e:
                print(f"   ⚠️  Skill {skill_data['skill_name']} may already exist")
        
        # 2. Create Accounts
        print("\n🏢 Creating Accounts...")
        accounts_data = [
            {"account_name": "JPMorgan Chase", "epl_name": "Sarah Johnson", "edp_name": "Michael Davis"},
            {"account_name": "Microsoft Corporation", "epl_name": "David Wilson", "edp_name": "Lisa Anderson"},
            {"account_name": "Amazon Web Services", "epl_name": "Emily Chen", "edp_name": "Robert Taylor"},
            {"account_name": "Google Cloud", "epl_name": "James Rodriguez", "edp_name": "Amanda White"},
            {"account_name": "Citibank", "epl_name": "Maria Garcia", "edp_name": "Christopher Lee"},
            {"account_name": "Wells Fargo", "epl_name": "Kevin Brown", "edp_name": "Jessica Martinez"},
            {"account_name": "IBM Corporation", "epl_name": "Rachel Kim", "edp_name": "Daniel Thompson"},
            {"account_name": "Oracle Systems", "epl_name": "Steven Clark", "edp_name": "Michelle Adams"},
            {"account_name": "SAP Solutions", "epl_name": "Jennifer Wang", "edp_name": "Thomas Miller"},
            {"account_name": "Salesforce Inc", "epl_name": "Brian Cooper", "edp_name": "Laura Jones"},
        ]
        
        created_accounts = []
        for account_data in accounts_data:
            try:
                account = crud.create_account(db, schemas.AccountCreate(**account_data))
                created_accounts.append(account)
                print(f"   ✅ Created account: {account.account_name}")
            except Exception as e:
                print(f"   ⚠️  Account {account_data['account_name']} may already exist")
        
        # 3. Create Account Service Lines
        print("\n🔗 Creating Account Service Lines...")
        service_lines_data = [
            # JPMorgan Chase
            {"account_id": 1, "service_line": "Digital Banking", "edl_name": "Alex Kumar", "pdl_name": "Priya Sharma", "sl_spoc": "Raj Patel"},
            {"account_id": 1, "service_line": "Investment Banking", "edl_name": "Vikram Singh", "pdl_name": "Anita Desai", "sl_spoc": "Suresh Reddy"},
            
            # Microsoft
            {"account_id": 2, "service_line": "Cloud Solutions", "edl_name": "Natasha Iyer", "pdl_name": "Arjun Mehta", "sl_spoc": "Deepika Rao"},
            {"account_id": 2, "service_line": "Enterprise Software", "edl_name": "Rohit Gupta", "pdl_name": "Sneha Jain", "sl_spoc": "Manish Agarwal"},
            
            # Amazon
            {"account_id": 3, "service_line": "E-commerce Platform", "edl_name": "Kavya Nair", "pdl_name": "Sanjay Kumar", "sl_spoc": "Ravi Krishnan"},
            {"account_id": 3, "service_line": "AWS Infrastructure", "edl_name": "Meera Pillai", "pdl_name": "Ashwin Menon", "sl_spoc": "Divya Nanda"},
            
            # Google
            {"account_id": 4, "service_line": "Search & Analytics", "edl_name": "Karan Malhotra", "pdl_name": "Isha Verma", "sl_spoc": "Nikhil Pandey"},
            
            # Citibank
            {"account_id": 5, "service_line": "Retail Banking", "edl_name": "Pooja Singhal", "pdl_name": "Amit Chandra", "sl_spoc": "Neha Kapoor"},
            
            # Wells Fargo
            {"account_id": 6, "service_line": "Wealth Management", "edl_name": "Rakesh Tiwari", "pdl_name": "Swati Bansal", "sl_spoc": "Varun Goel"},
            
            # IBM Corporation
            {"account_id": 7, "service_line": "AI Solutions", "edl_name": "Arjun Nair", "pdl_name": "Kavita Singh", "sl_spoc": "Ravi Kumar"},
        ]
        
        created_service_lines = []
        for sl_data in service_lines_data:
            try:
                service_line = crud.create_account_service_line(db, schemas.AccountServiceLineCreate(**sl_data))
                created_service_lines.append(service_line)
                print(f"   ✅ Created service line: {service_line.service_line}")
            except Exception as e:
                print(f"   ⚠️  Service line may already exist")
        
        # 4. Create Mentors
        print("\n👨‍🏫 Creating Mentors...")
        mentors_data = [
            {"associate_id": "M001", "mentor_name": "Rajesh Kumar", "designation": models.MentorDesignationEnum.SM, "service_line": "Digital Banking"},
            {"associate_id": "M002", "mentor_name": "Priya Sharma", "designation": models.MentorDesignationEnum.M, "service_line": "Cloud Solutions"},
            {"associate_id": "M003", "mentor_name": "Vikram Singh", "designation": models.MentorDesignationEnum.SA, "service_line": "Investment Banking"},
            {"associate_id": "M004", "mentor_name": "Anita Desai", "designation": models.MentorDesignationEnum.SM, "service_line": "E-commerce Platform"},
            {"associate_id": "M005", "mentor_name": "Suresh Reddy", "designation": models.MentorDesignationEnum.M, "service_line": "Enterprise Software"},
            {"associate_id": "M006", "mentor_name": "Natasha Iyer", "designation": models.MentorDesignationEnum.SA, "service_line": "Search & Analytics"},
            {"associate_id": "M007", "mentor_name": "Rohit Gupta", "designation": models.MentorDesignationEnum.M, "service_line": "Retail Banking"},
            {"associate_id": "M008", "mentor_name": "Kavya Nair", "designation": models.MentorDesignationEnum.SM, "service_line": "Wealth Management"},
            {"associate_id": "M009", "mentor_name": "Sanjay Kumar", "designation": models.MentorDesignationEnum.M, "service_line": "AI Solutions"},
            {"associate_id": "M010", "mentor_name": "Meera Pillai", "designation": models.MentorDesignationEnum.SA, "service_line": "Cloud Solutions"},
        ]
        
        created_mentors = []
        for mentor_data in mentors_data:
            try:
                mentor = crud.create_mentor(db, schemas.MentorCreate(**mentor_data))
                created_mentors.append(mentor)
                print(f"   ✅ Created mentor: {mentor.mentor_name}")
            except Exception as e:
                print(f"   ⚠️  Mentor {mentor_data['associate_id']} may already exist")
        
        # 5. Create Role Skill Requirements
        print("\n🎯 Creating Role Skill Requirements...")
        role_requirements_data = [
            # PAT (Principal Associate Trainee) Requirements
            {"role": models.DesignationEnum.PAT, "skill_id": 1, "required_proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "is_mandatory": "Yes"},  # Python
            {"role": models.DesignationEnum.PAT, "skill_id": 2, "required_proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "is_mandatory": "Yes"},  # JavaScript
            {"role": models.DesignationEnum.PAT, "skill_id": 5, "required_proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "is_mandatory": "Yes"},  # SQL
            {"role": models.DesignationEnum.PAT, "skill_id": 22, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"},  # Communication
            {"role": models.DesignationEnum.PAT, "skill_id": 24, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"},  # Problem Solving
            
            # PA (Principal Associate) Requirements
            {"role": models.DesignationEnum.PA, "skill_id": 1, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"},  # Python
            {"role": models.DesignationEnum.PA, "skill_id": 2, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"},  # JavaScript
            {"role": models.DesignationEnum.PA, "skill_id": 5, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"},  # SQL
            {"role": models.DesignationEnum.PA, "skill_id": 8, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "No"},   # React
            {"role": models.DesignationEnum.PA, "skill_id": 20, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"}, # API Development
            {"role": models.DesignationEnum.PA, "skill_id": 22, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},    # Communication
            {"role": models.DesignationEnum.PA, "skill_id": 23, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "No"}, # Leadership
            
            # A (Associate) Requirements
            {"role": models.DesignationEnum.A, "skill_id": 1, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},    # Python
            {"role": models.DesignationEnum.A, "skill_id": 2, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},    # JavaScript
            {"role": models.DesignationEnum.A, "skill_id": 5, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},    # SQL
            {"role": models.DesignationEnum.A, "skill_id": 8, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},    # React
            {"role": models.DesignationEnum.A, "skill_id": 20, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},   # API Development
            {"role": models.DesignationEnum.A, "skill_id": 21, "required_proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "is_mandatory": "Yes"}, # System Design
            {"role": models.DesignationEnum.A, "skill_id": 22, "required_proficiency_level": models.ProficiencyLevelEnum.EXPERT, "is_mandatory": "Yes"},      # Communication
            {"role": models.DesignationEnum.A, "skill_id": 23, "required_proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "is_mandatory": "Yes"},   # Leadership
        ]
        
        for req_data in role_requirements_data:
            try:
                requirement = crud.create_role_skill_requirement(db, schemas.RoleSkillRequirementCreate(**req_data))
                print(f"   ✅ Created role requirement: {requirement.role.value} - {requirement.skill.skill_name}")
            except Exception as e:
                print(f"   ⚠️  Role requirement may already exist")
        
        # 6. Create GenCs
        print("\n👨‍💼 Creating GenCs...")
        gencs_data = [
            {
                "associate_id": "G001", "genc_name": "Arun Kumar", "account_id": 1, "service_line_id": 1, "mentor_id": 1,
                "status": models.StatusEnum.UNDER_PROJECT_TRAINING, "date_of_joining": date(2024, 1, 15),
                "date_of_allocation": date(2024, 2, 1), "allocation_project": "Digital Banking Portal",
                "team_name": "Phoenix Team", "location": models.LocationEnum.BANGALORE, 
                "current_designation": models.DesignationEnum.PAT,
                "planned_billing_start_date": date(2024, 4, 1)
            },
            {
                "associate_id": "G002", "genc_name": "Sneha Patel", "account_id": 2, "service_line_id": 3, "mentor_id": 2,
                "status": models.StatusEnum.CUSTOMER_ONBOARDED, "date_of_joining": date(2024, 1, 20),
                "date_of_allocation": date(2024, 2, 5), "allocation_project": "Azure Migration",
                "team_name": "Cloud Warriors", "location": models.LocationEnum.HYDERABAD,
                "current_designation": models.DesignationEnum.PA,
                "planned_billing_start_date": date(2024, 3, 15), "actual_billing_start_date": date(2024, 3, 20)
            },
            {
                "associate_id": "G003", "genc_name": "Rahul Singh", "account_id": 3, "service_line_id": 5, "mentor_id": 4,
                "status": models.StatusEnum.BILLING_STARTED, "date_of_joining": date(2023, 12, 10),
                "date_of_allocation": date(2024, 1, 15), "allocation_project": "E-commerce Analytics",
                "team_name": "Data Insights", "location": models.LocationEnum.PUNE,
                "current_designation": models.DesignationEnum.A,
                "planned_billing_start_date": date(2024, 2, 1), "actual_billing_start_date": date(2024, 2, 1)
            },
            {
                "associate_id": "G004", "genc_name": "Pooja Sharma", "account_id": 1, "service_line_id": 2, "mentor_id": 3,
                "status": models.StatusEnum.BILLING_PLANNED, "date_of_joining": date(2024, 2, 1),
                "date_of_allocation": date(2024, 2, 15), "allocation_project": "Investment Portfolio System",
                "team_name": "FinTech Innovators", "location": models.LocationEnum.MUMBAI,
                "current_designation": models.DesignationEnum.PA,
                "planned_billing_start_date": date(2024, 4, 15)
            },
            {
                "associate_id": "G005", "genc_name": "Vikash Jain", "account_id": 4, "service_line_id": 7, "mentor_id": 6,
                "status": models.StatusEnum.IDLE, "date_of_joining": date(2024, 3, 1),
                "location": models.LocationEnum.CHENNAI, "current_designation": models.DesignationEnum.PAT
            },
            {
                "associate_id": "G006", "genc_name": "Divya Reddy", "account_id": 2, "service_line_id": 4, "mentor_id": 5,
                "status": models.StatusEnum.UNDER_PROJECT_TRAINING, "date_of_joining": date(2024, 2, 15),
                "date_of_allocation": date(2024, 3, 1), "allocation_project": "Enterprise CRM",
                "team_name": "Digital Solutions", "location": models.LocationEnum.BANGALORE,
                "current_designation": models.DesignationEnum.PAT,
                "planned_billing_start_date": date(2024, 5, 1)
            },
            {
                "associate_id": "G007", "genc_name": "Amit Verma", "account_id": 5, "service_line_id": 8, "mentor_id": 7,
                "status": models.StatusEnum.GENC_REGULARIZED, "date_of_joining": date(2023, 10, 1),
                "date_of_allocation": date(2023, 11, 15), "allocation_project": "Mobile Banking App",
                "team_name": "Mobile First", "location": models.LocationEnum.DELHI,
                "current_designation": models.DesignationEnum.A,
                "planned_billing_start_date": date(2024, 1, 1), "actual_billing_start_date": date(2024, 1, 1)
            },
            {
                "associate_id": "G008", "genc_name": "Priyanka Das", "account_id": 6, "service_line_id": 9, "mentor_id": 8,
                "status": models.StatusEnum.CUSTOMER_ONBOARDED, "date_of_joining": date(2024, 1, 30),
                "date_of_allocation": date(2024, 2, 20), "allocation_project": "Wealth Management Dashboard",
                "team_name": "Financial Analytics", "location": models.LocationEnum.KOLKATA,
                "current_designation": models.DesignationEnum.PA,
                "planned_billing_start_date": date(2024, 4, 10)
            },
            {
                "associate_id": "G009", "genc_name": "Karthik Mohan", "account_id": 7, "service_line_id": 10, "mentor_id": 9,
                "status": models.StatusEnum.UNDER_PROJECT_TRAINING, "date_of_joining": date(2024, 3, 5),
                "date_of_allocation": date(2024, 3, 20), "allocation_project": "AI Chatbot Development",
                "team_name": "AI Innovation", "location": models.LocationEnum.BANGALORE,
                "current_designation": models.DesignationEnum.PAT,
                "planned_billing_start_date": date(2024, 5, 15)
            },
            {
                "associate_id": "G010", "genc_name": "Riya Chakraborty", "account_id": 2, "service_line_id": 3, "mentor_id": 10,
                "status": models.StatusEnum.BILLING_PLANNED, "date_of_joining": date(2024, 2, 28),
                "date_of_allocation": date(2024, 3, 15), "allocation_project": "Cloud Migration Phase 2",
                "team_name": "Cloud Warriors", "location": models.LocationEnum.HYDERABAD,
                "current_designation": models.DesignationEnum.PA,
                "planned_billing_start_date": date(2024, 4, 30)
            }
        ]
        
        created_gencs = []
        for genc_data in gencs_data:
            try:
                genc = crud.create_genc(db, schemas.GenCCreate(**genc_data))
                created_gencs.append(genc)
                print(f"   ✅ Created GenC: {genc.genc_name}")
            except Exception as e:
                print(f"   ⚠️  GenC {genc_data['associate_id']} may already exist")
        
        # 7. Create GenC Skills
        print("\n🎯 Creating GenC Skills...")
        genc_skills_data = [
            # Arun Kumar (G001) - PAT level skills
            {"genc_id": 1, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 1, 20), "notes": "Learning through online courses"},
            {"genc_id": 1, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 1, 25), "notes": "Previous experience from college"},
            {"genc_id": 1, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 2, 1), "notes": "Database fundamentals"},
            {"genc_id": 1, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 1, 15)},
            {"genc_id": 1, "skill_id": 28, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 2, 10), "notes": "Banking domain training"},
            
            # Sneha Patel (G002) - PA level skills
            {"genc_id": 2, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 1, 25)},
            {"genc_id": 2, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 1)},
            {"genc_id": 2, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 5)},
            {"genc_id": 2, "skill_id": 8, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 10)},
            {"genc_id": 2, "skill_id": 13, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 15), "notes": "Azure certified"},
            {"genc_id": 2, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 20)},
            
            # Rahul Singh (G003) - A level skills (should meet most requirements)
            {"genc_id": 3, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 12, 15)},
            {"genc_id": 3, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2023, 12, 20)},
            {"genc_id": 3, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 5)},
            {"genc_id": 3, "skill_id": 8, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 10)},
            {"genc_id": 3, "skill_id": 18, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 1, 20), "notes": "ML for analytics"},
            {"genc_id": 3, "skill_id": 19, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 25)},
            {"genc_id": 3, "skill_id": 20, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 1)},
            {"genc_id": 3, "skill_id": 21, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 5)},
            {"genc_id": 3, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 12, 10)},
            {"genc_id": 3, "skill_id": 23, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 30)},
            
            # Pooja Sharma (G004) - PA with some skill gaps
            {"genc_id": 4, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 2, 5), "notes": "Needs improvement"},
            {"genc_id": 4, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 10)},
            {"genc_id": 4, "skill_id": 3, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 1), "notes": "Strong in Java"},
            {"genc_id": 4, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 15)},
            {"genc_id": 4, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 1), "notes": "Needs to reach Advanced level"},
            {"genc_id": 4, "skill_id": 28, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 20)},
            
            # Vikash Jain (G005) - PAT with minimal skills (skill gaps)
            {"genc_id": 5, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 5)},
            {"genc_id": 5, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 1), "notes": "Basic communication skills"},
            
            # Divya Reddy (G006) - PAT progressing well
            {"genc_id": 6, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 20)},
            {"genc_id": 6, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 1)},
            {"genc_id": 6, "skill_id": 4, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 25), "notes": "Strong C# background"},
            {"genc_id": 6, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 5)},
            {"genc_id": 6, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 15)},
            {"genc_id": 6, "skill_id": 24, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 20)},
            
            # Amit Verma (G007) - A level, well established
            {"genc_id": 7, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 10, 15)},
            {"genc_id": 7, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 10, 20)},
            {"genc_id": 7, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2023, 11, 1)},
            {"genc_id": 7, "skill_id": 8, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 11, 10)},
            {"genc_id": 7, "skill_id": 20, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 11, 20)},
            {"genc_id": 7, "skill_id": 21, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2023, 12, 1)},
            {"genc_id": 7, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 10, 10)},
            {"genc_id": 7, "skill_id": 23, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 12, 15)},
            {"genc_id": 7, "skill_id": 28, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2023, 11, 25)},
            
            # Priyanka Das (G008) - PA level
            {"genc_id": 8, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 5)},
            {"genc_id": 8, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 2, 10)},
            {"genc_id": 8, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 15)},
            {"genc_id": 8, "skill_id": 19, "proficiency_level": models.ProficiencyLevelEnum.EXPERT, "date_acquired": date(2024, 2, 25), "notes": "Data analysis specialist"},
            {"genc_id": 8, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 1, 30)},
            {"genc_id": 8, "skill_id": 30, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 20)},
            
            # Karthik Mohan (G009) - PAT with AI focus
            {"genc_id": 9, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 10)},
            {"genc_id": 9, "skill_id": 18, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 15), "notes": "Learning ML fundamentals"},
            {"genc_id": 9, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.BEGINNER, "date_acquired": date(2024, 3, 8)},
            {"genc_id": 9, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 5)},
            {"genc_id": 9, "skill_id": 24, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 3, 12)},
            
            # Riya Chakraborty (G010) - PA with cloud expertise
            {"genc_id": 10, "skill_id": 1, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 5)},
            {"genc_id": 10, "skill_id": 2, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 10)},
            {"genc_id": 10, "skill_id": 5, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 8)},
            {"genc_id": 10, "skill_id": 13, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 3, 15), "notes": "Azure certified"},
            {"genc_id": 10, "skill_id": 15, "proficiency_level": models.ProficiencyLevelEnum.INTERMEDIATE, "date_acquired": date(2024, 3, 18)},
            {"genc_id": 10, "skill_id": 22, "proficiency_level": models.ProficiencyLevelEnum.ADVANCED, "date_acquired": date(2024, 2, 28)},
        ]
        
        for skill_data in genc_skills_data:
            try:
                genc_skill = crud.create_genc_skill(db, schemas.GenCSkillCreate(**skill_data))
                print(f"   ✅ Added skill to GenC")
            except Exception as e:
                print(f"   ⚠️  GenC skill may already exist")
        
        # 8. Create GenC Feedback
        print("\n💬 Creating GenC Feedback...")
        feedback_data = [
            {
                "genc_id": 1, "mentor_id": 1, "date_of_feedback": date(2024, 2, 15),
                "feedback": "Arun is showing good progress in Python basics. Recommend more practice with data structures and algorithms. Communication skills are improving steadily."
            },
            {
                "genc_id": 2, "mentor_id": 2, "date_of_feedback": date(2024, 3, 1),
                "feedback": "Sneha has excellent technical skills and is ready for client interaction. Her Azure knowledge is impressive and she's contributing well to the project."
            },
            {
                "genc_id": 3, "mentor_id": 4, "date_of_feedback": date(2024, 2, 28),
                "feedback": "Rahul is performing exceptionally well. His analytical skills and leadership qualities make him a valuable team member. Ready for more challenging assignments."
            },
            {
                "genc_id": 4, "mentor_id": 3, "date_of_feedback": date(2024, 3, 10),
                "feedback": "Pooja needs to strengthen her Python skills to meet PA requirements. Java expertise is excellent. Recommend focused Python training before client allocation."
            },
            {
                "genc_id": 5, "mentor_id": 6, "date_of_feedback": date(2024, 3, 15),
                "feedback": "Vikash is in early learning phase. Needs intensive training in programming fundamentals and SQL. Shows enthusiasm and willingness to learn."
            },
            {
                "genc_id": 6, "mentor_id": 5, "date_of_feedback": date(2024, 3, 20),
                "feedback": "Divya is making good progress. Her C# skills are strong and problem-solving abilities are excellent. Python and SQL skills are developing well."
            },
            {
                "genc_id": 7, "mentor_id": 7, "date_of_feedback": date(2024, 3, 5),
                "feedback": "Amit is an exemplary associate. His technical expertise and leadership skills are outstanding. He's mentoring junior team members effectively."
            },
            {
                "genc_id": 8, "mentor_id": 8, "date_of_feedback": date(2024, 3, 12),
                "feedback": "Priyanka's data analysis skills are exceptional. Her insights are valuable for the wealth management project. Communication with clients is professional."
            },
            {
                "genc_id": 9, "mentor_id": 9, "date_of_feedback": date(2024, 3, 25),
                "feedback": "Karthik shows great potential in AI and machine learning. His enthusiasm for learning new technologies is commendable. Needs more practice in production-level coding."
            },
            {
                "genc_id": 10, "mentor_id": 10, "date_of_feedback": date(2024, 3, 28),
                "feedback": "Riya demonstrates strong cloud architecture understanding. Her Azure certifications are up-to-date and she contributes well to design discussions. Ready for client engagement."
            }
        ]
        
        for feedback in feedback_data:
            try:
                genc_feedback = crud.create_genc_feedback(db, schemas.GenCFeedbackCreate(**feedback))
                print(f"   ✅ Created feedback for GenC ID {feedback['genc_id']}")
            except Exception as e:
                print(f"   ⚠️  Feedback may already exist")
        
        # 9. Create Application Users
        print("\n👥 Creating Application Users...")
        users_data = [
            {"user_assoc_id": "U001", "user_name": "Admin User", "user_type": models.UserTypeEnum.PMO_MEMBER},
            {"user_assoc_id": "U002", "user_name": "HR Manager", "user_type": models.UserTypeEnum.MDU_MEMBER},
            {"user_assoc_id": "U003", "user_name": "Rajesh Kumar", "user_type": models.UserTypeEnum.MENTOR},
            {"user_assoc_id": "U004", "user_name": "Service Line Lead", "user_type": models.UserTypeEnum.SL_MEMBER},
            {"user_assoc_id": "U005", "user_name": "Project Manager", "user_type": models.UserTypeEnum.PMO_MEMBER},
            {"user_assoc_id": "U006", "user_name": "Priya Sharma", "user_type": models.UserTypeEnum.MENTOR},
            {"user_assoc_id": "U007", "user_name": "Technical Lead", "user_type": models.UserTypeEnum.SL_MEMBER},
            {"user_assoc_id": "U008", "user_name": "Delivery Manager", "user_type": models.UserTypeEnum.PMO_MEMBER},
            {"user_assoc_id": "U009", "user_name": "Talent Acquisition", "user_type": models.UserTypeEnum.MDU_MEMBER},
            {"user_assoc_id": "U010", "user_name": "Vikram Singh", "user_type": models.UserTypeEnum.MENTOR},
        ]
        
        for user_data in users_data:
            try:
                user = crud.create_application_user(db, schemas.ApplicationUserCreate(**user_data))
                print(f"   ✅ Created user: {user.user_name}")
            except Exception as e:
                print(f"   ⚠️  User {user_data['user_assoc_id']} may already exist")
        
        print("\n🎉 Test data creation completed successfully!")
        print("\n📊 Summary:")
        print(f"   • {len(skills_data)} Skills created")
        print(f"   • {len(accounts_data)} Accounts created")
        print(f"   • {len(service_lines_data)} Service Lines created")
        print(f"   • {len(mentors_data)} Mentors created")
        print(f"   • {len(gencs_data)} GenCs created")
        print(f"   • {len(genc_skills_data)} GenC-Skill relationships created")
        print(f"   • {len(role_requirements_data)} Role requirements created")
        print(f"   • {len(feedback_data)} Feedback entries created")
        print(f"   • {len(users_data)} Application users created")
        
        print("\n🔍 Test Scenarios Created:")
        print("   • GenCs with skill gaps (to test gap analysis)")
        print("   • GenCs meeting role requirements (to test success cases)")
        print("   • GenCs with missing mandatory skills (to test alerts)")
        print("   • Different proficiency levels across roles")
        print("   • Various project allocations and statuses")
        
        print("\n🚀 You can now:")
        print("   • View the Skill Matrix to see role requirements and gaps")
        print("   • Test GenC creation with skills")
        print("   • Explore role requirements management")
        print("   • Check feedback and progress tracking")
        
    except Exception as e:
        print(f"❌ Error creating test data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data() 