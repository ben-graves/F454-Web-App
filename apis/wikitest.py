import wikipedia
from flask import Flask, session
from flask import request
import mysql.connector
import json
import requests
import goslate

app = Flask(__name__)

#API to get the first sentance of wikipedia articles, their titles and their links
@app.route("/titleandarticle/term=<term>/")
def titleandarticle (term):
    results = []
    try:
        #search for term
        results = wikipedia.search(term)
        #check no disambiguation error will occur
        wikipedia.summary(term)
    except Exception as e:
        #if disabmbiguation error occurs take the error message
        results_disambiguation = str(e)
        #extract the disabmbiguations given in message and add these to results
        results_disambiguation = results_disambiguation.split("\n")
        results_disambiguation.pop()
        results_disambiguation.pop(0)
        results = results_disambiguation + results
    for i in range(len(results)-1):
        #remove unwanted disabmbiguation articles (list of disabmbiguations of word)
        if "(disambiguation)" in results[i]:
            results.pop(i)

    dict_list = []
    for result in results:
        try:
            #extract only one sentace
            article = wikipedia.summary(result, sentences = 1)
            link = "https://en.wikipedia.org/wiki/"+result.replace(" ","_")
            #add to list
            dict_list.append({"title" : result, "text" : article, "link" : link})
        except:
            #if error occurred, take the suggestion if available
            suggestion = wikipedia.suggest(result)
            if suggestion:
                article = wikipedia.summary(suggestion, sentences = 1)
                link = "https://en.wikipedia.org/wiki/"+suggestion.replace(" ","_")
                #add to list
                dict_list.append({"title" : result, "text" : article, "link" : link})

    return json.dumps(dict_list)

#get definitions of term
@app.route("/definitions/term=<term>/")
def definitions(term):
    #URL for wordnik API
    API_URL = "http://api.wordnik.com:80/v4/word.json/"+term.lower()+"/definitions?limit=20&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"

    data = requests.get(API_URL)

    #convert to python list
    data_list = data.json()
    definitions_list = []
    #extract text from response
    for definition in data_list:
        definitions_list.append(definition["text"])
    return json.dumps(definitions_list)

#get translation of term, from one language to another
@app.route("/translate/term=<term>/langfrom=<langfrom>/langto=<langto>/")
def translate(term, langfrom, langto):
    #use goslate API to get translation
    gs = goslate.Goslate()
    translation =(gs.translate(term, source_language = langfrom, target_language = langto))
    return translation

if __name__ == "__main__":
    app.run(debug=True, port=5001)
