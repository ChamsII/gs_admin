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


@Component({
  selector: 'app-generation',
  templateUrl: './generation.component.html',
  styleUrls: ['./generation.component.scss']
})
export class GenerationComponent implements OnInit {

  methodOperations
  testGenerationGroup : FormGroup
  agentGeneSisSelect
  resultRequest
  agentsGenesis
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

    of( this.functionService.getMethods() ).subscribe(methods => {
      this.methodOperations = methods
      this.testGenerationGroup.patchValue({methodCtrl: this.methodOperations[1].name})
    })

    of( this.functionService.getFormatText() ).subscribe(format => {
      this.listFormatText = format
    })

  }


  selectAgent(){
    this.agentsService.confirm()
    .then((confirmed) => {
      if(confirmed.status){ 
        this.testGenerationGroup.patchValue({
          urlapuCtrl: confirmed.service.url ,
          methodCtrl: confirmed.service.operation
        })
      }
    })
    .catch(() => {
    });
  }

  

  checkboxLabel(row?: HeaderData): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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
    if(event.target.value == "GET" || event.target.value == "HEAD" || event.target.value == "OPTIONS") {
      this.desableBody = true
    }else{
      this.desableBody = false
    }
  }


  runTest(){

    let operation = {
      method: this.testGenerationGroup.controls['methodCtrl'].value ,
      url: this.testGenerationGroup.controls['urlapuCtrl'].value ,
      url_with_params: this.paramsData != "" ? `${this.testGenerationGroup.controls['urlapuCtrl'].value}?${this.paramsData}` : "",
      autorization: {username: this.testGenerationGroup.controls['authUserCtrl'].value, password: this.testGenerationGroup.controls['authPasswordCtrl'].value},
      header: this.dataSource.data ,
      body: this.bodyData
    }

    let post_methode = ["POST", "PUT", "DELETE", "TRACE", "CONNECT"]
    //let get_methode = ["GET", "HEAD", "OPTIONS"]
    if(post_methode.includes(operation.method)){
      this.postMethode(operation)
    }else{
      this.getMethode(operation)
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
      this.modeResultat = this.resultatRequest.substring(0,1) == '<' ? 'xml' : 'json'
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
      this.modeResultat = this.resultatRequest.substring(0,1) == '<' ? 'xml' : 'json'
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