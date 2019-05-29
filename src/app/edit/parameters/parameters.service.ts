import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { ParametersComponent } from './parameters.component';

@Injectable()
export class ParametersService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    serviceSelect,
    apiSelect,
    opSelect,
    etatOpen,
    prmsSelect,
    btnOkText = 'Valider',
    btnCancelText = 'Quitter',
    dialogSize: 'sm'|'lg' = 'lg') {
    const modalRef = this.modalService.open(ParametersComponent, { size: dialogSize });
    modalRef.componentInstance.serviceSelect = serviceSelect;
    modalRef.componentInstance.apiSelect = apiSelect;
    modalRef.componentInstance.opSelect = opSelect;
    modalRef.componentInstance.etatOpen = etatOpen;
    modalRef.componentInstance.prmsSelect = prmsSelect;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}