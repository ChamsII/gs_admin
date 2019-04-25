import { Component, OnInit , Input , ViewChild } from '@angular/core';


import 'brace';
import 'brace/mode/xml';
import 'brace/theme/monokai';
import 'brace/mode/json';


@Component({
  selector: 'app-agent-template',
  templateUrl: './agent-template.component.html',
  styleUrls: ['./agent-template.component.scss']
})
export class AgentTemplateComponent implements OnInit {

  templateSelected : string = ""
  modeSelected = "xml"
  themeSelected = "monokai"



  constructor() { }

  ngOnInit() {
  }

  /**
   * Sélection d'un dataset 
   */
  @Input()
  set templateSelect(name) {
    console.log( "templateSelect page", name)
    this.templateSelected = name;
  }

  onChange(code) {
      console.log("new code", code);
  }




}
