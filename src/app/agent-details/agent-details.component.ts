import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss']
})
export class AgentDetailsComponent implements OnInit {

  dataSetsSelected
  dataSetKey

  constructor() { }

  ngOnInit() {
  }

  /**
   * Sélection d'un dataset 
   */
  @Input()
  set dataSetsSelect(name) {
    console.log( "dataSetsSelect page", name)
    this.dataSetsSelected = name;
  }

  @Input()
  set dataSetKeySelect(name) {
    console.log( "dataSetKeySelect page", name)
    this.dataSetKey = name;
  }


}
