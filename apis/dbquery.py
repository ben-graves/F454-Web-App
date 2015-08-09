from flask import Flask
from flask import request
import mysql.connector

app = Flask(__name__)

@app.route("/createuser/firstname=<firstname>/lastname=<lastname>/dob=<dob>/"\
"emailaddress=<emailaddress>/username=<username>/password=<password>/")
def createuser(firstname, lastname, dob, emailaddress, username, password):
    cnx = mysql.connector.connect(user="root", database="E-Flashcards")
    cursor = cnx.cursor()
    query = ("INSERT INTO users"
             "(FirstName, LastName, DoB, EmailAddress, Username, Password)"
             "VALUES (%s, %s, %s, %s, %s, %s)")
    user_data = (firstname, lastname, dob, emailaddress, lastname, username, password)
    cursor.execute(query, user_data)
    cnx.commit()
    return "Success"

@app.route("/edituser/id=<user_id>/username=<username>/firstname=<firstname>/"\
           "lastname=<lastname>/password=<password>/")
def edituser(user_id, username, firstname, lastname, password):
    cnx = mysql.connector.connect(user="root", database="userschema")
    cursor = cnx.cursor()
    query = ("""
             UPDATE users
             SET username = %s, firstname = %s, lastname = %s, password = %s
             WHERE id = %s)""")
    user_data = (user_id, username, firstname, lastname, password)
    cursor.execute(query, user_data)
    cnx.commit()
    return "User edited"

@app.route("/deleteuser/id=<int:user_id>/")
def deleteuser(user_id):
    cnx = mysql.connector.connect(user="root", database="userschema")
    cursor = cnx.cursor()
    #query = ("DELETE FROM users WHERE ID = %d")
    user_data = user_id
    ex = cursor.execute("DELETE FROM 'users' WHERE ID = ?", int(6))
    cnx.commit()
    return str(ex)

@app.route("/selectuser/username=<username>/")
def selectuser(username):
    cnx = mysql.connector.connect(user="root", database="userschema")
    cursor = cnx.cursor()
    query = ("SELECT * FROM users"
             "WHERE username = %s)")
    user_data = (username)
    cursor.execute(query, username)
    cnx.commit()
    return cursor

if __name__ == "__main__":
    app.run(debug=True, port=1234)
