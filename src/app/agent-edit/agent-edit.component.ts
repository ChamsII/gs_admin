import { Component, OnInit , Input , EventEmitter , Output , ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent} from '@angular/cdk/stepper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import {MatStepper} from '@angular/material/stepper'; 

import { of } from 'rxjs'


import { BackendService } from '../services/backend.service'
import { FunctionService } from '../services/function.service';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false , showError: true }
  }]
})
export class AgentEditComponent implements OnInit {

  //Variable édition
  templateSelected
  dataSetsSelected
  detailParameterSelected
  dataSetKey
  operationSelected
  responseSelected
  propetiesSelected
  parametersSelected
  feederPropSelected
  transferPropSelected
  serviceSelected
  editModeSeted

  agentSelected
  selectedIndex = 0

  titrePage = "Nouveau Service"
  labelBtnValide = "Créer le service"
  nomService = ""
  @Output() editMode = new EventEmitter();
  @Output() cancelMode = new EventEmitter();


  serviceGroup : FormGroup
  apiOpGroup : FormGroup
  propertiesGroup: FormGroup
  parametersFroup: FormGroup
  transfertsGroup: FormGroup
  keysRulesGroup : FormGroup
  feedersGroup : FormGroup

  methodOperations = []
  formatResponse = []
  paramTypeFormat;
  optionsParam = []
  listParameters = []
  transfProSource = []
  transfProFormat
  listeTransfProp = []
  checkValue = {isKey: false, isUnique: false, isFeeder: false}
  listeKey = []
  listRulesKeys = []
  listFeeders = []
  modeSelected = "json"
  themeSelected = "monokai"
  textFeederValue: string = '[{ "fileKey":"", "baliseResponse" :"" }]'
  tabObjectFeeder = "un tableau d'objet [{fileKey: '', baliseResponse : ''}] dont : 'fileKey' : La clé dans le fichier de donnée. 'baliseResponse' : le champ à modifier dans le template response."

  leServiceACreer

  @ViewChild('stepper') stepper : MatStepper; 


  constructor(private _formBuilder: FormBuilder, public backendService: BackendService , 
    public functionService: FunctionService ) {

  }

