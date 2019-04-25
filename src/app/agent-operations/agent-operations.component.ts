import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-agent-operations',
  templateUrl: './agent-operations.component.html',
  styleUrls: ['./agent-operations.component.scss']
})
export class AgentOperationsComponent implements OnInit {

  apiSelectedOperations
  operationSelected
  @Output() opSelecte = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  @Input()
  set apiSelect(name) {

    console.log( "apiSelect ", name)
    if(name != -1 && name != 1) {
      this.apiSelectedOperations = name;
      this.operationSelected = this.apiSelectedOperations[0]
      this.opSelecte.emit(this.operationSelected);
    }

  }

  onSelectOperation(operation){
    console.log("******** operation ", operation)
    this.operationSelected = operation
    this.opSelecte.emit(this.operationSelected);
  }

}
