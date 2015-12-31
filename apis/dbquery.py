from flask import Flask, session
from flask import request
import random
import mysql.connector
import json
import requests

app = Flask(__name__)

#create dictionary function to convert 2 corresponging lists, one of keys and one of their contents to a dictionary object:
#input:
#["key1", "key2", "key3"],["data1","data2","data3"]
#output:
#{"key1":"data1", "key2":"data2", "key3":"data3"}
def createdict(details_list, titles_list):
    mydict = {}
    for i in range (len(details_list)):
        mydict[titles_list[i]] = details_list[i]
    return mydict

#API to check sign in details are correct, if so it returns the user's ID, if not it returns "Incorrect Password" or "Unknown User"
@app.route("/signin/username=<username>/password=<password>/")
def signin(username, password):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT UserID, Password FROM users WHERE Username = %s"
    cursor.execute(query, (username,))
    userdetails = cursor.fetchone()
    #check if user not found
    if userdetails == None:
        return "Unknown User"
    else:
        #extract data from tuple in format (userid, password)
        userid = userdetails[0]
        correct_password = userdetails[1]
        #check if password is correct
        if password == correct_password:
            return str(userid)
        else:
            return "Incorrect Password"

#API to create user in database - returns ID of new user once created or "Username Taken"
@app.route("/createuser/firstname=<firstname>/lastname=<lastname>/dob=<dob>/"\
"emailaddress=<emailaddress>/username=<username>/password=<password>/")
def createuser(firstname, lastname, dob, emailaddress, username, password):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO users"
             "(FirstName, LastName, DoB, EmailAddress, Username, Password)"
             "VALUES (%s, %s, %s, %s, %s, %s)")
    user_data = (firstname, lastname, dob, emailaddress, username, password)
    #IntegrityError will occur if username taken
    try:
        cursor.execute(query, user_data)
        cnx.commit()
        selectquery = "SELECT UserID FROM users WHERE Username = %s"
        cursor.execute(selectquery, (username,))
        userid = cursor.fetchone()
        #convert from tuple to string
        message = str(userid[0])
    except mysql.connector.errors.IntegrityError:
        message = "Username Taken"
    return message

#API to create a new subject - returns either Success or Error
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
    except:
        message = "Error"
    return message

#set creation API - retuns Error or route of set id and id of first flashcard
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
    except:
        message = "Error"
    return message

#flashcard creation API
@app.route("/createflaschcard/typeid=<typeid>/setid=<setid>/front=<front>/back=<back>/")
def createflashcard(typeid, setid, front, back):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    #insert card into flashcard table
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

    #update other tables accordinfly
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

#edit flashcard API
@app.route('/editflashcard/flashcardid=<flashcardid>/typeid=<typeid>/setid=<setid>/front=<front>/back=<back>/learnt=<learnt>/')
def editflashcard(flashcardid, typeid, setid, front, back, learnt):
    data_list = [typeid, setid, front, back, learnt]
    names_list = ["TypeID", "SetID", "Front", "Back", "Learnt"]
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()

    #update flashcard table
    query = ("""
        UPDATE flashcards
        SET TypeID=%s, SetID=%s, Front=%s, Back=%s, Learnt=%s
        WHERE FlashcardID=%s
        """)

    #check if any of the fields have not been provided, if so get their current values and replace the "None"
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
    except:
        message = "Error"
    return message

#API to change the learnt boolean of a card
@app.route('/changelearnt/flashcardid=<flashcardid>/learnt=<learnt>/')
def changelearnt(flashcardid, learnt):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()

    #convert between js boolean (true/false), python boolean (True/False), and sql boolean (1/0)
    if learnt == "true":
        learnt = True
        bool_val = "1"
    else:
        learnt = False
        bool_val = "0"

    #update table
    query = ("""
        UPDATE flashcards
        SET Learnt=%s
        WHERE FlashcardID=%s
        """)

    cursor.execute(query,(bool_val, flashcardid))

    #update other tables accordingly
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

