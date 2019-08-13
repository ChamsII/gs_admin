import { Component, OnInit } from '@angular/core';

import { BackendService } from '../services/backend.service'
import { FunctionService } from '../services/function.service'
import { of } from 'rxjs'
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { EventsService } from '../services/events.service'
import { AgentsService } from '../modal/agents/agents.service';

import 'brace';
import 'brace/mode/xml';
import 'brace/theme/textmate';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/text';


@Component({
  selector: 'app-generation',
  templateUrl: './generation.component.html',
  styleUrls: ['./generation.component.scss']
})
export class GenerationComponent implements OnInit {

  methodOperations
  testGenerationGroup : FormGroup
  resultRequest
  currentJustify = 'fill'

  /** Header  */
  displayedColumns = ['select', 'position', 'Key', 'Value'];
  dataSource = new MatTableDataSource<HeaderData>(ELEMENT_DATA);
  selection = new SelectionModel<HeaderData>(true, []);

  /** body */
  modeSelected = "xml"
  themeSelected = "textmate"
  bodyData = ""
  listFormatText

  paramsData = ""
  desableBody = true
  resultatRequest = ""
  modeResultat = 'xml'

  state_service_selected = "running";


  constructor( public backendService: BackendService ,  private _formBuilder: FormBuilder,
    public functionService: FunctionService , public eventsService: EventsService , 
    public agentsService: AgentsService) { }

  ngOnInit() {

    this.testGenerationGroup = this._formBuilder.group({
      methodCtrl: ['', Validators.required],
      agentGeneSistrl: [''],
      urlapuCtrl: ['', Validators.required],
      authUserCtrl: [''],
      authPasswordCtrl: ['']
    });

    of( this.functionService.getMethodsGeneration() ).subscribe(methods => {
      this.methodOperations = methods
      this.testGenerationGroup.patchValue({methodCtrl: this.methodOperations[1].name})
    })

    of( this.functionService.getFormatText() ).subscribe(format => {
      this.listFormatText = format
    })

    this.dataSource.data = []
    //this.backendService.getTestExternal();

  }


  selectAgent(){
    this.agentsService.confirm()
    .then((confirmed) => {
      if(confirmed.status){ 
        this.testGenerationGroup.patchValue({
          urlapuCtrl: confirmed.service.url ,
          methodCtrl: confirmed.service.operation
        })
        this.state_service_selected = confirmed.service.status

        this.dataSource.data = []
        this.dataSource.data.push({position: (this.dataSource.data.length + 1), Key: "Content-Type", Value: "text/plain" });
        this.dataSource.data.push({position: (this.dataSource.data.length + 1), Key: "Accept", Value: "text/plain, application/json, text/html, application/xhtml+xml, application/xml, */*" });
        this.bodyTabValue( confirmed.service.operation )
      }
    })
    .catch(() => {
    });
  }

  
  /* checkboxLabel(row?: HeaderData): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  } */

  removeRow(row) {
    this.dataSource.data = this.functionService.RemoveNodeInArrayHeader(row, this.dataSource.data )
    this.dataSource.data = this.functionService.reorderArrayHeader( this.dataSource.data )
  }

  createNewHeader(position: number): HeaderData {
    return {
      position: position,
      Key: "",
      Value: ""
    }
  }

  addRow() {
    this.dataSource.data.push(this.createNewHeader(this.dataSource.data.length + 1));
    this.dataSource.filter = "";
  }

  selectFormatChangeHandler( event : any ){
    this.modeSelected = event.target.value
  }

  selectMethodChangeHandler( event : any ){
    this.bodyTabValue( event.target.value )
  }


  bodyTabValue(value){
    if(value == "GET" || value == "HEAD" || value == "OPTIONS" || value == "DELETE" ) {
      this.desableBody = true
    }else{
      this.desableBody = false
    }
  }

  runTest(){

    if( this.state_service_selected == 'stopped' ){
      this.backendService.errorsmsg( "Service non démarré." )
    }else {

      let operation = {
        method: this.testGenerationGroup.controls['methodCtrl'].value ,
        url: this.testGenerationGroup.controls['urlapuCtrl'].value ,
        url_with_params: this.paramsData != "" ? `${this.testGenerationGroup.controls['urlapuCtrl'].value}?${this.paramsData}` : "",
        autorization: {username: this.testGenerationGroup.controls['authUserCtrl'].value, password: this.testGenerationGroup.controls['authPasswordCtrl'].value},
        header: this.dataSource.data ,
        body: this.bodyData
      }
  
      ////  ["POST", "GET", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS" ]
  
      if( operation.method == "POST"){
        this.postMethode(operation)
      }else if( operation.method == "GET"){
        this.getMethode(operation)
      }else if( operation.method == "PUT"){
        this.putMethode(operation)
      }else if( operation.method == "DELETE"){
        this.deleteMethode(operation)
      }else if( operation.method == "PATCH"){
        this.patchMethode(operation)
      }else if( operation.method == "HEAD"){
        this.headMethode(operation)
      }else if( operation.method == "OPTIONS"){
        this.optionsMethode(operation)
      }

    }
    
  }


  getMethode(operation){
    this.backendService.getTestData(operation)
    .then(result => {

      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html' // this.resultatRequest.substring(0,1) == '<' ? 'html' : 'json'
    })
    .catch(error => {
    })
  }


  postMethode(operation){
    this.backendService.postTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }

  putMethode(operation){
    this.backendService.putTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }

  deleteMethode(operation){
    this.backendService.deleteTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }

  patchMethode(operation){
    this.backendService.patchTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }
  
  
  headMethode(operation){
    this.backendService.headTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }

  optionsMethode(operation){
    this.backendService.optionsTestData(operation)
    .then(result => {
      if( result.status == 200 && result.name == "HttpErrorResponse"){
        this.resultatRequest = result.error.text
      }else{
        this.resultatRequest = result
      }
      this.modeResultat = this.resultatRequest.substring(0,2) == '<?' ? 'xml' : this.functionService.isJson(this.resultatRequest)  ? 'json' : 'html'
    })
    .catch(error => {
    })
  }
  


  saveTest(){

  }

  canclelMode(){
    this.eventsService.setTestAndGenerationSelect(false)
  }



}


export interface HeaderData {
  position: number,
  Key: string;
  Value: string;
}

const ELEMENT_DATA: HeaderData[] = [
  { position: 1, Key: "", Value: ''}
];