from parse_trame import *
from Trame import *
from Trace import *
import datetime as dt

#initialisation

filename = "../../output/output_" + dt.datetime.now().strftime("%Y-%m-%d_%H.%M.%S") + ".txt"
error = False
try :  
    error, cleanStrTrame = get_clean_trame(file = "./pythonScript/trace.txt")
    if error == True:
        raise Exception(cleanStrTrame)
except Exception as inst:
    with open("./output.json","w") as output:
        output.write('{"Erreur":"Veuillez selectionner un fichier valide - offset issue"}')
    exit

outputCleanTrame(cleanStrTrame, file = "./pythonScript/cleanTrace.txt")
Trame.initId()
trace = []
with open("./pythonScript/cleanTrace.txt", "r") as cleanTrame:
    for line in cleanTrame:
        trace.append(Trame(line))
    cleanTrame.close()
try:
    traceObj = Trace(trace)
    with open("./output.json","w") as output:
        output.write(traceObj.toDictStr())
    #print(traceObj.toJson())
except:
    with open("./output.json","w") as output:
        output.write('{"Erreur":"Veuillez selectionner un fichier valide"}')

with open(filename, "w") as output:
    output.write(traceObj.toString())
filename.close()