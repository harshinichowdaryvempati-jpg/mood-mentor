from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import hashlib
from datetime import datetime

from dotenv import load_dotenv
from google import genai


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ENV_FILE = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_FILE)


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

DATABASE = os.path.join(
    BASE_DIR,
    "mood_mentor.db"
)


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

gemini_client = None


if GEMINI_API_KEY:

    try:

        gemini_client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        print(
            "Gemini AI initialized successfully."
        )

    except Exception as e:

        print(
            "Gemini initialization error:",
            e
        )

        gemini_client = None

else:

    print(
        "WARNING: GEMINI_API_KEY not found."
    )


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db():

    conn = sqlite3.connect(
        DATABASE
    )

    conn.row_factory = sqlite3.Row

    return conn


# ============================================================
# DATABASE MIGRATION HELPER
# ============================================================

def add_column_if_missing(
    conn,
    table_name,
    column_name,
    column_type
):

    cursor = conn.execute(
        f"PRAGMA table_info({table_name})"
    )

    columns = [
        row["name"]
        for row in cursor.fetchall()
    ]

    if column_name not in columns:

        conn.execute(
            f"""
            ALTER TABLE {table_name}
            ADD COLUMN {column_name}
            {column_type}
            """
        )

        print(
            f"Added missing column: {table_name}.{column_name}"
        )


# ============================================================
# INITIALIZE DATABASE
# ============================================================

