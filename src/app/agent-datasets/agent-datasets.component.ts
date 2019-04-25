import { Component, OnInit , Input , EventEmitter , Output } from '@angular/core';

@Component({
  selector: 'app-agent-datasets',
  templateUrl: './agent-datasets.component.html',
  styleUrls: ['./agent-datasets.component.scss']
})
export class AgentDatasetsComponent implements OnInit {

  dataSetsSelected
  dtsetSelected
  @Output() dtsSelecte = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  /**
   * Sélection d'un dataset 
   */
  @Input()
  set dataSetsSelect(name) {

    console.log( "dataSetsSelect page", name)
    if(name != -1 && name != 1) {
      this.dataSetsSelected = name;
      this.dtsetSelected = this.dataSetsSelected[0]
    }
  }


  /**
   * A chaque sélection d'un dataset
   * @param dts 
   */
  onSelectDataset(  dataset ){
    console.log( "onSelectDataset" , dataset )
    this.dtsetSelected = dataset
    this.dtsSelecte.emit( this.dtsetSelected )

  }



}
