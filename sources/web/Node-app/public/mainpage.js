//const api_url = "http://localhost:3000/fichier";
const api_url = window.location.origin + "/fichier" // Constante contenant le chemin d'accès a l'output du script python
var data = null

// Creation d'action en reponse a des evenements
var btnLaunch = document.getElementById("launch");
btnLaunch.addEventListener('click',getOutput);
var trameList = document.getElementById("listTrames");
trameList.addEventListener('change',trameListOnChange)
var formVar = document.getElementById("formTrace");
formVar.addEventListener("change",getFile);


// Fonction permettant d'envoyer le fichier selectionne au serveur puis d'y acceder
async function getFile(){
    console.log(document.getElementById("fichierTrace").files[0]);
    const dataFichier = new FormData();
    dataFichier.append("fichierTrace",document.getElementById("fichierTrace").files[0])
    var dataS = {"3":6,"4":8};
    fetch('/fichier', {
        method:'POST',
        body: dataFichier,

    }).then(response => response.json()).then(json => console.log("json"));

    afficheAnalyse();
}

// Fonction permettant de lancer la fenetre de selection du fichier
async function getOutput(){
    document.getElementById("launch").scrollIntoView({behavior:'smooth', block: 'center',
        inline: 'center'});
    document.getElementById("fichierTrace").click();
};

// Fonction permettant de  lire les donnees via l'api fetch et d'afficher un message d'erreur s'il y'a eu un probleme lors de l'execution du script
async function afficheAnalyse(){
    const response = await fetch(api_url);
    data = await response.json();
    const keys = Object.keys(data);
    if(keys.includes("Erreur")){
        const errorMsg = data["Error"]
        if(typeof errorMsg == "string"){
            
            alert(`Erreur: ${errorMsg}`)
        }
        else{
            alert("Erreur: Veuillez selectionner un fichier valide")
        }
    }else{
        destroyList("listTrames");
        displayAnalyse(keys);
        printData();
        document.getElementById("listTrames").scrollIntoView({behavior:'smooth', block: 'center',
        inline: 'center'});
    }
}

// Fonction permettant d'ajouter une option a une liste 
function ajoutListe(idListe,texteOption) {

    var opt = document.createElement("option");
    opt.text = texteOption;
    opt.value = texteOption;
    document.getElementById(idListe).options.add(opt);
}

// Fontion permettant l'affichage des donnees dans la console javascript
function printData(){
    console.log(data);
};

// Fonction permettant d'enlever tous les elements d'une liste
function destroyList(list){
    for(var i =document.getElementById(list).options.length-1; i >= 0;i--){
        document.getElementById(list).remove(i)
    };
}

// Fonction permettant l'affichage des donnees d'analyse
function displayAnalyse(keys){
    
    for(var key in keys){
        ajoutListe("listTrames",keys[key]);
    };
    document.getElementById("analyse").style.display = "block";
    document.getElementById("details").style.display = "none";
    const deroulants = document.querySelectorAll("details");
    deroulants.forEach((deroulant) => {
        deroulant.removeAttribute("open");
    })
}

