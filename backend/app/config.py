import os
from datetime import timedelta

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///app.db")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "batgestor-super-secret-key-change-in-production")
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
 