def init_database():

    conn = get_db()


    # ========================================================
    # EMPLOYEES
    # ========================================================

    conn.execute("""
        CREATE TABLE IF NOT EXISTS employees (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id TEXT UNIQUE NOT NULL,

            full_name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            department TEXT,

            password TEXT NOT NULL,

            created_at TEXT

        )
    """)


    # ========================================================
    # FEEDBACK
    # ========================================================

    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id TEXT NOT NULL,

            category TEXT
                DEFAULT 'General Feedback',

            rating INTEGER
                DEFAULT 5,

            feedback_text TEXT
                DEFAULT '',

            text TEXT
                DEFAULT '',

            created_at TEXT

        )
    """)


    # ========================================================
    # MOOD CHECK-INS
    # ========================================================

    conn.execute("""
        CREATE TABLE IF NOT EXISTS mood_checkins (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id TEXT NOT NULL,

            mood TEXT NOT NULL,

            score INTEGER
                DEFAULT 0,

            journal TEXT
                DEFAULT '',

            created_at TEXT

        )
    """)


    # ========================================================
    # WELLNESS ACTIVITIES
    # ========================================================

    conn.execute("""
        CREATE TABLE IF NOT EXISTS wellness_activities (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id TEXT NOT NULL,

            activity TEXT NOT NULL,

            points INTEGER
                DEFAULT 0,

            duration INTEGER
                DEFAULT 0,

            created_at TEXT

        )
    """)


    # ========================================================
    # FEEDBACK MIGRATIONS
    # ========================================================

    add_column_if_missing(
        conn,
        "feedback",
        "category",
        "TEXT DEFAULT 'General Feedback'"
    )

    add_column_if_missing(
        conn,
        "feedback",
        "rating",
        "INTEGER DEFAULT 5"
    )

    add_column_if_missing(
        conn,
        "feedback",
        "feedback_text",
        "TEXT DEFAULT ''"
    )

    add_column_if_missing(
        conn,
        "feedback",
        "text",
        "TEXT DEFAULT ''"
    )


    # ========================================================
    # MOOD CHECK-IN MIGRATIONS
    # ========================================================

    add_column_if_missing(
        conn,
        "mood_checkins",
        "score",
        "INTEGER DEFAULT 0"
    )

    add_column_if_missing(
        conn,
        "mood_checkins",
        "journal",
        "TEXT DEFAULT ''"
    )


    # ========================================================
    # WELLNESS ACTIVITY MIGRATIONS
    # ========================================================

    add_column_if_missing(
        conn,
        "wellness_activities",
        "points",
        "INTEGER DEFAULT 0"
    )

    add_column_if_missing(
        conn,
        "wellness_activities",
        "duration",
        "INTEGER DEFAULT 0"
    )


    # ========================================================
    # MIGRATE OLD FEEDBACK
    # ========================================================

    try:

        conn.execute("""
            UPDATE feedback

            SET feedback_text = text

            WHERE
            (
                feedback_text IS NULL
                OR feedback_text = ''
            )

            AND text IS NOT NULL

            AND text != ''
        """)

    except Exception as e:

        print(
            "Feedback migration warning:",
            e
        )


    conn.commit()

    conn.close()


    print(
        "Database initialized successfully."
    )

    print(
        "Database:",
        DATABASE
    )


# ============================================================
# PASSWORD HASHING
# ============================================================

def hash_password(password):

    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    database_ok = False

    try:

        conn = get_db()

        conn.execute(
            "SELECT 1"
        )

        conn.close()

        database_ok = True

    except Exception as e:

        print(
            "Database health error:",
            e
        )


    return jsonify({

        "success": True,

        "database":
            database_ok,

        "gemini":
            gemini_client is not None,

        "message":
            "Mood Mentor backend is running."

    })


# ============================================================
# ROOT
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "success": True,

        "message":
            "Mood Mentor backend is running."

    })


# ============================================================
# REGISTER
# ============================================================

@app.route(
    "/api/register",
    methods=["POST"]
)
def register():

    try:

        data = request.get_json() or {}


        employee_id = str(
            data.get(
                "employeeId",
                ""
            )
        ).strip()


        full_name = str(
            data.get(
                "fullName",
                ""
            )
        ).strip()


        email = str(
            data.get(
                "email",
                ""
            )
        ).strip()


        department = str(
            data.get(
                "department",
                ""
            )
        ).strip()


        password = str(
            data.get(
                "password",
                ""
            )
        )


        if not employee_id:

            return jsonify({

                "success": False,

                "message":
                    "Employee ID is required."

            }), 400


        if not full_name:

            return jsonify({

                "success": False,

                "message":
                    "Full name is required."

            }), 400


        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Email is required."

            }), 400


        if not password:

            return jsonify({

                "success": False,

                "message":
                    "Password is required."

            }), 400


        password_hash = hash_password(
            password
        )


        conn = get_db()


        conn.execute("""
            INSERT INTO employees (

                employee_id,

                full_name,

                email,

                department,

                password,

                created_at

            )

            VALUES (?, ?, ?, ?, ?, ?)

        """, (

            employee_id,

            full_name,

            email,

            department,

            password_hash,

            datetime.now().isoformat()

        ))


        conn.commit()

        conn.close()


        return jsonify({

            "success": True,

            "message":
                "Account created successfully."

        }), 201


    except sqlite3.IntegrityError as e:

        error_message = str(e).lower()


        if "employee_id" in error_message:

            message = (
                "Employee ID already exists."
            )

        elif "email" in error_message:

            message = (
                "Email already exists."
            )

        else:

            message = (
                "Account already exists."
            )


        return jsonify({

            "success": False,

            "message":
                message

        }), 409


    except Exception as e:

        print(
            "Register error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to create account."

        }), 500


# ============================================================
# LOGIN
# ============================================================

@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    try:

        data = request.get_json() or {}


        employee_id = str(
            data.get(
                "employeeId",
                ""
            )
        ).strip()


        password = str(
            data.get(
                "password",
                ""
            )
        )


        if (
            not employee_id
            or not password
        ):

            return jsonify({

                "success": False,

                "message":
                    "Employee ID and password are required."

            }), 400


        password_hash = hash_password(
            password
        )


        conn = get_db()


        employee = conn.execute("""
            SELECT

                employee_id,

                full_name,

                email,

                department

            FROM employees

            WHERE employee_id = ?

            AND password = ?

        """, (

            employee_id,

            password_hash

        )).fetchone()


        conn.close()


        if not employee:

            return jsonify({

                "success": False,

                "message":
                    "Invalid Employee ID or password."

            }), 401


        return jsonify({

            "success": True,

            "message":
                "Login successful.",

            "employee":
                dict(employee)

        })


    except Exception as e:

        print(
            "Login error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to login."

        }), 500


# ============================================================
# GET EMPLOYEE
# ============================================================

@app.route(
    "/api/employee/<employee_id>",
    methods=["GET"]
)
def get_employee(employee_id):

    try:

        conn = get_db()


        employee = conn.execute("""
            SELECT

                employee_id,

                full_name,

                email,

                department,

                created_at

            FROM employees

            WHERE employee_id = ?

        """, (

            employee_id

        )).fetchone()


        conn.close()


        if not employee:

            return jsonify({

                "success": False,

                "message":
                    "Employee not found."

            }), 404


        return jsonify({

            "success": True,

            "employee":
                dict(employee)

        })


    except Exception as e:

        print(
            "Employee error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to fetch employee."

        }), 500


# ============================================================
# SUBMIT FEEDBACK
# ============================================================

@app.route(
    "/api/feedback",
    methods=["POST"]
)
def submit_feedback():

    try:

        data = request.get_json() or {}


        employee_id = str(
            data.get(
                "employeeId",
                ""
            )
        ).strip()


        category = str(
            data.get(
                "category",
                "General Feedback"
            )
        ).strip()


        rating = data.get(
            "rating",
            5
        )


        feedback_text = str(
            data.get(
                "feedback",
                ""
            )
        ).strip()


        if not employee_id:

            return jsonify({

                "success": False,

                "message":
                    "Employee ID is required."

            }), 400


        if not feedback_text:

            return jsonify({

                "success": False,

                "message":
                    "Feedback is required."

            }), 400


        try:

            rating = int(
                rating
            )

        except:

            rating = 5


        rating = max(
            1,
            min(5, rating)
        )


        conn = get_db()


        conn.execute("""
            INSERT INTO feedback (

                employee_id,

                category,

                rating,

                feedback_text,

                text,

                created_at

            )

            VALUES (?, ?, ?, ?, ?, ?)

        """, (

            employee_id,

            category,

            rating,

            feedback_text,

            feedback_text,

            datetime.now().isoformat()

        ))


        conn.commit()

        conn.close()


        return jsonify({

            "success": True,

            "message":
                "Feedback submitted successfully."

        }), 201


    except Exception as e:

        print(
            "Feedback POST error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to submit feedback."

        }), 500


# ============================================================
# GET FEEDBACK
# ============================================================

@app.route(
    "/api/feedback/<employee_id>",
    methods=["GET"]
)
def get_feedback(employee_id):

    try:

        conn = get_db()


        rows = conn.execute("""
            SELECT

                id,

                employee_id,

                category,

                rating,

                feedback_text,

                text,

                created_at

            FROM feedback

            WHERE employee_id = ?

            ORDER BY id DESC

        """, (

            employee_id

        )).fetchall()


        conn.close()


        feedback_list = []


        for row in rows:

            item = dict(row)


            text_value = (

                item.get(
                    "feedback_text"
                )

                or

                item.get(
                    "text"
                )

                or ""

            )


            item["feedback"] = (
                text_value
            )


            feedback_list.append(
                item
            )


        return jsonify({

            "success": True,

            "feedback":
                feedback_list

        })


    except Exception as e:

        print(
            "Feedback GET error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to fetch feedback."

        }), 500


# ============================================================
# SAVE MOOD
# ============================================================

@app.route(
    "/api/mood",
    methods=["POST"]
)
def save_mood():

    try:

        data = request.get_json() or {}


        employee_id = str(
            data.get(
                "employeeId",
                ""
            )
        ).strip()


        mood = str(
            data.get(
                "mood",
                ""
            )
        ).strip()


        score = data.get(
            "score",
            0
        )


        journal = str(
            data.get(
                "journal",
                ""
            )
        ).strip()


        if not employee_id:

            return jsonify({

                "success": False,

                "message":
                    "Employee ID is required."

            }), 400


        if not mood:

            return jsonify({

                "success": False,

                "message":
                    "Mood is required."

            }), 400


        try:

            score = int(
                score
            )

        except:

            score = 0


        conn = get_db()


        conn.execute("""
            INSERT INTO mood_checkins (

                employee_id,

                mood,

                score,

                journal,

                created_at

            )

            VALUES (?, ?, ?, ?, ?)

        """, (

            employee_id,

            mood,

            score,

            journal,

            datetime.now().isoformat()

        ))


        conn.commit()

        conn.close()


        return jsonify({

            "success": True,

            "message":
                "Mood saved successfully."

        }), 201


    except Exception as e:

        print(
            "Mood POST error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to save mood."

        }), 500


# ============================================================
# GET MOOD HISTORY
# ============================================================

@app.route(
    "/api/mood/<employee_id>",
    methods=["GET"]
)
def get_mood(employee_id):

    try:

        conn = get_db()


        rows = conn.execute("""
            SELECT

                id,

                employee_id,

                mood,

                score,

                journal,

                created_at

            FROM mood_checkins

            WHERE employee_id = ?

            ORDER BY id DESC

        """, (

            employee_id

        )).fetchall()


        conn.close()


        return jsonify({

            "success": True,

            "moods":
                [
                    dict(row)
                    for row in rows
                ]

        })


    except Exception as e:

        print(
            "Mood GET error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to fetch mood history."

        }), 500


# ============================================================
# SAVE WELLNESS ACTIVITY
# ============================================================

@app.route(
    "/api/activity",
    methods=["POST"]
)
def save_activity():

    try:

        data = request.get_json() or {}


        employee_id = str(
            data.get(
                "employeeId",
                ""
            )
        ).strip()


        activity = str(
            data.get(
                "activity",
                ""
            )
        ).strip()


        points = data.get(
            "points",
            0
        )


        duration = data.get(
            "duration",
            0
        )


        if not employee_id:

            return jsonify({

                "success": False,

                "message":
                    "Employee ID is required."

            }), 400


        if not activity:

            return jsonify({

                "success": False,

                "message":
                    "Activity is required."

            }), 400


        try:

            points = int(
                points
            )

        except:

            points = 0


        try:

            duration = int(
                duration
            )

        except:

            duration = 0


        conn = get_db()


        conn.execute("""
            INSERT INTO wellness_activities (

                employee_id,

                activity,

                points,

                duration,

                created_at

            )

            VALUES (?, ?, ?, ?, ?)

        """, (

            employee_id,

            activity,

            points,

            duration,

            datetime.now().isoformat()

        ))


        conn.commit()

        conn.close()


        return jsonify({

            "success": True,

            "message":
                "Activity saved successfully."

        }), 201


    except Exception as e:

        print(
            "Activity POST error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to save activity."

        }), 500


# ============================================================
# GET WELLNESS ACTIVITIES
# ============================================================

@app.route(
    "/api/activity/<employee_id>",
    methods=["GET"]
)
def get_activities(employee_id):

    try:

        conn = get_db()


        rows = conn.execute("""
            SELECT

                id,

                employee_id,

                activity,

                points,

                duration,

                created_at

            FROM wellness_activities

            WHERE employee_id = ?

            ORDER BY id DESC

        """, (

            employee_id

        )).fetchall()


        conn.close()


        return jsonify({

            "success": True,

            "activities":
                [
                    dict(row)
                    for row in rows
                ]

        })


    except Exception as e:

        print(
            "Activity GET error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to fetch activities."

        }), 500


# ============================================================
# MOOD MENTOR AI CHATBOT
# ============================================================

@app.route(
    "/api/chat",
    methods=["POST"]
)
def chat():

    try:

        data = request.get_json() or {}


        # ====================================================
        # CURRENT MESSAGE
        # ====================================================

        message = str(
            data.get(
                "message",
                ""
            )
        ).strip()


        if not message:

            return jsonify({

                "success": False,

                "message":
                    "Message is required."

            }), 400


        # ====================================================
        # GEMINI CHECK
        # ====================================================

        if not gemini_client:

            return jsonify({

                "success": False,

                "message":
                    "AI service is not configured."

            }), 503


        # ====================================================
        # EMPLOYEE CONTEXT
        # ====================================================

        employee = (
            data.get("employee")
            or {}
        )


        employee_name = str(
            employee.get(
                "name",
                "Employee"
            )
        ).strip()


        department = str(
            employee.get(
                "department",
                "Not specified"
            )
        ).strip()


        # ====================================================
        # LATEST MOOD
        # ====================================================

        mood_data = (
            data.get("mood")
            or {}
        )


        latest_mood = str(
            mood_data.get(
                "mood",
                "Not available"
            )
        ).strip()


        mood_score = mood_data.get(
            "score",
            "Not available"
        )


        # ====================================================
        # RECENT WELLNESS ACTIVITIES
        # ====================================================

        activities = (
            data.get("activities")
            or []
        )


        recent_activities = []


        if isinstance(
            activities,
            list
        ):

            for activity in activities[:5]:

                if isinstance(
                    activity,
                    dict
                ):

                    activity_name = (
                        activity.get(
                            "activity",
                            "Wellness activity"
                        )
                    )


                    if activity_name:

                        recent_activities.append(
                            str(activity_name)
                        )

                else:

                    recent_activities.append(
                        str(activity)
                    )


        if recent_activities:

            activity_text = (
                ", ".join(
                    recent_activities
                )
            )

        else:

            activity_text = (
                "No recent wellness activities."
            )


        # ====================================================
        # RECENT CONVERSATION
        # ====================================================

        conversation = (
            data.get(
                "conversation",
                []
            )
        )


        conversation_text = ""


        if isinstance(
            conversation,
            list
        ):

            recent_messages = (
                conversation[-8:]
            )


            for item in recent_messages:

                if not isinstance(
                    item,
                    dict
                ):

                    continue


                role = str(
                    item.get(
                        "role",
                        "user"
                    )
                ).lower()


                text = str(
                    item.get(
                        "text",
                        ""
                    )
                ).strip()


                if not text:

                    continue


                if role == "user":

                    speaker = (
                        "Employee"
                    )

                else:

                    speaker = (
                        "Mood Mentor"
                    )


                conversation_text += (
                    f"{speaker}: {text}\n"
                )


        if not conversation_text:

            conversation_text = (
                "No previous conversation."
            )


        # ====================================================
        # MOOD-SPECIFIC GUIDANCE
        # ====================================================

        mood_guidance = """