// Fonction reagissant au changement de la selection d'une trame
async function trameListOnChange(){
    document.getElementById("details").style.display = "block";
    var couche2 = Object.keys(data[document.getElementById("listTrames").value])[0];
    var couche3 = Object.keys(data[document.getElementById("listTrames").value])[1];
    var couche4 = Object.keys(data[document.getElementById("listTrames").value])[2];
    var couche7 = Object.keys(data[document.getElementById("listTrames").value])[3];

    document.getElementById("Couche2").getElementsByTagName("summary")[0].innerHTML = couche2;
    document.getElementById("Couche3").getElementsByTagName("summary")[0].innerHTML = couche3;
    document.getElementById("Couche4").getElementsByTagName("summary")[0].innerHTML = couche4;
    document.getElementById("Couche7").getElementsByTagName("summary")[0].innerHTML = couche7;

    document.getElementById("Couche2").getElementsByTagName("p")[0].innerHTML = getTextFromJson(data[document.getElementById("listTrames").value][couche2]);
    
    document.getElementById("Couche3").getElementsByTagName("p")[0].innerHTML = getTextFromJson(data[document.getElementById("listTrames").value][couche3]);
    document.getElementById("Couche4").getElementsByTagName("p")[0].innerHTML = getTextFromJson(data[document.getElementById("listTrames").value][couche4]);
    if(couche7 == "DNS"){
        document.getElementById("Couche7").getElementsByTagName("p")[0].innerHTML =""
        getTextFromJsonDns(data[document.getElementById("listTrames").value][couche7],document.getElementById("Couche7").getElementsByTagName("p")[0]);
    }else{
        document.getElementById("Couche7").getElementsByTagName("p")[0].innerHTML = getTextFromJson(data[document.getElementById("listTrames").value][couche7]);
    }
    document.getElementById("details").scrollIntoView({behavior:'smooth', block: 'center',
        inline: 'center'});
};

// Fonction permettant d'obtenir le texte correspondant au json dans un certain format
function getTextFromJson(jsonDic){
    if(typeof jsonDic == "undefined"){
        return ""
    }
    res = "";
    dicKeys = Object.keys(jsonDic);
    for(var key in dicKeys){
        if(typeof jsonDic[dicKeys[key]] == "string"){
            res+=dicKeys[key]+": "+jsonDic[dicKeys[key]]+"<br>";
        }
        else{
            valKeys = Object.keys(jsonDic[dicKeys[key]]);
            res+=dicKeys[key]+": "
            for(var valKey in valKeys){
                res+= jsonDic[dicKeys[key]][valKeys[valKey]]+" "
            }
            res += "<br>"
        };
    };
    return res;
}

// Fonction permettant d'obtenir le texte correspondant au json dans le format approprie pour DNS
function getTextFromJsonDns(jsonDic,paragraphe){
    if(typeof jsonDic == "undefined"){
        return ""
    }
    res = "";
    
    dicKeys = Object.keys(jsonDic);
    for(var key in dicKeys){
        if(typeof jsonDic[dicKeys[key]] == "string"){
            var textDns = document.createTextNode(dicKeys[key]+": "+jsonDic[dicKeys[key]]);
            paragraphe.appendChild(textDns);
            paragraphe.appendChild(document.createElement("br"));
        }
        else{
            valKeys = Object.keys(jsonDic[dicKeys[key]]);
            var txt = dicKeys[key]+" : "
            var firstBoucle = false
            valKeys = Object.keys(jsonDic[dicKeys[key]]);
            var detailDns = document.createElement("details")
            var sumDns = document.createElement("summary")
            var textDns2 = document.createTextNode(dicKeys[key])
            sumDns.appendChild(textDns2)
            detailDns.append(sumDns)
            for(var valKey in valKeys){
                if(typeof jsonDic[dicKeys[key]] == "undefined"){
                    break
                }else{
                    if(typeof jsonDic[dicKeys[key]][valKeys[valKey]] == "string"){
                        firstBoucle = true
                        txt+= jsonDic[dicKeys[key]][valKeys[valKey]]+" "
                        
                    }
                    else{
                        var pSum = document.createElement("p")
                        getTextFromJsonDns(jsonDic[dicKeys[key]][valKeys[valKey]],pSum)
                        detailDns.appendChild(pSum);
                    };
                };
                if(firstBoucle){
                    var textDns3 = document.createTextNode(txt);
                    paragraphe.appendChild(textDns3);
                    paragraphe.appendChild(document.createElement("br"));
                    dicKeys = Object.keys(jsonDic);
                }else{
                    paragraphe.appendChild(detailDns);
                    dicKeys = Object.keys(jsonDic);
                };
                };
        };
    };
}