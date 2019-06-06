import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; 


// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  agentSelected

  constructor( private toastr: ToastrService ) { }



  getMethods(){
    return [
      { id: '1', name: 'POST'},
      { id: '2', name: 'GET'},
      { id: '3', name: 'PUT'},
      { id: '4', name: 'DELETE'},
      { id: '5', name: 'HEAD'},
      { id: '6', name: 'OPTIONS'},
      { id: '7', name: 'TRACE'},
      { id: '8', name: 'CONNECT'}
    ]
  }

  getFormatResponse(){
    return [
      {id: 1, name: "XML"},
      {id: 2, name: "JSON"},
      {id: 3, name: "TXT"},
      {id: 3, name: "HTML"}
    ]
  }

  getParamType(){
    return [
      {id: 1, name: "DATE"},
      {id: 2, name: "COUNTER"},
      {id: 3, name: "RANDOM_NUMERIC"},
      {id: 4, name: "RANDOM_ALPHANUM"}
    ]
  }

  getSourceTP(){
    return [
      {id: 1, name: "BODY_XPATH"},
      {id: 2, name: "QUERY"},
      {id: 3, name: "PATH"},
      {id: 4, name: "HEADER"},
      {id: 5, name: "JSON_PATH"},
      {id: 6, name: "POSITION"},
      {id: 7, name: "TLV"}
    ]
  }

  getNewAPI(){
    return {
      name:'default',
      uri:'/',
      operations:[{
        method:'POST',
        transferProperties:[],
        parameters:[],
        keys:[],
        regExpKeys:[],
        responseType:'text/xml;charset=UTF-8',
        delay:0,
        feederProperties: []
      }]
    };

  }

  getNewService(){
    return {
			basepath:'',
			state:'stopped',
			apis:[]
    };
  }

  getNewOperation(method){
    return {
      method: method,
      transferProperties:[],
      parameters:[],
      keys:[],
      regExpKeys:[],
      responseType:'text/xml;charset=UTF-8',
      delay:0,
      feederProperties: []
    }
  }

  initTransfertProperties( transfert? ){
    return {
      idTrans: transfert.idTrans ? transfert.idTrans : 0,
      name: transfert.name ? transfert.name : "",
      source: transfert.source ? transfert.source : "",
      path: transfert.path ? transfert.path : "",
      isKey: transfert.isKey ? transfert.isKey : 0,
      template: transfert.template ? transfert.template : "",
      isUnique: transfert.isUnique ? transfert.isUnique : 0,
      value: transfert.value ? transfert.value : "",
      isFeeder: transfert.isFeeder ? transfert.isFeeder : 0,
      feederName: transfert.feederName ? transfert.feederName : ""
    }
  }

  getSourseFormat(sourceValue){
    if( sourceValue == "BODY_XPATH") {
      return {
        helpMessage : 'Nom du champ dans la trame: .//nomDuChamp',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: 'Le champ est unique dans la trame',
        valeurChmp: 'La valeur du champs dans la trame',
        showReg: true,
        feederMessage: "Le champs dans la trame est un feeder"
      }
    }else if( sourceValue == "QUERY") {
      return {
        helpMessage : 'Nom de la variable en GET',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: '',
        valeurChmp: '',
        showReg: false,
        feederMessage: "La variable en GET est un feeder"
      }
    }else if( sourceValue == "PATH") {
      return {
        helpMessage : 'Nom du champ dans la PATH',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: '',
        valeurChmp: '',
        showReg: false,
        feederMessage: "Le champs dans le PATH est un feeder"
      }
    }else if( sourceValue == "HEADER") {
      return {
        helpMessage : 'Nom du header',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: '',
        valeurChmp: '',
        showReg: false,
        feederMessage: "Le header est un feeder"
      }
    }else if( sourceValue == "JSON_PATH") {
      return {
        helpMessage : 'Nom du champ dans la trame: $.nomDuChamp',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: 'Le champ est unique dans la trame',
        valeurChmp: 'La valeur du champs dans la trame',
        showReg: true,
        feederMessage: "Le champs dans la trame est un feeder"
      }
    }else if( sourceValue == "POSITION") {
      return {
        helpMessage : 'Position dans la trame',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: '',
        valeurChmp: '',
        showReg: false,
        feederMessage: ""
      }
    }else if( sourceValue == "TLV") {
      return {
        helpMessage : 'Type Longueur Valeur',
        tplMessage: 'Nom du template retourner : Templateretour ',
        isUnique: '',
        valeurChmp: '',
        showReg: false,
        feederMessage: ""
      }
    }
  }


  initFeeder(feeder?){
    return {
      idFeeder: feeder.idFeeder ? feeder.idFeeder : 0 ,
      csvFile: feeder.csvFile ? feeder.csvFile : "",
      type: feeder.type ? feeder.type : "",
      value: feeder.value ? feeder.value : "",
      isRandom: feeder.isRandom ? feeder.isRandom : 0
    }
  }

  getFeederValue(feeders){
    let start_string = feeders.substring(1)
    return [start_string.substring(0, feeders.length -2) ]
  }


  setParamTypeFormat( type ){

    if ( type == 'DATE') {
      return {
        helpMessage: 'Format de date. Exemple: yyyy-mm-dd.',
        patternCheck: '^[\w-_.]*$',
        placeHolder: 'yyyy-mm-dd',
        helpMessage2: '',
        placeHolder2: '',
        type: 'date'
      }

    }else if ( type == 'COUNTER') {
      return {
        helpMessage: 'Valeur de départ du compteur.',
        patternCheck: '^[0-9]*$',
        placeHolder: '0',
        helpMessage2: '',
        placeHolder2: '',
        type: 'number'
      }

    }else if ( type == 'RANDOM_NUMERIC') {
      return {
        helpMessage: 'Longueur du nombre à générer.',
        patternCheck: '^[0-9]*$',
        placeHolder: '5',
        helpMessage2: '',
        placeHolder2: '',
        type: 'number'
      }
    }else if ( type == 'RANDOM_ALPHANUM') {
      return {
        helpMessage: 'Longueur de la chaine à générer.',
        patternCheck: '^[0-9]*$',
        placeHolder: '5',
        helpMessage2: 'Liste des caractères: ABCD12981add',
        placeHolder2: 'ABCDEFGHIJKLMNOPQRSTUVWXZ',
        type: 'text'
      }
    }

  }

  initParameters( parameters? ){
    return {
      idParam: parameters.idParam ? parameters.idParam : 0,
      name: parameters.name ? parameters.name : "",
      type: parameters.type ? parameters.type : "",
      arg: parameters.arg ? parameters.arg : "",
      arg2: parameters.arg2 ? parameters.arg2 : ""
    }
  }

  getResponseInitProperties(responseType){
    let first_ = responseType.split(";")
    return first_[0].split("/")[1]
  }

  initProperties(properties?){
    return {
      responseType: properties.responseType ? this.getResponseInitProperties(properties.responseType) : "XML" ,
      delay: properties.delay ? properties.delay : 0,
    }
  }

  initCleRegle(reglekey?){
    return {
      regle: reglekey.regle ? reglekey.regle : "",
      target: reglekey.target ? reglekey.target : "",
    }
  }

  getDatsetValue(dataset){
    return dataset.split("-")[1]
  }

  getDetailDataset(dataset){
    return dataset.split(".")[0]
  }





