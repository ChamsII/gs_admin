import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import {NewfilefeederComponent } from './newfilefeeder.component';

@Injectable()
export class NewfilefeederService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    btnOkText = 'Valider',
    btnCancelText = 'Quitter',
    dialogSize: 'sm'|'lg' = 'lg') {
    const modalRef = this.modalService.open(NewfilefeederComponent, { size: dialogSize });
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}