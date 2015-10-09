term = "perplexing"
API_URL = "http://api.wordnik.com:80/v4/word.json/"+term+"/definitions?limit=15&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"

data = requests.get(API_URL)

definitions_list = data.json()
for definition in definitions_l
    print(definition["text"])
