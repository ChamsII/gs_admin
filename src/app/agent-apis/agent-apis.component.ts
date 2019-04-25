import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-agent-apis',
  templateUrl: './agent-apis.component.html',
  styleUrls: ['./agent-apis.component.scss']
})
export class AgentApisComponent implements OnInit {

  serviceSelected
  apiSelected
  @Output() apiSelecte = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Sélection d'un agent 
   */
  @Input()
  set serviceSelect(name) {

    console.log( "serviceSelect ", name)
    if(name != -1 && name != 1) {
      this.serviceSelected = name;
      this.apiSelected = this.serviceSelected.apis[0]
      this.apiSelecte.emit(this.apiSelected);
    }

    //  if( this.agentSelected )
    //  this.displayPage()
  }



  onSelectApi(api) {
    this.apiSelected = api
    this.apiSelecte.emit(this.apiSelected); //operations
  }


  editApi(api){
    console.log("edit ", api)
  }

  deleteApi(api){
    console.log("delete ", api)
  }


}
