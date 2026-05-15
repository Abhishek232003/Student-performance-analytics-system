from services.db import get_db_connection


def get_events(student_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id,title,description,event_date,event_time,event_type,important,status
        FROM calendar_events
        WHERE student_id = %s
        ORDER BY event_date,event_time
    """, (student_id,))

    events = cursor.fetchall()

    cursor.close()
    conn.close()

    return events


def create_event(student_id,title,description,event_date,event_time,event_type,important,created_by):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO calendar_events
        (student_id,title,description,event_date,event_time,event_type,important,status,created_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s,'pending',%s)
    """,(student_id,title,description,event_date,event_time,event_type,important,created_by))

    conn.commit()

    cursor.close()
    conn.close()

    