Use the current mood as a soft signal rather than a diagnosis.

If the mood is Stressed:
- prioritize short calming exercises
- breathing
- grounding
- reducing immediate pressure
- one small next step

If the mood is Low:
- use gentle supportive language
- suggest a small uplifting action
- encourage connection, movement, or a positive routine

If the mood is Okay:
- focus on maintaining balance
- productivity
- focus
- healthy routines

If the mood is Good:
- encourage positive habits
- sustainable work-life balance
- maintaining momentum

If the mood is Great:
- reinforce positive wellbeing
- suggest ways to maintain the positive state

Do not mention these rules to the employee.
"""


        # ====================================================
        # SYSTEM PROMPT
        # ====================================================

        system_prompt = f"""
You are Mood Mentor, an AI-powered workplace wellness
assistant.

You provide practical, friendly and personalized support
for employee wellbeing.

You can help with:

- workplace stress
- emotional wellbeing
- mindfulness
- breathing exercises
- relaxation
- work-life balance
- focus
- productivity habits
- motivation
- healthy workplace habits
- sleep and wind-down routines
- short wellness activities
- coping with busy workdays
- positive workplace routines

PERSONALIZATION:

1. Use the employee's context only when it genuinely
   improves the answer.

2. Consider the latest mood.

3. Consider recent wellness activities.

