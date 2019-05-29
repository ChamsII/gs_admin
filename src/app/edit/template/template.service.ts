import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { TemplateComponent } from './template.component';

@Injectable()
export class TemplateService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    serviceSelect,
    apiSelect,
    opSelect,
    templateSelected,
    dataSetsDetail,
    datasetKey,
    btnOkText = 'Valider',
    btnCancelText = 'Quitter') {
    const modalRef = this.modalService.open(TemplateComponent, { size: 'lg' });
    modalRef.componentInstance.serviceSelect = serviceSelect;
    modalRef.componentInstance.apiSelect = apiSelect;
    modalRef.componentInstance.opSelect = opSelect;
    modalRef.componentInstance.templateSelected = templateSelected;
    modalRef.componentInstance.dataSetsDetail = dataSetsDetail;
    modalRef.componentInstance.datasetKey = datasetKey;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}