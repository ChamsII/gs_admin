import { Component, OnInit, Input , EventEmitter , Output } from '@angular/core';

import { BackendService } from '../services/backend.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { EventsService } from '../services/events.service'
import { FunctionService } from '../services/function.service'

@Component({
  selector: 'app-agent-services',
  templateUrl: './agent-services.component.html',
  styleUrls: ['./agent-services.component.scss']
})
export class AgentServicesComponent implements OnInit {

  public searchString: string;
  agentSelected
  pageNum = 1

  requestResultat;
  operationSelected = null
  dataSelected = null

  feederPropSelected = [];
  parametersSelected = null;
  transferPropSelected =null;
  regExpKeysOSelected = null ;
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

  editModeSet
  @Output() editModeEmitter = new EventEmitter();

  constructor(public backendService: BackendService , public confirmationDialogService: ConfirmationDialogService , 
    public eventsService: EventsService , public functionService: FunctionService ) {

  }

  ngOnInit() {

    this.eventsService.serviceSelected.subscribe(srvChange => {
      this.data.services = this.functionService.updateAPIService(srvChange, this.data.services)
    })

    this.eventsService.editMode.subscribe(editMChange => {
      this.onEditeMode(editMChange)
    })

    this.eventsService.agentSelected.subscribe(agent => {

      this.agentSelected = agent;
      this.initElement()
      this.displayPage()
    })

    if(this.eventsService.serviceReload) {
      this.eventsService.setReloadService(false)
      this.initElement()
      this.displayPage()
    }

  }

  /**
   * Sélection d'un agent 
   */
  @Input()
  set agentSelect(name) {
    
    if( name ) {
      this.agentSelected = name;
      //this.initElement() //this.displayPage()
    }
  }


  @Input()
  set editMode(name) {
      this.editModeSet = name;
  }