4. Use recent conversation messages to understand
   follow-up questions.

5. Do not repeatedly use the employee's name.

6. Do not mention the employee's department unless
   it is genuinely relevant.

7. Never assume a diagnosis or mental health condition.

8. Never reveal employee IDs or private information.

9. Never tell the employee that you have access to
   private records or internal data.

RESPONSE STYLE:

- Sound like a thoughtful human wellness coach.
- Be warm but professional.
- Answer the current question first.
- Keep the response concise.
- Usually use 50-100 words.
- Use short paragraphs or numbered steps when useful.
- Give practical actions that can be done immediately.
- Avoid repetitive wording.
- Avoid using the same suggestion repeatedly unless
  it is clearly useful.
- Do not always recommend an activity.
- Do not always end with a question.
- Do not always say "How does that sound?"
- Vary your closing naturally.

IMPORTANT CONVERSATION RULE:

If the employee asks a follow-up question, answer it
using the conversation context.

For example, if the employee says:
"I'm feeling stressed today."

and then asks:
"What should I do right now?"

give a direct immediate action plan rather than repeating
the previous response word-for-word.

MOOD GUIDANCE:

{mood_guidance}

SAFETY:

- Do not diagnose medical conditions.
- Do not prescribe medication.
- Do not provide medical treatment.
- Do not claim to replace a doctor, therapist or
  healthcare professional.
