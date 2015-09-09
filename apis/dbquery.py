from flask import Flask, session
from flask import request
import mysql.connector

app = Flask(__name__)

@app.route("/createuser/firstname=<firstname>/lastname=<lastname>/dob=<dob>/"\
"emailaddress=<emailaddress>/username=<username>/password=<password>/")
def createuser(firstname, lastname, dob, emailaddress, username, password):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO users"
             "(FirstName, LastName, DoB, EmailAddress, Username, Password)"
             "VALUES (%s, %s, %s, %s, %s, %s)")
    user_data = (firstname, lastname, dob, emailaddress, username, password)
    try:
        cursor.execute(query, user_data)
        cnx.commit()
        message = "Success"
    except mysql.connector.errors.IntegrityError:
        message = "Username Taken"
    return message

@app.route("/createsubject/userid=<userid>/name=<name>/image=<image>/")
def createsubject(userid, name, image):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO subjects"
             "(UserID, Name, Image, LearntCards, TotalCards)"
             "VALUES (%s, %s, %s, %s, %s)")
    subject_data = (userid, name, image, 0, 0)
    try:
        cursor.execute(query, subject_data)
        cnx.commit()
        message = "Success"
    except mysql.connector.errors.IntegrityError:
        message = "Error"
    return message

@app.route("/createset/subjectid=<subjectid>/name=<name>/examdate=<examdate>/")
def createset(subjectid, name, examdate):
    ###################################
    #DATE MUST BE IN YYYY-MM-DD FORMAT#
    ###################################
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO sets"
             "(SubjectID, Name, LearntCards, TotalCards, ExamDate)"
             "VALUES (%s, %s, %s, %s, %s)")
    set_data = (subjectid, name, 0, 0, examdate)
    try:
        cursor.execute(query, set_data)
        cnx.commit()
        message = "Success"
    except mysql.connector.errors.IntegrityError:
        message = "Error"
    return message

@app.route("/createflaschcard/typeid=<typeid>/setid=<setid>/front=<front>/back=<back>/")
def createflashcard(typeid, setid, front, back):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO flashcards"
             "(TypeID, SetID, Front, Back, Learnt)"
             "VALUES (%s, %s, %s, %s, %s)")
    flashcard_data = (typeid, setid, front, back, 0)
    try:
        cursor.execute(query, flashcard_data)
        cnx.commit()
        message = "Success"
    except mysql.connector.errors.IntegrityError:
        message = "Error"

    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()

    selectquery = "SELECT SubjectID, TotalCards FROM sets WHERE SetID = %s"
    cursor.execute(selectquery, (setid,))
    data = cursor.fetchone()

    subjectid = data[0]
    totalcards_set = int(data[1]) + 1

    selectquery = "SELECT TotalCards FROM subjects WHERE SubjectID = %s"
    cursor.execute(selectquery, (subjectid,))
    data = cursor.fetchone()

    totalcards_subject = str(int(data[0]) + 1)

    query = ("""
        UPDATE sets
        SET TotalCards=%s
        WHERE SetID=%s
        """)

    cursor.execute(query,(totalcards_set, setid))
    cnx.commit()

    query = ("""
        UPDATE subjects
        SET TotalCards=%s
        WHERE SubjectID=%s
        """)


    cursor.execute(query,(totalcards_subject, subjectid))
    cnx.commit()

    return message

@app.route('/editflashcard/flashcardid=<flashcardid>/typeid=<typeid>/setid=<setid>/front=<front>/back=<back>/learnt=<learnt>/')
def editflashcard(flashcardid, typeid=None, setid=None, front=None, back=None, learnt=None):
    data_list = [typeid, setid, front, back, learnt]
    names_list = ["TypeID", "SetID", "Front", "Back", "Learnt"]
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()

    query = ("""
        UPDATE flashcards
        SET TypeID=%s, SetID=%s, Front=%s, Back=%s, Learnt=%s
        WHERE FlashcardID=%s
        """)

    for i in range(len(data_list)):
        if data_list[i] == "None":
            selectquery = "SELECT "+names_list[i]+" FROM flashcards WHERE FlashcardID = %s"
            cursor.execute(selectquery, (flashcardid,))
            data = cursor.fetchone()
            data_list[i] = str(data[0])

    data_list.append(flashcardid)
    flashcard_data = tuple(data_list)

    try:
        cursor.execute(query,flashcard_data)
        cnx.commit()
        message = "Success"
    except mysql.connector.errors.IntegrityError:
        message = "Error"
    return message

@app.route('/changelearnt/flashcardid=<flashcardid>/learnt=<learnt>/')
def changelearnt(flashcardid, learnt):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()

    if learnt == "True":
        learnt = True
        bool_val = "1"
    else:
        learnt = False
        bool_val = "0"

    query = ("""
        UPDATE flashcards
        SET Learnt=%s
        WHERE FlashcardID=%s
        """)

    cursor.execute(query,(bool_val, flashcardid))

    selectquery = "SELECT SetID FROM flashcards WHERE FlashcardID = %s"
    cursor.execute(selectquery, (flashcardid,))
    data = cursor.fetchone()
    setid = data[0]

    selectquery = "SELECT SubjectID, LearntCards FROM Sets WHERE SetID = %s"
    cursor.execute(selectquery, (setid,))
    data = cursor.fetchone()

    subjectid = data[0]

    if learnt:
        learntcards_set = str(int(data[1]) + 1)
    else:
        learntcards_set = str(int(data[1]) - 1)

    selectquery = "SELECT LearntCards FROM subjects WHERE SubjectID = %s"
    cursor.execute(selectquery, (subjectid,))
    data = cursor.fetchone()
    if learnt:
        learntcards_subject = str(int(data[0]) + 1)
    else:
        learntcards_subject  = str(int(data[0]) - 1)

    query = ("""
        UPDATE sets
        SET LearntCards=%s
        WHERE SetID=%s
        """)

    cursor.execute(query,(learntcards_set, setid))

    query = ("""
        UPDATE subjects
        SET LearntCards=%s
        WHERE SubjectID=%s
        """)

    cursor.execute(query,(learntcards_subject, subjectid))
    cnx.commit()
    return "Success"


if __name__ == "__main__":
    app.run(debug=True, port=5000)
