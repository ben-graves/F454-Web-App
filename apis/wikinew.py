print("start")
import wikipedia
import json

term = "issue"
print("import")
try:
    wikipedia.summary(term)
    results = wikipedia.search(term)
except Exception as e:
    results = str(e)
    results = results.split("\n")
    results.pop()
    results.pop(0)
print("get list")
if len(results) > 15:
    results = results[:15]
print("check size")
for i in range(len(results)-1):
    if "(disambiguation)" in results[i]:
        results.pop(i)
print("remove disambiguation")

dict_list = []
for result in results:
    try:
        article = wikipedia.summary(result, sentences = 1)
        print("pass")
    except:
        suggestion = wikipedia.suggest(result)
        if suggestion:
            article = wikipedia.summary(suggestion, sentences = 1)
        print("fail")
    dict_list.append({"title" : result, "text" : article})

print("create dictionary")
