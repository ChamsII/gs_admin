import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../services/backend.service'


@Component({
  selector: 'app-agent-services',
  templateUrl: './agent-services.component.html',
  styleUrls: ['./agent-services.component.scss']
})
export class AgentServicesComponent implements OnInit {

  agentSelected
  pageNum = 1
  filter = ""
  listServices = [];
  requestResultat;
  operationSelected
  dataSelected

  feederPropSelected;
  parametersSelected;
  transferPropSelected;
  regExpKeysOSelected;
  keysSelected;
  responseSelected;
  apiSelected;
  oneOpSelected;

  data = {
    services: [],
    agent: {},
    selected: 1,
    currentPage: 1,
    filter: '',
    pages: 1,
    notifications: {},
  }
  servicesPerPage = 10

  dataSet = {
    datasets:[],
    selected:{ dataset:{}, template:{}, parameters: {} }, //dataset:{}, details:{}, template:{}
    currentPage:1,
    pages:1
  }
  pageNumDataSet = 1
  dataSetsSelected
  templateSelected

  constructor(public backendService: BackendService) {

  }

  ngOnInit() {
    
  }

  /**
   * Sélection d'un agent 
   */
  @Input()
  set agentSelect(name) {
      this.agentSelected = name;
      if( this.agentSelected )
      this.displayPage()
  }


  /**
   * Lister les services de l'agent sélectionné : this.agentSelected
  */
  displayPage(){

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port
    let url =  `${agentUrl}/list?pageNum=${this.pageNum}&pageSize=${this.servicesPerPage}&filter=${this.data.filter}`

    this.backendService.getData( url)
    .then(resultatRequest => {
      
      this.requestResultat = resultatRequest
      if(resultatRequest) {
        this.data.services = []
        this.data.selected = -1

        var count = 0;
        this.data.currentPage = this.pageNum
        if( this.requestResultat.totalSize == 0 ){
          this.data.pages = 1
        } else {

          this.data.pages = Math.ceil( this.requestResultat.totalSize / this.servicesPerPage)
          this.requestResultat.page.forEach(element => {
            
            let url_2 =  agentUrl + "/" + element.value
            this.backendService.getData( url_2 )
            .then(serviceResult => {

              console.log( "serviceResult ", serviceResult)

              var id = count++
              let service = {basepath: serviceResult.basepath, state: serviceResult.state , status: 0}
              if( serviceResult.state == 'running' ){
                serviceResult.status = 1
                if( this.data.selected == -1){
                  this.data.selected = serviceResult
                  this.dataSelected = this.data.selected
                  this.operationSelected = this.dataSelected.apis[0].operations

                  this.transferPropSelected = this.dataSelected.apis[0].operations[0].transferProperties
                  this.feederPropSelected = this.dataSelected.apis[0].operations[0].feederProperties
                  this.parametersSelected =  this.dataSelected.apis[0].operations[0].parameters
                  this.regExpKeysOSelected = this.dataSelected.apis[0].operations[0].regExpKeys
                  this.keysSelected = this.dataSelected.apis[0].operations[0].keys
                  this.responseSelected = {
                    delay: this.dataSelected.apis[0].operations[0].delay,
                    responseType: this.dataSelected.apis[0].operations[0].responseType
                  }

                  console.log("dataSelectedPrime ", this.dataSelected)

                }
                service.status = 1
              }else{
                service.status = 0
              }
              this.data.services.push(serviceResult)

            })
            .catch(error => {
              console.log(error)
            })

            console.log("this.data" , this.data)

          });

        }

      }
     

    })
    .catch(error => {
      console.log(error)
    })

  }