#API to get thre users first name
@app.route('/getname/userid=<userid>/')
def getname(userid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT FirstName FROM users WHERE UserID = %s"
    cursor.execute(selectquery, (userid,))
    data = cursor.fetchone()
    #extract string from tuple
    name = data[0]
    return name

#API to get the subjects belonging to a particular user
@app.route('/getsubjects/userid=<userid>/')
def getsubjects(userid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT * FROM subjects WHERE UserID = %s"
    cursor.execute(selectquery, (userid,))
    subject_list = cursor.fetchall()

    #create dictionaries containing subject details and add them to a list
    dict_list = []
    column_list = ["subjectid","userid","name","image","learnt","total"]

    for i in range(len(subject_list)):
        dict_list.append({})
        for j in range(len(column_list)):
            dict_list[i][column_list[j]] = subject_list[i][j]

    return str(dict_list).replace("'",'"')

#API to get the sets belonging to a particular subject
@app.route('/getsets/subjectid=<subjectid>/')
def getsets(subjectid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    #get list of set IDs in subject
    selectquery = "SELECT setid FROM sets WHERE SubjectID = %s"
    cursor.execute(selectquery, (subjectid,))
    setid_list = cursor.fetchall()
    set_list = []
    for setid in setid_list:
        #user getsetdetails function to obtain the set details of each set
        setdetails = json.loads(getsetdetails(setid[0]))
        #delete the cards item in the object as this is not required for the subject page
        del setdetails["cards"]
        set_list.append(setdetails)

    return json.dumps(set_list)

#API to get flashcard data
@app.route('/getflashcard/setid=<setid>/flashcardid=<flashcardid>')
def getflashcard(setid, flashcardid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    selectquery = "SELECT * FROM flashcards WHERE SetID = %s AND FlashcardID = %s"
    cursor.execute(selectquery, (setid, flashcardid))
    flashcarddetails = cursor.fetchone()
    #if flashcard exitsts
    if flashcarddetails:
        #call create dictionary to convert 2 corresponding lists, one of keys and one of contents to a dictionary object
        details_dict = createdict(flashcarddetails, ["flashcardid", "typeid", "setid", "front", "back", "grade", "learnt"])
        return json.dumps(details_dict)
    #if flashcard doesn't exist
    else:
        #check set exists
        selectquery = "SELECT * FROM sets WHERE SetID = %s"
        cursor.execute(selectquery, (setid, ))
        setdetails = cursor.fetchone()
        if setdetails:
            #create blank flashcard
            addquery = ("INSERT INTO flashcards"
                        "(FlashcardID, TypeID, SetID, Front, Back, Grade, Learnt)"
                        "VALUES (%s, %s, %s, %s, %s, %s, %s)")
            cursor.execute(addquery, (flashcardid, 1, setid, '', '', "None", 0))
            cnx.commit()
            #retrieve data in correct format
            selectquery = "SELECT * FROM flashcards WHERE SetID = %s AND FlashcardID = %s"
            cursor.execute(selectquery, (setid, flashcardid))
            flashcarddetails = cursor.fetchone()
            details_dict = createdict(flashcarddetails, ["flashcardid", "typeid", "setid", "front", "back", "grade", "learnt"])
            return json.dumps(details_dict)
        else:
            return "Set doesnt exist"

#save flashcard API
@app.route('/saveflashcard/setid=<setid>/flashcardid=<flashcardid>/typeid=<typeid>/front=<front>/back=<back>/grade=<grade>/learnt=<learnt>')
def saveflashcard(setid, flashcardid, typeid, front, back, grade, learnt):

    front = front.replace("*slash*","/").replace("*qm*","?")
    back = back.replace("*slash*","/").replace("*qm*","?")

    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    #update flashcards table
    query = ("""
        UPDATE flashcards
        SET TypeID=%s, SetID=%s, Front=%s, Back=%s, Grade=%s, Learnt=%s
        WHERE FlashcardID=%s
        """)
    cursor.execute(query, (typeid, setid, front, back, grade, 0, flashcardid))
    cnx.commit()
    return "success"

#API to get data about a card in relation to the set it is in
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

    #get all flashcard IDs of a particular set
    query = "SELECT FlashcardID FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    id_list = cursor.fetchall()
    id_list_formatted = []
    for unformatted_id in id_list:
        id_list_formatted.append(unformatted_id[0])

    cardsetdetails["flashcardidlist"] = id_list_formatted

    #work out ID of next flashcard
    cardno = id_list_formatted.index(int(flashcardid))
    cardsetdetails["cardno"] = cardno+1
    #check if last card
    if cardno == len(id_list_formatted)-1:
        #if so next id is the next available ID
        query = "SELECT FlashcardID FROM flashcards"
        cursor.execute(query)
        existing_ids = sorted(cursor.fetchall())
        cardsetdetails["nextid"] = existing_ids[len(existing_ids)-1][0]+1
    else:
        #if not it is the next ID in the list
        cardsetdetails["nextid"] = id_list_formatted[cardno+1]

    #work out ID of previous flashcard
    if cardno == 0:
        cardsetdetails["previd"] = flashcardid
    else:
        cardsetdetails["previd"] = id_list_formatted[cardno-1]

    cardsetdetails["totalcards"] = len(id_list_formatted)


    return json.dumps(cardsetdetails)

#API to be used to get the cards in the correct format to be used
@app.route('/getcardstolearn/setid=<setid>/shuffle=<shuffle>/unlearntonly=<unlearntonly>')
def getcardstolearn(setid,shuffle, unlearntonly):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT FlashcardID, Front, Back, Learnt, Grade FROM flashcards WHERE SetID = %s"
    #if unlearnt only, add this to query
    if unlearntonly == "1":
        query += "AND Learnt = 0"
    cursor.execute(query, (setid, ))
    card_list = cursor.fetchall()
    dict_list = []
    #create list of dictionaries
    for card in card_list:
        dict_list.append(createdict(card, ["flashcardid", "front", "back", "learnt", "grade"]))
    #shuffle id required
    if shuffle == "1":
        random.shuffle(dict_list)
    return json.dumps(dict_list)

#API to get the total number of cards and number of learnt cards in a set
@app.route('/getlearntandtotal/setid=<setid>')
def getlearntandtotal(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    #select learnt boolean of all cards in set
    query = "SELECT Learnt FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    status_list = cursor.fetchall()
    learnt = 0
    unlearnt = 0
    #work out how many are learnt/not learnt
    for status in status_list:
        if status[0] == 1:
            learnt += 1
        else:
            unlearnt += 1

    total = learnt+unlearnt

    #update sets table
    query = ("""
        UPDATE sets
        SET LearntCards=%s, TotalCards=%s
        WHERE SetID=%s
        """)
    cursor.execute(query,(learnt, total, setid))
    cnx.commit()
    #return data
    return json.dumps({"learnt":learnt, "total":total, "unlearnt":unlearnt})

#get learnt and total for a particular user and update tables accordingly
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

#get the details of a subject
@app.route('/getsubjectdetails/subjectid=<subjectid>/')
def getgetsubjectdetails(subjectid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT * FROM subjects WHERE SubjectID = %s"
    cursor.execute(query, (subjectid, ))
    subjectdetails = cursor.fetchone()
    details_dict = createdict(subjectdetails, ["subjectid", "userid", "name", "image", "learnt", "total"])
    return json.dumps(details_dict)

#get the details of a set
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
    details_dict["cards"] = dict_list

    cards_list = details_dict["cards"]

    grade_list = ["G","F","E","D","C","B","A","A*"]

    progressdict = {"totalcards" : {}, "learntcards" : {}}

    for grade in grade_list:
        progressdict["totalcards"][grade] = 0
        progressdict["learntcards"][grade] = 0



    for card in cards_list:
        if card["grade"] != "None" and card["grade"] != "":
            progressdict["totalcards"][card["grade"]] += 1
            if card["learnt"] == 1 or card["learnt"] ==  True:
                progressdict["learntcards"][card["grade"]] += 1

    url = "http://localhost:5002/calculategrade/gradesdict="+json.dumps(progressdict)

    predicted_grade = requests.get(url)
    details_dict["predicted_grade"] = str(predicted_grade.content).replace("b","").replace("'","")

    return json.dumps(details_dict)

#get the flashcard ID of the first card in a set
@app.route('/getfirstcard/setid=<setid>/')
def getfirstcard(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "SELECT FlashcardID FROM flashcards WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    cardid = cursor.fetchone()
    return str(cardid[0])

#API to delete a set
@app.route('/deleteset/setid=<setid>/')
def deleteset(setid):
    cnx = mysql.connector.connect(user="root", database="e-flashcards")
    cursor = cnx.cursor()
    query = "DELETE FROM sets WHERE SetID = %s"
    cursor.execute(query, (setid, ))
    cnx.commit()
    return "Success"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
