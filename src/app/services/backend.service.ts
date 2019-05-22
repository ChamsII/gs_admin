import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr'; 


// RxJS
import { MessageApiGlobal } from '../../models/message-global.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private msgErreur = JSON.parse('{}');
  private options

  constructor( private http: HttpClient, private toastr: ToastrService ) { }





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



  



  








}
