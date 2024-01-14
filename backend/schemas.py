import datetime as dt

import pydantic as pydantic

class UserBase(pydantic.BaseModel):
    email: str

class UserCreate(UserBase):
    hashed_password: str

    model_config = pydantic.ConfigDict(from_attributes=True)

class User(UserBase):
    id: int

    model_config = pydantic.ConfigDict(from_attributes=True)

class LeadBase(pydantic.BaseModel):
    first_name: str
    last_name: str
    email: str
    company: str
    note: str

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    owner_id: int
    date_created: dt.datetime
    date_last_updated: dt.datetime

    model_config = pydantic.ConfigDict(from_attributes=True)