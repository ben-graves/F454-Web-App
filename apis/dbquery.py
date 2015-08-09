from flask import Flask
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
    cursor.execute(query, user_data)
    cnx.commit()
    return "Success"

if __name__ == "__main__":
    app.run(debug=True, port=8080)
