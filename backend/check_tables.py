import sqlite3
import os

db_path = "himalride.db"

if not os.path.exists(db_path):
    print(f"❌ Database file '{db_path}' not found!")
    exit(1)

print(f"✅ Database file '{db_path}' exists")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

if tables:
    print("\n📋 Tables found:")
    for table in tables:
        print(f"  - {table[0]}")
else:
    print("\n⚠️  No tables found. Run migrations: alembic upgrade head")

# Check if roles table has data
cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='roles';")
role_table_exists = cursor.fetchone()[0] > 0

if role_table_exists:
    cursor.execute("SELECT COUNT(*) FROM roles;")
    role_count = cursor.fetchone()[0]
    print(f"\n👤 Roles table has {role_count} rows")
else:
    print("\n⚠️  Roles table not found - run migrations")

conn.close()