successmsg(message){  
    this.toastr.success(message,'Success')  
}  

errorsmsg(message){  
  this.toastr.error(message,'Error')  
}  

infotoastr(message)  
{  
  this.toastr.info(message, 'Information');  
}

toastrwaring(message)  
{  
  this.toastr.warning(message, 'Warning');  
}


/********************************* Remove node  */
RemoveNodeInArrayProp(param, array_data) {
    let self = this
    return array_data.filter(function(emp) {
        if (emp.idParam == param.idParam) {
        self.successmsg("Paramètre " + param.name + " supprimé ! ")
            return false;
        }
        return true;
    });
}

RemoveNodeInArrayTps(tp, array_data) {
    let self = this
    return array_data.filter(function(emp) {
        if (emp.idTrans == tp.idTrans) {
        self.successmsg("Transfère " + tp.name + " supprimé ! ")
            return false;
        }
        return true;
    });
}

RemoveNodeInArrayKey(tp, array_data) {
    let self = this
    return array_data.filter(function(emp) {
        if (emp.idTrans == tp.idTrans) {
        self.successmsg("Clé " + tp.name + " supprimé ! ")
            return false;
        }
        return true;
    });
}

RemoveNodeInArrayRules(rule, array_data) {
    let self = this
    return array_data.filter(function(emp) {
        if (emp.idRules == rule.idRules) {
        self.successmsg("Règle " + rule.regle + " supprimée ! ")
            return false;
        }
        return true;
    });
}

getListeKey(array_key) {
    let keys = []
    array_key.forEach(function(element) {
        keys.push(element.name) 
    });
    return keys
}


RemoveNodeInArrayFeeder(feeder, array_data) {
    let self = this
    return array_data.filter(function(emp) {
        if (emp.idFeeder == feeder.idFeeder) {
        self.successmsg("Feeder " + feeder.csvFile + " supprimé ! ")
            return false;
        }
        return true;
    });
}


updateAPIService(service, liste_service){
  for(var indice in liste_service){
    if( liste_service[indice].basepath == service.basepath ){
      liste_service[indice].apis = service.apis
      return liste_service
    }
  }
  return liste_service
}

/********************************* Check doublon  */


setAgentSelect( agent ){
  this.agentSelected = agent
}

getAgentSelect(){
  return this.agentSelected
}



getAgent(agent_list, id_agent){
  for(var indice in agent_list){
    if(agent_list[indice].id == id_agent){
      return agent_list[indice];
    }
  }

  return agent_list[0]
}


getFormatText(){
  return [
    {id: 1, name: "xml", value: "application/xml" },
    {id: 2, name: "json", value: "application/json"},
    {id: 3, name: "text", value: "text/plain"},
    {id: 3, name: "html", value: "text/html"}
  ]
}


}