  initElement(){
    this.pageNum = 1 
    this.servicesPerPage = 10
    this.data = {
      services: [],
      agent: {},
      selected: -1,
      currentPage: 1,
      filter: '',
      pages: 1,
      notifications: {},
    }
    this.dataSet = {
      datasets:[],
      selected:{ dataset:{}, template:{}, parameters: {} }, //dataset:{}, details:{}, template:{}
      currentPage:1,
      pages:1
    }
    this.operationSelected = null
    this.dataSelected = null
    this.feederPropSelected = [];
    this.parametersSelected = null;
    this.transferPropSelected =null;
    this.regExpKeysOSelected = null ;
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


              var id = count++
              let service = {basepath: serviceResult.basepath, state: serviceResult.state , status: 0}
              if( serviceResult.state == 'running' ){
                serviceResult.status = 1
              
                service.status = 1
              }else{
                service.status = 0
                serviceResult.status = 0
              }

              if( this.data.selected == -1){
                this.data.selected = serviceResult
                this.dataSelected = this.data.selected
                this.operationSelected = this.dataSelected.apis[0].operations

                this.transferPropSelected = this.dataSelected.apis[0].operations[0].transferProperties
                this.feederPropSelected = this.dataSelected.apis[0].operations[0].feederProperties ? this.dataSelected.apis[0].operations[0].feederProperties : []
                this.parametersSelected =  this.dataSelected.apis[0].operations[0].parameters
                this.regExpKeysOSelected = this.dataSelected.apis[0].operations[0].regExpKeys
                this.keysSelected = this.dataSelected.apis[0].operations[0].keys
                this.responseSelected = {
                  delay: this.dataSelected.apis[0].operations[0].delay,
                  responseType: this.dataSelected.apis[0].operations[0].responseType,
                  fileResponse: this.functionService.fileNameInit( this.dataSelected.apis[0].operations[0] ) == true ? this.dataSelected.apis[0].operations[0].fileResponse : ""
                }
              }

              this.data.services.push(serviceResult)

            })
            .catch(error => {
            })

          });

        }

      }

    })
    .catch(error => {
    })

  }

  /**
   * Previous page : list of services 
  */
  previousPage(){
    this.pageNum -= 1
    this.data.selected != -1 
    this.displayPage()
  }

  /**
   * Next page : list of services 
  */
  nextPage(){
    this.pageNum += 1
    this.data.selected != -1 
    this.displayPage()
  }

  filterService( filter ){
    if( this.data.filter != filter ){
      this.data.filter = filter
      this.displayPage()
    }
  }



  /**
   * A chaque séelection d'un service
   * @param service 
   */
  onSelectService(service, index?){
    this.data.selected = service
    this.dataSelected = this.data.selected

    //Liste des oprérations de l'api séléctionné
    this.operationSelected = this.dataSelected.apis[0].operations
    //Transfert properties operation
    this.transferPropSelected = this.dataSelected.apis[0].operations[0].transferProperties
    //Feeder properties
    this.feederPropSelected = this.dataSelected.apis[0].operations[0].feederProperties ? this.dataSelected.apis[0].operations[0].feederProperties : []
    //Paramètres
    this.parametersSelected =  this.dataSelected.apis[0].operations[0].parameters
    //regExpKeys
    this.regExpKeysOSelected = this.dataSelected.apis[0].operations[0].regExpKeys
    //Keys
    this.keysSelected = this.dataSelected.apis[0].operations[0].keys
    this.responseSelected = {
      delay: this.dataSelected.apis[0].operations[0].delay,
      responseType: this.dataSelected.apis[0].operations[0].responseType,
      fileResponse: this.functionService.fileNameInit( this.dataSelected.apis[0].operations[0] ) == true ? this.dataSelected.apis[0].operations[0].fileResponse : ""
    }

  }



  onApiSelected(api){
    this.operationSelected = api.operations
    this.apiSelected = api

    //Transfert properties operation
    this.transferPropSelected = this.operationSelected[0].transferProperties
    //Feeder properties
    this.feederPropSelected = this.operationSelected[0].feederProperties ? this.operationSelected[0].feederProperties : []
    //Paramètres
    this.parametersSelected =  this.operationSelected[0].parameters
    //regExpKeys
    this.regExpKeysOSelected = this.operationSelected[0].regExpKeys
    //Keys
    this.keysSelected = this.operationSelected[0].keys
    this.responseSelected = {
      delay: this.operationSelected[0].delay,
      responseType: this.operationSelected[0].responseType,
      fileResponse: this.functionService.fileNameInit( this.operationSelected[0] ) == true ? this.operationSelected[0].fileResponse : ""
    }


  }


  onOperationSelected(operation){
    this.oneOpSelected = operation
    this.eventsService.setOpSelecte(operation)
    if( this.data.selected != -1 )
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

    this.backendService.getData( url)
    .then(resultatRequest => {
      this.requestResultat = resultatRequest
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
      
    })

  }


  /**
   * A chaque sélection d'un data set
   * @param dataset 
   */
  onSelectDataset( dataset ){

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"
    let url = `${agentUrl}${this.dataSelected.basepath}/${this.apiSelected.name}/${this.oneOpSelected.method}/dataset/${dataset.key}`
    this.backendService.getData( url)
    .then(resultatRequest => {
      this.requestResultat = resultatRequest
      this.dataSet.selected.parameters = this.requestResultat
      this.dataSet.selected.dataset = dataset
      this.displayTemplate()
    })
    .catch(error => {

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
      this.templateSelected = resultatRequest
    })
    .catch(error => {

    })

  }



  /**
   * Edit service 
   * @param srv 
   */
  editService(srv, index) {

    let editmode = {
      status: true,
      mode: 'updateService'
    }
    this.editModeSet = editmode

    if( this.dataSelected.basepath != srv.basepath )
      this.onSelectService(srv, index);

    this.editModeEmitter.emit( this.editModeSet )

  }


  /**
   * Stop and start service 
   * @param srv 
   */
  stopStartService(srv) {
    
    let action = "start"
    if( srv.state == "running" ){
      //Stop stervice
      action = "stop"
    }

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"
    let url = `${agentUrl}${action}/${srv.basepath}`

    this.backendService.getData( url)
    .then(resultatRequest => {
      this.requestResultat = resultatRequest

      srv.state = this.requestResultat.state == "stopped" ? 0:1
      srv.status = this.requestResultat.state == "stopped" ? 0:1
      //Service selected == service updated
      if( this.dataSelected.basepath == this.requestResultat.basepath ){
        this.dataSelected = this.requestResultat
        this.dataSelected.status = this.requestResultat.state == "stopped" ? 0:1
        this.data.selected = this.dataSelected
      }else {
        for( var id in this.data.services ){
          if( this.data.services[id].basepath == this.requestResultat.basepath ){
            this.data.services[id].state = this.requestResultat.state
            this.data.services[id].status = this.requestResultat.state == "stopped" ? 0:1
          }
        }
      }
      if( this.requestResultat.state == "stopped" )
        this.backendService.toastrwaring( "Service " + this.requestResultat.basepath + " arrêté " )
      else
        this.backendService.successmsg( "Service " + this.requestResultat.basepath + " démarré " )

    })
    .catch(() => {
      
    })


  }
  

  /**
   * Supprimer un service 
   * @param srv 
   * @param index 
  */
  deleteService(srv, index) {

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer le service ${srv.basepath} ?`)
    .then((confirmed) => {
      if(confirmed){
        let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + "/"
        let url = `${agentUrl}delete/${srv.basepath}`
        this.backendService.getData( url )
        .then(resultatRequest => {
          this.requestResultat = resultatRequest
          this.data.selected = -1
          this.displayPage()
        })
        .catch(error => {

        })
      }
    })
    .catch(() => {
    });

  }


  onEditeMode(editmode){
    this.editModeSet = editmode
    this.editModeEmitter.emit( this.editModeSet )
  }

  
  onCancelMode(name) {
    if( name.type == "reload" && this.agentSelected ){
      this.data.selected = -1
      this.displayPage()
    }
  }
  







}
