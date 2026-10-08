from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return {"token": access_token, "user": new_user}

@router.post("/login", response_model=schemas.Token)
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not auth.verify_password(login_req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"token": access_token, "user": user}

@router.post("/refresh", response_model=schemas.Token)
def refresh(current_user: dict = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.get("sub")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"token": access_token, "user": user}
