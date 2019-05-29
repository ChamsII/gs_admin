import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { AgentComponent } from './agent.component';

@Injectable()
export class AgentService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    etatOpen,
    totalAgent,
    btnOkText = 'Valider',
    btnCancelText = 'Quitter',
    dialogSize: 'sm'|'lg' = 'lg') {
    const modalRef = this.modalService.open(AgentComponent, { size: dialogSize });
    modalRef.componentInstance.etatOpen = etatOpen;
    modalRef.componentInstance.totalAgent = totalAgent;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}