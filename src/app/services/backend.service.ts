import { Injectable } from '@angular/core';
import { HttpClient , HttpRequest, HttpHeaders } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr'; 


// RxJS
import { MessageApiGlobal } from '../../models/message-global.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private msgErreur = JSON.parse('{}');
  private agents_url = "http://localhost:3000/agent/"

  private headers = new HttpHeaders()

  constructor( private http: HttpClient, private toastr: ToastrService ) { }


  /**
   * Liste des agents
   */
  getAgents(){
    //let url = "./assets/models/agents.json"
    return this.http
    .get(`${this.agents_url}listAgent`)
    .toPromise()
    .then(response => {
      return response
    })
    .catch(error => {
        return this.msgErreur.json() as MessageApiGlobal;
    });
  }

  /**
   * Ajouter ou modifier un aagent
   * @param param 
   */
  postAgent(param) {

    this.headers.set('Content-Type', 'application/json')

    let body = JSON.stringify(param)
    return this.http
    .post(`${this.agents_url}create`, param, {headers: this.headers, responseType:'json' } )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  /***
   * Liste le nombre d'agents
   */
  getNbrAgent(){
    return this.http
    .get(`${this.agents_url}nbrAgent`)
    .toPromise()
    .then(response => {
      return response
    })
    .catch(error => {
        return this.msgErreur.json() as MessageApiGlobal;
    });
  }



  /**
   * Get from server 
   * url Exemple : http://localhost:9085/list?pageNum=1&pageSize=10&filter= 
   * @param url 
   */
  getData(url) {

    var headers = new HttpHeaders()
    headers = headers.set( 'Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')

    return this.http
    .get(url , {headers: headers })
    .toPromise()
    .then(response => response)
    .catch(error => error );
  }


  /**
   * Post to server
   * Ajout : Service , api, opération, Tranfert , Feeder ... etc 
   * @param url 
   * @param param 
   */
  postData(url, param){

    var headers = new HttpHeaders()
    headers = headers.set( 'Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')

    let body = JSON.stringify(param)
    return this.http
    .post(url, body, { headers: headers })
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  /**
   * Delete (Service , api , operation ... )
   * @param url 
   */
  deleteData(url) {
    var headers = new HttpHeaders()
    headers = headers.set( 'Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')

    return this.http
    .delete(url, {headers:headers})
    .toPromise()
    .then(response => response)
    .catch(error => {
      return error
      //return this.msgErreur.json()
    });

  }


  /**
   * Updtae server 
   * Update : Service, Api, Opérations , Transfert , Feeder ... etc
   * @param url 
   * @param param 
   */
  putData(url, param){
    var headers = new HttpHeaders()
    headers = headers.set( 'Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')

    let body = JSON.stringify(param)
    return this.http
    .put(url, body , {headers: headers})
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }


  /**
   * Retourne un template d'un service 
   * @param url 
   */
  getTemplate(url) {

    var headers = new HttpHeaders()
    headers = headers.set( 'Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')
    
      return this.http
      .get(url , { headers: headers, responseType:'text'})
      .toPromise()
      .then(response => response)
      .catch(error => {
        return error
      });

  }


  /**
   * Tosat
   * @param message 
   */
  successmsg(message){  
      this.toastr.success(message,'Success')  
  }  

  /**
   * Tosat
   * @param message 
  */
  errorsmsg(message){  
    this.toastr.error(message,'Error')  
  }  

  /**
   * Tosat
   * @param message 
  */
  infotoastr(message)  
  {  
    this.toastr.info(message, 'Information');  
  }

  /**
   * Tosat
   * @param message 
  */
  toastrwaring(message)  
  {  
    this.toastr.warning(message, 'Warning');  
  }


/**
 * 
 * @param operation 
*/
  
  /*** Test & generate */
  getTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    //headers = headers.set( 'Access-Control-Allow-Origin', '*')
    //headers = headers.set('Content-Type', 'text/plain')
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    return this.http
      .get(url, {headers: headers, responseType: 'text'})
      .toPromise()
      .then(response =>response )
      .catch(error => {
        return error
      } );

  }


  postTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    let body = operation.body
    return this.http
    .post(url, body, {headers: headers, responseType: 'text'} )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  putTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    let body = operation.body
    return this.http
    .put(url, body, {headers: headers, responseType: 'text'}  )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  deleteTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    //let body = operation.body
    return this.http
    .delete(url, {headers: headers, responseType: 'text'}  )
    .toPromise()
    .then(response => response)
    .catch(error => error )
    
  }

  patchTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    let body = operation.body
    return this.http
    .patch(url, body, {headers: headers, responseType: 'text'}  )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  headTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    return this.http
    .head(url, {headers: headers, responseType: 'text'}  )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  optionsTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    var headers = new HttpHeaders()
    
    for(var indice in operation.header ){
      headers = headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers = headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
      headers = headers.set( 'Content-Type', 'application/x-www-form-urlencoded')
    }

    return this.http
    .options(url, {headers: headers, responseType: 'text'} )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }



}
