import sqlite3

DATABASE = "mood_mentor.db"

conn = sqlite3.connect(DATABASE)

try:
    # Add category if missing
    try:
        conn.execute("""
            ALTER TABLE feedback
            ADD COLUMN category TEXT DEFAULT 'General Feedback'
        """)
        print("SUCCESS: category column added!")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("OK: category column already exists.")
        else:
            print("Category error:", e)

    # Add rating if missing
    try:
        conn.execute("""
            ALTER TABLE feedback
            ADD COLUMN rating INTEGER DEFAULT 5
        """)
        print("SUCCESS: rating column added!")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("OK: rating column already exists.")
        else:
            print("Rating error:", e)

    conn.commit()

    print("\nDatabase update completed successfully!")

except Exception as e:
    conn.rollback()
    print("DATABASE ERROR:", e)

finally:
    conn.close()