  /**
   * A chaque séelection d'un service
   * @param service 
   */
  onSelectService(service, index){
    this.data.selected = service
    console.log( "this.data.selected " , this.data.selected  )
    this.dataSelected = this.data.selected

    //Liste des oprérations de l'api séléctionné
    this.operationSelected = this.dataSelected.apis[0].operations
    //Transfert properties operation
    this.transferPropSelected = this.dataSelected.apis[0].operations[0].transferProperties
    //Feeder properties
    this.feederPropSelected = this.dataSelected.apis[0].operations[0].feederProperties
    //Paramètres
    this.parametersSelected =  this.dataSelected.apis[0].operations[0].parameters
    //regExpKeys
    this.regExpKeysOSelected = this.dataSelected.apis[0].operations[0].regExpKeys
    //Keys
    this.keysSelected = this.dataSelected.apis[0].operations[0].keys
    this.responseSelected = {
      delay: this.dataSelected.apis[0].operations[0].delay,
      responseType: this.dataSelected.apis[0].operations[0].responseType
    }

  }



  onApiSelected(api){
    console.log( "onApiSelected", api.operations) //operations
    this.operationSelected = api.operations
    this.apiSelected = api

    //Transfert properties operation
    this.transferPropSelected = this.operationSelected[0].transferProperties
    //Feeder properties
    this.feederPropSelected = this.operationSelected[0].feederProperties
    //Paramètres
    this.parametersSelected =  this.operationSelected[0].parameters
    //regExpKeys
    this.regExpKeysOSelected = this.operationSelected[0].regExpKeys
    //Keys
    this.keysSelected = this.operationSelected[0].keys
    this.responseSelected = {
      delay: this.operationSelected[0].delay,
      responseType: this.operationSelected[0].responseType
    }


  }


  onOperationSelected(operation){
    console.log( "onOperationSelected", operation)
    this.oneOpSelected = operation
    this.refreshDatasetsList()
  }


  /**
   * List all dataset
  */
  refreshDatasetsList(){

    this.dataSet.datasets=[];
		this.dataSet.selected = { dataset:{}, template:{}, parameters: {} };
		
    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"
    let filter = ''

    let url =  `${agentUrl}${this.dataSelected.basepath}/${this.apiSelected.name}/${this.oneOpSelected.method}/datasets?pageNum=${this.pageNumDataSet}&pageSize=${this.servicesPerPage}&filter=${filter}`

    console.log( url )

    this.backendService.getData( url)
    .then(resultatRequest => {
      this.requestResultat = resultatRequest
      console.log("******************** DataSet " , this.requestResultat)

      this.dataSet.datasets = this.requestResultat.page
      this.dataSet.pages = Math.ceil( this.requestResultat.totalSize / this.servicesPerPage )
      this.dataSet.currentPage = this.pageNumDataSet

      //liste dataset opération selectionnée
      this.dataSetsSelected = this.dataSet.datasets

      if( this.dataSet.datasets.length > 0 ){
        this.onSelectDataset( this.dataSet.datasets[0] )
      }

    })
    .catch(error => {
      console.log(error)
    })

  }


  /**
   * A chaque sélection d'un data set
   * @param dataset 
   */
  onSelectDataset( dataset ){

    console.log( "onSelectDataset === >" , dataset )

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"

    let url = `${agentUrl}${this.dataSelected.basepath}/${this.apiSelected.name}/${this.oneOpSelected.method}/dataset/${dataset.key}`

    this.backendService.getData( url)
    .then(resultatRequest => {
      console.log( "dataSet ==> " , resultatRequest )
      this.requestResultat = resultatRequest
      this.dataSet.selected.parameters = this.requestResultat
      this.dataSet.selected.dataset = dataset

      this.displayTemplate()
    })
    .catch(error => {
      console.log(error)
    })

  }


  /**
   * Rechercher et afficher le template du dataSet en cours
   */
  displayTemplate(){

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"
    let templateName = this.dataSet.selected.parameters['template']
    let url = `${agentUrl}${this.dataSelected.basepath}/${this.apiSelected.name}/${this.oneOpSelected.method}/template/${templateName}`

    this.backendService.getTemplate( url)
    .then(resultatRequest => {
      console.log( "template ==> " , resultatRequest )
      this.templateSelected = resultatRequest
    })
    .catch(error => {
      console.log(error)
    })

  }




  editService(srv) {
    console.log("edit ", srv)
  }
  stopStartService(srv) {
    console.log("stopStartService ", srv)
  }
  deleteService(srv) {
    console.log("deleteService ", srv)
  }







}