  ngOnInit() {

    this.serviceGroup = this._formBuilder.group({
      appnameCtrl: ['', Validators.required],
      servicenameCtrl: ['', Validators.required],
      versionCtrl: ['0', Validators.required]
    });

    this.apiOpGroup = this._formBuilder.group({
      apiopCtrl: ['default', Validators.required ],
      urlCtrl: ['/', Validators.required],
      methodCtrl: ['', Validators.required]
    });

    this.propertiesGroup = this._formBuilder.group({
      tmpresCtrl: ['0', Validators.required ],
      formatCtrl: ['', Validators.required]
    });

    this.parametersFroup = this._formBuilder.group({
      nameparamCtrl: [''],
      typeparamCtrl: [''],
      arg1paramCtrl: [''],
      arg2paramCtrl: ['']
    });

    this.transfertsGroup = this._formBuilder.group({
      tpnameCtrl: [''],
      tpsourceCtrl: [''],
      tpargCtrl: [''],
      tpiskeyCtrl: [],
      tptemplateCtrl: [],
      tpisuniqCtrl: [],
      tpvalueCtrl: [],
      tpisfeederCtrl: [],
      tpfeedervalueCtrl: []
    });

    this.keysRulesGroup = this._formBuilder.group({
      regleCtrl: [''],
      targetCtrl: ['']
    });

    this.feedersGroup = this._formBuilder.group({
      csvFileCtrl: [''],
      valueCtrl: [''],
      typeCtrl: ['xml'],
      isRandomCtrl: ['0']
    });



    //Async method
    of( this.functionService.getMethods() ).subscribe(methods => {
      this.methodOperations = methods
      this.apiOpGroup.patchValue({methodCtrl: this.methodOperations[0].name})
    })

    of( this.functionService.getFormatResponse() ).subscribe(formats => {
      this.formatResponse = formats
      this.propertiesGroup.patchValue( {formatCtrl : this.formatResponse[0].name } )
    })

    of( this.functionService.getParamType() ).subscribe(type  => {
      this.optionsParam = type
      this.parametersFroup.patchValue( {typeparamCtrl : this.optionsParam[0].name } )
      this.paramTypeFormat = this.functionService.setParamTypeFormat( 'DATE' )
    })

    of( this.functionService.getSourceTP() ).subscribe(tps => {
      this.transfProSource = tps
      this.transfertsGroup.patchValue( {tpsourceCtrl: this.transfProSource[0].name } )
      this.setSourceFormat( 'BODY_XPATH' )
    })

    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if(event.selectedStep.ariaLabel == "Services") {
        this.nomService = this.serviceGroup.controls['appnameCtrl'].value + "_" + this.serviceGroup.controls['servicenameCtrl'].value + "_v" + this.serviceGroup.controls['versionCtrl'].value
      }
    })

  }


  ngAfterContentInit() {
    
    if( this.editModeSeted.mode == "updateService" || this.editModeSeted.mode == "addApi"  ){
      this.initInputService()
    }

  }

  ngAfterViewInit(){
    if( this.editModeSeted.mode == "addApi" ){
      setTimeout(() => {
        this.stepper.selected.completed = true
        this.stepper.selectedIndex = 1
      })
    }/*else if( this.editModeSeted.mode == "addTransfer" ){ || this.editModeSeted.mode == "addTransfer"
      setTimeout(() => {
        this.stepper.selectedIndex = 1
        this.stepper.next()
        this.stepper.next()
        this.stepper.next()
      })
    }*/
  }

  /***************************************** Paramètres  */
  selectTypeChangeHandler( event : any ){
    this.paramTypeFormat = this.functionService.setParamTypeFormat( event.target.value )
  }

  addParam() {

    if( this.parametersFroup.dirty && this.parametersFroup.valid ){

      if( this.parametersFroup.controls['nameparamCtrl'].value == "" || this.parametersFroup.controls['arg1paramCtrl'].value == ""){
        this.backendService.errorsmsg( "Les champs name et arg sont obligatoires !" )
        return
      }
    
      let parameter = {
        idParam: this.listParameters.length + 1 ,
        name: this.parametersFroup.controls['nameparamCtrl'].value,
        type: this.parametersFroup.controls['typeparamCtrl'].value,
        arg: this.parametersFroup.controls['arg1paramCtrl'].value,
        arg2: this.parametersFroup.controls['arg2paramCtrl'].value
      }
      //Vérifier doubln avant d'ajouter 
      for( var id in this.listParameters ){
        if(this.listParameters[id].name == parameter.name){
          this.backendService.toastrwaring( "Param " + parameter.name + " existe déjà !")
          return
        }
      }
      this.listParameters.push(parameter)

      this.parametersFroup.patchValue( {
        typeparamCtrl: this.optionsParam[0].name,
        nameparamCtrl: '',
        arg1paramCtrl: '',
        arg2paramCtrl: ''
      } )
      this.paramTypeFormat = this.functionService.setParamTypeFormat( 'DATE' )

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
    
  }

  deleteParam(param){
    this.listParameters = this.functionService.RemoveNodeInArrayProp(param, this.listParameters )
  }
  /***************************************** Paramètres  */

  /***************************************** Transferts  */
  setSourceFormat(sourceValue){
    this.transfProFormat = this.functionService.getSourseFormat(sourceValue);
  }

  selectSourceChangeHandler( event : any ){
    this.setSourceFormat( event.target.value )
  }

  checkValueIsUnique( event : any  ) {
    this.checkValue.isUnique = event.target.checked 
  }

  checkValueIsKey( event : any  ) {
    this.checkValue.isKey = event.target.checked 
  }

  checkValueIsFeeder( event : any  ) {
    this.checkValue.isFeeder = event.target.checked 
  }

  addTransfert(){

    if( this.transfertsGroup.dirty && this.transfertsGroup.valid ){

      if( this.transfertsGroup.controls['tpnameCtrl'].value == "" || this.transfertsGroup.controls['tpargCtrl'].value == ""){
        this.backendService.errorsmsg( "Les champs name et arg sont obligatoires !" )
        return
      }

      let transfert = {
        idTrans: this.listeTransfProp.length + 1 ,
        name: this.transfertsGroup.controls['tpnameCtrl'].value,
        source: this.transfertsGroup.controls['tpsourceCtrl'].value,
        path: this.transfertsGroup.controls['tpargCtrl'].value,
        isKey: this.transfertsGroup.controls['tpiskeyCtrl'].value,
        template: this.transfertsGroup.controls['tptemplateCtrl'].value,
        isUnique: this.transfertsGroup.controls['tpisuniqCtrl'].value,
        value: this.transfertsGroup.controls['tpvalueCtrl'].value,
        isFeeder: this.transfertsGroup.controls['tpisfeederCtrl'].value,
        feederName: this.transfertsGroup.controls['tpfeedervalueCtrl'].value
      }

      //Vérifier doubln avant d'ajouter 
      for( var id in this.listeTransfProp ){
        if(this.listeTransfProp[id].name == transfert.name){
          this.backendService.toastrwaring( "Ce Tp" + transfert.name + " existe déjà !")
          return
        }
      }
      this.listeTransfProp.push(transfert)

      //Liste des clé  listeKey
      if( this.transfertsGroup.controls['tpiskeyCtrl'].value ) {
        let key = {
          idKey : this.listeKey.length + 1,
          idTrans: this.listeTransfProp.length + 1,
          name: this.transfertsGroup.controls['tpnameCtrl'].value
        }
        this.listeKey.push(key)
      }

      this.transfertsGroup.patchValue( {
        tpsourceCtrl: this.transfProSource[0].name,
        tpargCtrl: '',
        tptemplateCtrl: '',
        tpvalueCtrl: '',
        tpiskeyCtrl: '',
        tpisuniqCtrl: '',
        tpnameCtrl: '',
        tpisfeederCtrl: '',
        tpfeedervalueCtrl: ''
      } )
      this.setSourceFormat( 'BODY_XPATH' )
      this.checkValue.isFeeder = false;
      this.checkValue.isKey = false
      this.checkValue.isUnique = false


    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }

  }

  deleteTransfPro(tps){
    this.listeTransfProp = this.functionService.RemoveNodeInArrayTps(tps, this.listeTransfProp )
    this.listeKey = this.functionService.RemoveNodeInArrayKey(tps, this.listeKey )
  }
  
  /***************************************** Transferts  */


  /***************************************** Création de règles  */

  addRules(){

    if( this.keysRulesGroup.dirty && this.keysRulesGroup.valid ){

      if( this.keysRulesGroup.controls['regleCtrl'].value == "" || this.keysRulesGroup.controls['targetCtrl'].value == ""){
        this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
        return
      }

      let regle = {
        idRules: this.listRulesKeys.length + 1,
        regle: this.keysRulesGroup.controls['regleCtrl'].value,
        target: this.keysRulesGroup.controls['targetCtrl'].value
      }

      //Vérifier doubln avant d'ajouter 
      for( var id in this.listRulesKeys ){
        if(this.listRulesKeys[id].regle == regle.regle){
          this.backendService.toastrwaring( "La règle " + regle.regle + " existe déjà !")
          return
        }
      }
      this.listRulesKeys.push(regle)
      this.keysRulesGroup.patchValue( {
        regleCtrl: '',
        targetCtrl: ''
      } )

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
  }
  
  deleteRules(rule){
    this.listRulesKeys = this.functionService.RemoveNodeInArrayRules(rule, this.listRulesKeys )
  }

  reorderKey(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.listeKey, event.previousIndex, event.currentIndex);
  }

  /***************************************** Création de règles  */

  /***************************************** Feeder properties  */
  addFeeder(){
    if( this.feedersGroup.dirty && this.feedersGroup.valid ){

      if( this.feedersGroup.controls['csvFileCtrl'].value == "" || this.feedersGroup.controls['valueCtrl'].value == ""){
        this.backendService.errorsmsg( "Les champs csvFile et value sont obligatoires !" )
        return
      }

      let feeder = {
        idFeeder: this.listFeeders.length + 1,
        csvFile: this.feedersGroup.controls['csvFileCtrl'].value,
        type: this.feedersGroup.controls['typeCtrl'].value,
        value: JSON.parse( this.feedersGroup.controls['valueCtrl'].value),
        isRandom: this.feedersGroup.controls['isRandomCtrl'].value
      }

      //Vérifier doubln avant d'ajouter 
      for( var id in this.listFeeders ){
        if(this.listFeeders[id].csvFile == feeder.csvFile){
          this.backendService.toastrwaring( "Le Feeder " + feeder.csvFile + " existe déjà !")
          return
        }
      }
      this.listFeeders.push(feeder)
      this.feedersGroup.patchValue( {
        isRandomCtrl: '0',
        valueCtrl: '',
        typeCtrl: 'xml',
        csvFileCtrl: ''
      } )

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }

  }

  deleteFeeder(feeder){
    this.listFeeders = this.functionService.RemoveNodeInArrayFeeder(feeder, this.listFeeders )
  }

  onChangeValueFeeder(feeder){
    this.feedersGroup.patchValue({valueCtrl: feeder})
  }

  /***************************************** Feeder properties  */


  /**
   * Extract detail service ==> basepath
  */
  extractData(){
    return {
      appName: this.serviceSelected.basepath.split('_')[0],
      serviceName: this.serviceSelected.basepath.split('_')[1],
      serviceVersion: this.serviceSelected.basepath.split('_')[2].substring(1)
    };
  }


  /**
   * Initialisation des champs pour la modification du service
  */
  initInputService(){
    //Service
    this.serviceGroup.patchValue({
      appnameCtrl: this.extractData().appName,
      servicenameCtrl: this.extractData().serviceName,
      versionCtrl: this.extractData().serviceVersion
    })
    this.nomService = this.extractData().appName + "_" + this.extractData().serviceName + "_v" + this.extractData().serviceVersion
    
  }

  

  /**
   * 
  */
 @Input()
 set editModeSet(name) {
   this.editModeSeted = name;
    if( name.mode == "createService") {
      this.titrePage = "Nouveau Service"
      this.labelBtnValide = "Créer le service"
    }else if(name.mode == "addApi"){
      this.titrePage = "Nouvel API"
      this.labelBtnValide = "Créer l'API"
    }else {
      this.titrePage = "Mise à jour Service"
      this.labelBtnValide = "Créer le service"
    }
 }

  @Input()
  set templateSelect(name) {
    this.templateSelected = name;
  }
  @Input()
  set detailParameter(name) {
    this.detailParameterSelected = name;
  }

  @Input()
  set dataSetKeySelect(name) {
    this.dataSetKey = name;
  }

  @Input()
  set dataSetsSelect(name) {
    this.dataSetsSelected = name;
  }

  @Input()
  set propetiesSelect(name) {
    this.propetiesSelected = name;
  }

  @Input()
  set responseSelect(name) {
    this.responseSelected = name;
  }

  @Input()
  set parametersSelect(name) {
    this.parametersSelected = name;
  }

  @Input()
  set feederPropSelect(name) {
    this.feederPropSelected = name;
  }

  @Input()
  set transferPropSelect(name) {
    this.transferPropSelected = name;
  }

  @Input()
  set operationSelect(name) {
    this.operationSelected = name;
  }

  @Input()
  set serviceSelect(name) {
    this.serviceSelected = name;
  }

  @Input()
  set agentSelect(name) {
    this.agentSelected = name;
  }

  /**
   * Quitter le mode édition
   * @param type_cancel 
   */
  canclelMode(type_cancel?){
    this.editMode.emit( {}) 
    if( type_cancel )
      this.cancelMode.emit( {type: type_cancel} )
    
  }




  /***************************************** Terminer  */

  majService(){

    // Création 
    if( this.editModeSeted.mode == "createService" ){
      this.createService()
    }else if( this.editModeSeted.mode == "addApi" ){
      this.addNewApi()
    }

  }

  initService(){

    let api
    let basepath

    api = this.functionService.getNewAPI();
    //step 1 api operation 
    api.name = this.apiOpGroup.controls['apiopCtrl'].value
    api.uri = this.apiOpGroup.controls['urlCtrl'].value
    api.operations[0].method = this.apiOpGroup.controls['methodCtrl'].value
    //step 2 properties
    api.operations[0].responseType = "text/" + this.propertiesGroup.controls['formatCtrl'].value + ";charset=UTF-8"
    api.operations[0].delay = parseInt( this.propertiesGroup.controls['tmpresCtrl'].value )
    //step 3 : paramètres 
    api.operations[0].parameters = this.listParameters
    //step 4 : Transfert properties
    api.operations[0].transferProperties = this.listeTransfProp
    api.operations[0].keys = this.functionService.getListeKey( this.listeKey )
    //Step 5 : RegExp
    api.operations[0].regExpKeys = this.listRulesKeys
    //Step 6 : Feeders
    api.operations[0].feederProperties = this.listFeeders

    if( this.editModeSeted.mode == "createService" ){
      basepath = this.serviceGroup.controls['appnameCtrl'].value + "_" + this.serviceGroup.controls['servicenameCtrl'].value + "_v" + this.serviceGroup.controls['versionCtrl'].value
      //Init service : Service
      this.leServiceACreer = this.functionService.getNewService();
      this.leServiceACreer.basepath = basepath

    }else if( this.editModeSeted.mode == "addApi" ){
      this.leServiceACreer = this.serviceSelected
    }
    this.leServiceACreer.apis.push(api)

  }


  /**
   * Create new service 
  */
  createService(){

    if ( this.serviceGroup.controls['versionCtrl'].value == "" ){
      this.serviceGroup.patchValue( {versionCtrl: '0'} )
    }
    this.initService();

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port
    let url = agentUrl + "/" + this.leServiceACreer.basepath
    this.backendService.postData( url , this.leServiceACreer )
    .then(resultatRequest => {
      this.backendService.successmsg( "Service [" + this.leServiceACreer.basepath + "] créé" )
      this.canclelMode("reload")
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }
  
  /**
   * Rename service 
  */
  updateNameService(){

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port
    let newBasepath  = this.serviceGroup.controls['appnameCtrl'].value + "_" + this.serviceGroup.controls['servicenameCtrl'].value + "_v" + this.serviceGroup.controls['versionCtrl'].value
    let basepath = `${this.extractData().appName}_${this.extractData().serviceName}_v${this.extractData().serviceVersion}`

    if( basepath == newBasepath ) {
      this.canclelMode("notreload")
    } else {

      let url = agentUrl + "/" + basepath
      let destSrv = {basepath: newBasepath}
      this.backendService.postData( url , destSrv )
      .then(resultatRequest => {
        this.backendService.successmsg( "Service [" + basepath + "] modifié" )
        this.canclelMode("reload")
      })
      .catch(error => {
        this.backendService.errorsmsg( error.message )
      })

    }

  }
  

  /**
   * Add a neww api
   */
  addNewApi(){

    let apiNames = this.serviceSelected.apis.map(function(val) { return val.name })
    if(apiNames.includes( this.apiOpGroup.controls['apiopCtrl'].value ) ){
      this.backendService.errorsmsg( `API ${this.apiOpGroup.controls['apiopCtrl'].value} existe déjà` )
      return
    }

    let apiUrls = this.serviceSelected.apis.map(function(val) { return val.uri })
    if(apiUrls.includes( this.apiOpGroup.controls['urlCtrl'].value ) ){
      this.backendService.errorsmsg( `API URL ${this.apiOpGroup.controls['urlCtrl'].value} existe déjà` )
      return
    }

    //Init service : Service
    this.initService();

    let agentUrl = "http://" + this.agentSelected.hostname + ":" + this.agentSelected.admin_port + '/'
    let url = `${agentUrl}${this.leServiceACreer.basepath}/new/${this.apiOpGroup.controls['apiopCtrl'].value}`
    this.backendService.postData( url , this.leServiceACreer )
    .then(resultatRequest => {
      this.backendService.successmsg( "API [" + this.apiOpGroup.controls['apiopCtrl'].value + "] créée" )
      this.canclelMode("reload")
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }

  /***************************************** Terminer  */




}
