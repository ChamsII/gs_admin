import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { DetailsComponent } from './details.component';

@Injectable()
export class DetailsService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    serviceSelect,
    apiSelect,
    detailsSelect,
    dataSetSelect,
    btnOkText = 'Valider',
    btnCancelText = 'Quitter',
    dialogSize: 'sm'|'lg' = 'lg') {
    const modalRef = this.modalService.open(DetailsComponent, { size: dialogSize });
    modalRef.componentInstance.serviceSelect = serviceSelect;
    modalRef.componentInstance.apiSelect = apiSelect;
    modalRef.componentInstance.detailsSelect = detailsSelect;
    modalRef.componentInstance.dataSetSelect = dataSetSelect;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}