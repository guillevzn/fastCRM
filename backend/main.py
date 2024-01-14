import fastapi as fastapi
import fastapi.security as security

import sqlalchemy.orm as orm

import services as services, schemas as schemas

app = fastapi.FastAPI()

services.create_database()

@app.post("/api/users")
async def create_user(user: schemas.UserCreate, db: orm.Session = fastapi.Depends(services.get_db)):
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise fastapi.HTTPException(status_code=400, detail="Email already in use!")
    
    await services.create_user(user, db)

    return services.create_token(user)

@app.post("/api/token")
async def generate_token(form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(), db: orm.Session = fastapi.Depends(services.get_db)):
    user = await services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Credentials")
    
    return await services.create_token(user)

@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = fastapi.Depends(services.get_current_user)):
    return user

@app.post("/api/leads", response_model=schemas.Lead)
async def create_lead(lead: schemas.LeadCreate, user: schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session=fastapi.Depends(services.get_db)):
    return await services.create_lead(user=user, db=db, lead=lead)