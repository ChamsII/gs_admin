import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';


// RxJS
import { MessageApiGlobal } from '../../models/message-global.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private msgErreur = JSON.parse('{}');

  constructor( private http: HttpClient) { }





  getAgents(){

    let url = "./assets/models/agents.json"
    return this.http
    .get(url)
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
      .catch(error => {
        return this.msgErreur.json()
      });

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





}
