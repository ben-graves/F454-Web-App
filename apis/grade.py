from flask import Flask, session
from flask import request
import random
import mysql.connector
import json

app = Flask(__name__)

@app.route("/calculategrade/gradesdict=<gradesdict>")
def calculategrade(gradesdict):
    gradesdict = json.loads(gradesdict.replace("'", "\""))
    grade_list = ["G","F","E","D","C","B","A","A*"]

    totalcards = gradesdict['totalcards']
    learntcards = gradesdict['learntcards']

    present_list = []
    total_cards = 0

    for grade in grade_list:
        if totalcards[grade] > 0:
            total_cards += totalcards[grade]
            present_list.append(grade)

    if total_cards == 0 :
        return "U"

    percentages = {}

    for grade in present_list:
        percentages[grade] = (totalcards[grade]/total_cards)*100

    boundaries = {}

    minimum = percentages[present_list[len(present_list)-1]]/2
    boundaries[present_list[0]] = minimum
    print(present_list[0]+": "+str(boundaries[present_list[0]]))

    for i in range (1, len(present_list)):
        boundaries[present_list[i]] = minimum + percentages[present_list[i-1]]
        minimum = boundaries[present_list[i]]
        print(present_list[i]+": "+str(boundaries[present_list[i]]))

    score = 0
    total = 0

    for i in range (len(present_list)):
        total += totalcards[present_list[i]]*(i+1)
        score += learntcards[present_list[i]]*(i+1)

    percentage = score/total*100

    print("Percentage: "+str(percentage))

    boundaries["U"] = 0
    present_list = ["U"]+present_list

    grade_idx = 0

    while grade_idx < len(present_list) and boundaries[present_list[grade_idx]] <= percentage:
        grade_idx += 1

    predicted_grade = present_list[grade_idx-1]

    return(predicted_grade)

if __name__ == "__main__":
    app.run(debug=True, port=5002)