- Do not make unsupported medical claims.

If the employee describes immediate danger or possible
self-harm, encourage them to contact local emergency
services or a trusted person immediately.

PRIVACY:

Do not expose internal employee information.
Do not reveal employee IDs.
Do not unnecessarily mention the employee's name,
department, mood score or activity history.

Your job is to make the employee feel supported,
not monitored.
"""


        # ====================================================
        # FINAL PROMPT
        # ====================================================

        prompt = f"""
{system_prompt}


EMPLOYEE CONTEXT
================

Employee name:
{employee_name}

Department:
{department}


LATEST WELLNESS CHECK-IN
========================

Current mood:
{latest_mood}

Mood score:
{mood_score}


RECENT WELLNESS ACTIVITIES
==========================

{activity_text}


RECENT CONVERSATION
===================

{conversation_text}


CURRENT EMPLOYEE MESSAGE
========================

{message}


TASK
====

Respond naturally to the employee's current message.

Use the context only when it improves the answer.

Do not mention the internal context unless necessary.

Do not repeat previous advice unnecessarily.

Give the most useful next response.
"""


        # ====================================================
        # GEMINI REQUEST
        # ====================================================

        response = (
            gemini_client
            .models
            .generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt
            )
        )


        answer = getattr(
            response,
            "text",
            None
        )


        if not answer:

            return jsonify({

                "success": False,

                "message":
                    "AI did not return a response."

            }), 500


        return jsonify({

            "success": True,

            "response":
                answer.strip()

        })


    except Exception as e:

        print(
            "Chatbot error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to connect to the wellness assistant right now."

        }), 503


# ============================================================
# CHAT SERVICE STATUS
# ============================================================

@app.route(
    "/api/chat",
    methods=["GET"]
)
def chat_status():

    return jsonify({

        "success": True,

        "service":
            "Mood Mentor AI",

        "gemini":
            gemini_client is not None,

        "message":
            "Chatbot service is available."

    })


# ============================================================
# 404 HANDLER
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({

        "success": False,

        "message":
            "Endpoint not found."

    }), 404


# ============================================================
# 405 HANDLER
# ============================================================

@app.errorhandler(405)
def method_not_allowed(error):

    return jsonify({

        "success": False,

        "message":
            "Method not allowed."

    }), 405


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    init_database()


    print("")

    print("==============================================")

    print(
        "          MOOD MENTOR BACKEND"
    )

    print("==============================================")

    print(
        "Server: http://127.0.0.1:5000"
    )

    print(
        "Health: http://127.0.0.1:5000/api/health"
    )

    print(
        "Chat:   http://127.0.0.1:5000/api/chat"
    )

    print("==============================================")

    print("")


    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True,

        threaded=True

    )