import wikipedia
from flask import Flask, session
from flask import request
import mysql.connector
import json

app = Flask(__name__)

@app.route("/search/term=<term>/")
def search(term):
    return str(wikipedia.search(term))

@app.route("/define/term=<term>/sentences=<sentences>")
def define(term, sentences):
    return wikipedia.summary(term, sentences = sentences)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
