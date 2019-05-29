import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { DatasetsComponent } from './datasets.component';

@Injectable()
export class DatasetsService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    serviceSelect,
    apiSelect,
    dataSetsSelected,
    etatOpen,
    dataSelect,
    btnOkText = 'Valider',
    btnCancelText = 'Quitter',
    dialogSize: 'sm'|'lg' = 'lg') {
    const modalRef = this.modalService.open(DatasetsComponent, { size: dialogSize });
    modalRef.componentInstance.serviceSelect = serviceSelect;
    modalRef.componentInstance.apiSelect = apiSelect;
    modalRef.componentInstance.dataSetsSelected = dataSetsSelected;
    modalRef.componentInstance.etatOpen = etatOpen;
    modalRef.componentInstance.dataSelect = dataSelect;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}