import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'



@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  agentsGenesis
  resultRequest
  agentGeneSisSelect
  lesServices = []

  constructor( public backendService: BackendService , public functionService: FunctionService ,
    private activeModal: NgbActiveModal ) { }

  ngOnInit() {
    this.getAgents();
  }


  getAgents(){

    this.backendService.getAgents()
    .then(agents => {
      this.resultRequest = agents;
      this.agentsGenesis = this.resultRequest.agents
      this.agentGeneSisSelect  = this.agentsGenesis[0]
      this.getServicesAgent()
    })
    .catch(errors => {
    })

  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  selectAgentChangeHandler( event : any ){
    this.agentGeneSisSelect = this.functionService.getAgent(this.agentsGenesis, event.target.value )
    this.getServicesAgent()
  }



  getServicesAgent(){

    let agentUrl = "http://" + this.agentGeneSisSelect.hostname + ":" + this.agentGeneSisSelect.admin_port
    let url =  `${agentUrl}/list?pageNum=1&pageSize=1000&filter=`

    this.backendService.getData( url)
    .then(resultatRequest => {
      
      this.resultRequest = resultatRequest
      if(resultatRequest) {
        this.lesServices = []

          this.resultRequest.page.forEach(element => {
            let url_2 =  agentUrl + "/" + element.value
            this.backendService.getData( url_2 )
            .then(serviceResult => {

              for(var i in serviceResult.apis ){
                let operations = serviceResult.apis[i].operations

                for(var j in operations) {

                  let service = {
                    agent: `http://${this.agentGeneSisSelect.hostname}:${this.agentGeneSisSelect.agent_port}/`,
                    url: `http://${this.agentGeneSisSelect.hostname}:${this.agentGeneSisSelect.agent_port}/${serviceResult.basepath}${serviceResult.apis[i].uri}`,
                    operation: operations[j].method
                  }
                  this.lesServices.push(service)

                }

              }
              
            })
            .catch(error => {
            })
          });

      }

    })
    .catch(error => {
    })

  }

  selectService(service){
    this.activeModal.close({status: true , service: service });
  }



}
