from flask import Flask, session
from flask import request
import random
import mysql.connector
import json

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
        selectquery = "SELECT UserID FROM users WHERE Username = %s"
        cursor.execute(selectquery, (username,))
        userid = cursor.fetchone()
        message = str(userid[0])
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
        query = "SELECT SetID FROM sets WHERE SubjectID = %s AND Name = %s"
        cursor.execute(query, (subjectid, name))
        message = cursor.fetchall()
        message = str(message[len(message)-1][0])
        query = "SELECT FlashcardID FROM flashcards"
        cursor.execute(query)
        allids = sorted(cursor.fetchall())
        nextcard = int(allids[len(allids)-1][0])+1
        message += "/"+str(nextcard)
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

    if learnt == "true":
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

@app.route('/getname/userid=<userid>/')
def getname(userid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT FirstName FROM users WHERE UserID = %s"
    cursor.execute(selectquery, (userid,))
    data = cursor.fetchone()
    name = data[0]
    return name

@app.route('/getsubjects/userid=<userid>/')
def getsubjects(userid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT * FROM subjects WHERE UserID = %s"
    cursor.execute(selectquery, (userid,))
    subject_list = cursor.fetchall()

    dict_list = []
    column_list = ["subjectid","userid","name","image","learnt","total"]

    for i in range(len(subject_list)):
        dict_list.append({})
        for j in range(len(column_list)):
            dict_list[i][column_list[j]] = subject_list[i][j]

    return str(dict_list).replace("'",'"')

@app.route('/getsets/subjectid=<subjectid>/')
def getsets(subjectid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT * FROM sets WHERE SubjectID = %s"
    cursor.execute(selectquery, (subjectid,))
    set_list = cursor.fetchall()

    dict_list = []
    column_list = ["setid","subjectid","name","learnt","total","examdate"]

    for i in range(len(set_list)):
        dict_list.append({})
        for j in range(len(column_list)):
            dict_list[i][column_list[j]] = str(set_list[i][j])

    return str(dict_list).replace("'",'"')

@app.route('/getflashcard/setid=<setid>/flashcardid=<flashcardid>')
def getflashcard(setid, flashcardid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT * FROM flashcards WHERE SetID = %s AND FlashcardID = %s"
    cursor.execute(selectquery, (setid, flashcardid))
    flashcarddetails = cursor.fetchone()
    if flashcarddetails:
        details_dict = createdict(flashcarddetails, ["flashcardid", "typeid", "setid", "front", "back", "grade", "learnt"])
        return json.dumps(details_dict)
    else:
        selectquery = "SELECT * FROM sets WHERE SetID = %s"
        cursor.execute(selectquery, (setid, ))
        setdetails = cursor.fetchone()
        if setdetails:
            addquery = ("INSERT INTO flashcards"
                        "(FlashcardID, TypeID, SetID, Front, Back, Grade, Learnt)"
                        "VALUES (%s, %s, %s, %s, %s, %s, %s)")
            cursor.execute(addquery, (flashcardid, 1, setid, '', '', "None", 0))
            cnx.commit()
            selectquery = "SELECT * FROM flashcards WHERE SetID = %s AND FlashcardID = %s"
            cursor.execute(selectquery, (setid, flashcardid))
            flashcarddetails = cursor.fetchone()
            details_dict = createdict(flashcarddetails, ["flashcardid", "typeid", "setid", "front", "back", "grade", "learnt"])
            return json.dumps(details_dict)

@app.route('/saveflashcard/setid=<setid>/flashcardid=<flashcardid>/typeid=<typeid>/front=<front>/back=<back>/grade=<grade>/learnt=<learnt>')
def saveflashcard(setid, flashcardid, typeid, front, back, grade, learnt):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("""
        UPDATE flashcards
        SET TypeID=%s, SetID=%s, Front=%s, Back=%s, Grade=%s, Learnt=%s
        WHERE FlashcardID=%s
        """)
    cursor.execute(query, (typeid, setid, front, back, grade, 0, flashcardid))
    cnx.commit()
    return "success"

def createdict(details_list, titles_list):
    mydict = {}
    for i in range (len(details_list)):
        mydict[titles_list[i]] = details_list[i]
    return mydict


@app.route('/getcardsetdetails/subjectid=<subjectid>/setid=<setid>/flashcardid=<flashcardid>')
def getcardsetdetails(subjectid, setid, flashcardid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    cardsetdetails = {}
    query = "SELECT Name FROM subjects WHERE SubjectID = %s"
    cursor.execute(query, (subjectid, ))
    cardsetdetails["subjectname"] = cursor.fetchone()[0]

    query = "SELECT Name FROM sets WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    cardsetdetails["setname"] = cursor.fetchone()[0]

    query = "SELECT FlashcardID FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    id_list = cursor.fetchall()
    id_list_formatted = []
    for unformatted_id in id_list:
        id_list_formatted.append(unformatted_id[0])

    cardsetdetails["flashcardidlist"] = id_list_formatted

    cardno = id_list_formatted.index(int(flashcardid))
    cardsetdetails["cardno"] = cardno+1
    if cardno == len(id_list_formatted)-1:
        query = "SELECT FlashcardID FROM flashcards"
        cursor.execute(query)
        existing_ids = sorted(cursor.fetchall())
        cardsetdetails["nextid"] = existing_ids[len(existing_ids)-1][0]+1
    else:
        cardsetdetails["nextid"] = id_list_formatted[cardno+1]
    if cardno == 0:
        cardsetdetails["previd"] = flashcardid
    else:
        cardsetdetails["previd"] = id_list_formatted[cardno-1]

    cardsetdetails["totalcards"] = len(id_list_formatted)


    return json.dumps(cardsetdetails)

@app.route('/getcardstolearn/setid=<setid>/shuffle=<shuffle>/unlearntonly=<unlearntonly>')
def getcardstolearn(setid,shuffle, unlearntonly):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT FlashcardID, Front, Back, Learnt, Grade FROM flashcards WHERE SetID = %s"
    if unlearntonly == "1":
        query += "AND Learnt = 0"
    cursor.execute(query, (setid, ))
    card_list = cursor.fetchall()
    dict_list = []
    for card in card_list:
        dict_list.append(createdict(card, ["flashcardid", "front", "back", "learnt", "grade"]))
    if shuffle == "1":
        random.shuffle(dict_list)
    return str(dict_list).replace("'",'"')

@app.route('/getlearntandtotal/setid=<setid>')
def getlearntandtotal(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT Learnt FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    status_list = cursor.fetchall()
    learnt = 0
    unlearnt = 0
    for status in status_list:
        if status[0] == 1:
            learnt += 1
        else:
            unlearnt += 1

    total = learnt+unlearnt

    query = ("""
        UPDATE sets
        SET LearntCards=%s, TotalCards=%s
        WHERE SetID=%s
        """)
    cursor.execute(query,(learnt, total, setid))
    cnx.commit()

    return json.dumps({"learnt":learnt, "total":total, "unlearnt":unlearnt})

@app.route('/getlearntandtotalsubject/subjectid=<subjectid>')
def getlearntandtotalsubject(subjectid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT SetID FROM sets WHERE SubjectID = %s"
    cursor.execute(query, (subjectid, ))
    set_list = cursor.fetchall()
    subjecttotal = 0
    subjectlearnt = 0
    for setid in set_list:
        setid = setid[0]
        query = "SELECT Learnt FROM flashcards WHERE SetID = %s"
        cursor.execute(query, (setid, ))
        status_list = cursor.fetchall()
        learnt = 0
        unlearnt = 0
        for status in status_list:
            if status[0] == 1:
                learnt += 1
            else:
                unlearnt += 1

        total = learnt+unlearnt

        subjecttotal += total
        subjectlearnt += learnt

        query = ("""
            UPDATE sets
            SET LearntCards=%s, TotalCards=%s
            WHERE SetID=%s
            """)
        cursor.execute(query,(learnt, total, setid))
        cnx.commit()

    query = ("""
        UPDATE subjects
        SET LearntCards=%s, TotalCards=%s
        WHERE SubjectID=%s
        """)
    cursor.execute(query,(subjectlearnt, subjecttotal, subjectid))
    cnx.commit()

    return json.dumps({"learnt":subjectlearnt, "total":subjecttotal})

@app.route('/getlearntandtotaluser/userid=<userid>')
def getlearntandtotaluser(userid):
        cnx = mysql.connector.connect(user="root", database="e-flashcards")
        cursor = cnx.cursor()
        query = "SELECT SubjectID FROM subjects WHERE UserID = %s"
        cursor.execute(query, (userid, ))
        subject_list = cursor.fetchall()
        usertotal = 0
        userlearnt = 0
        for subjectid in subject_list:
            subjectid = subjectid[0]

            query = "SELECT SetID FROM sets WHERE SubjectID = %s"
            cursor.execute(query, (subjectid, ))
            set_list = cursor.fetchall()
            subjecttotal = 0
            subjectlearnt = 0
            for setid in set_list:
                setid = setid[0]
                query = "SELECT Learnt FROM flashcards WHERE SetID = %s"
                cursor.execute(query, (setid, ))
                status_list = cursor.fetchall()
                learnt = 0
                unlearnt = 0
                for status in status_list:
                    if status[0] == 1:
                        learnt += 1
                    else:
                        unlearnt += 1

                total = learnt+unlearnt

                subjecttotal += total
                subjectlearnt += learnt

                query = ("""
                    UPDATE sets
                    SET LearntCards=%s, TotalCards=%s
                    WHERE SetID=%s
                    """)
                cursor.execute(query,(learnt, total, setid))
                cnx.commit()

            query = ("""
                UPDATE subjects
                SET LearntCards=%s, TotalCards=%s
                WHERE SubjectID=%s
                """)
            cursor.execute(query,(subjectlearnt, subjecttotal, subjectid))
            cnx.commit()
            usertotal += subjecttotal
            userlearnt += subjectlearnt

        return json.dumps({"learnt":userlearnt, "total":usertotal})

@app.route('/getsubjectdetails/subjectid=<subjectid>/')
def getgetsubjectdetails(subjectid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT * FROM subjects WHERE SubjectID = %s"
    cursor.execute(query, (subjectid, ))
    subjectdetails = cursor.fetchone()
    details_dict = createdict(subjectdetails, ["subjectid", "userid", "name", "image", "learnt", "total"])
    return json.dumps(details_dict)

@app.route('/getsetdetails/setid=<setid>/')
def getsetdetails(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT * FROM sets WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    setdetails = cursor.fetchone()
    details_dict = createdict(setdetails, ["setid", "subjectid", "name", "learnt", "total", "examdate"])
    details_dict["examdate"] = str(details_dict["examdate"])

    query = "SELECT * FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    cards = cursor.fetchall()
    dict_list = []
    for card in cards:
        dict_list.append(createdict(card, ["flashcardid", "typeid", "setid", "front", "back", "grade", "learnt"]))
    details_dict["cards"] =dict_list
    return json.dumps(details_dict)

@app.route('/getfirstcard/setid=<setid>/')
def getfirstcard(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT FlashcardID FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    cardid = cursor.fetchone()
    return str(cardid[0])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
