import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr'; 


// RxJS
import { MessageApiGlobal } from '../../models/message-global.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private msgErreur = JSON.parse('{}');
  //private agents_url = "http://localhost:3000/agent/"
  private agents_url = "http://10.79.213.51:3000/agent/"
  private headers = new HttpHeaders()


  constructor( private http: HttpClient, private toastr: ToastrService ) { }





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

  postAgent(param) {

    this.headers.set('Content-Type', 'application/json')

    let body = JSON.stringify(param)
    return this.http
    .post(`${this.agents_url}create`, param, {headers: this.headers, responseType:'json' } )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

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



  getServices(param, pageNum, filter) {

  //  let param = JSON.parse(params)
    let agentUrl = "http://" + param.hostname + ":" + param.admin_port
    let servicesPerPage = "10";
    let url =  `${agentUrl}/list?pageNum=${pageNum}&pageSize=${servicesPerPage}&filter=${filter}`

    return this.http
    .get(url)
    .toPromise()
    .then(response => response)
    .catch(error => {
      return this.msgErreur.json()
    });

}



  getData(url) {

      return this.http
      .get(url)
      .toPromise()
      .then(response => response)
      .catch(error => error );

  }


  postData(url, param){

    let body = JSON.stringify(param)
    return this.http
    .post(url, body)
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

  deleteData(url) {

    return this.http
    .delete(url)
    .toPromise()
    .then(response => response)
    .catch(error => {
      return error
      //return this.msgErreur.json()
    });

  }


  putData(url, param){

    let body = JSON.stringify(param)
    return this.http
    .put(url, body)
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }


  getTemplate(url) {
    
      return this.http
      .get(url , {responseType:'text'})
      .toPromise()
      .then(response => response)
      .catch(error => {
        return error
      });

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


/**
 * 
 * @param operation 
 */
  

  /*** Test & generate */

  getTestData(operation) {

    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    const headers = new HttpHeaders()
    for(var indice in operation.header ){
      headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
    }

    return this.http
      .get(url, {responseType: 'text'} )
      .toPromise()
      .then(response =>response )
      .catch(error => error );

  }


  postTestData(operation) {
    let url = operation.url_with_params == "" ? operation.url : operation.url_with_params
    const headers = new HttpHeaders()
    for(var indice in operation.header ){
      headers.set(operation.header[indice].Key, operation.header[indice].Value)
    }
    if( operation.autorization.username !="" && operation.autorization.password !="" ){
      headers.set('Authorization', 'Basic ' + btoa( operation.autorization.username + ":" + operation.autorization.password) )
    }
    let body = operation.body
    return this.http
    .post(url, body, {responseType: 'text'} )
    .toPromise()
    .then(response => response)
    .catch(error => error )

  }

/**
 * curl -X POST -d @data.xml http://localhost:9876/TEST_FEEDER_v0/Get
 * curl -X POST -d @data.xml http://localhost:9876/TEST_FEEDER_v0/Get
 * let operation = {  /TEST_DOCR_v0/
      method: this.testGenerationGroup.controls['methodCtrl'].value ,
      url: this.testGenerationGroup.controls['urlapuCtrl'].value ,
      url_with_params: this.paramsData != "" ? `${this.testGenerationGroup.controls['urlapuCtrl'].value}?${this.paramsData}` : "",
      autorization: {username: this.testGenerationGroup.controls['authUserCtrl'].value, password: this.testGenerationGroup.controls['authPasswordCtrl'].value},
      header: this.dataSource.data ,
      body: this.bodyData
    }
 */
  








}
