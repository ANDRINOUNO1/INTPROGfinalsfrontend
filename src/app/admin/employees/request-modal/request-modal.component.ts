import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first, switchMap } from 'rxjs/operators';
import { EmployeeService } from '@app/_services/employee.service';
import { DepartmentService } from '@app/_services/department.service';
import { AlertService } from '@app/_services/alert.service';
import { Employee } from '@app/_models/employee';
import { Department } from '@app/_models/department';

@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.css']
})
export class RequestModalComponent implements OnInit {
  @Input() data: any = {};
  @Output() saveRequest = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      status: ['Pending', Validators.required],
      description: [''],
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        employeeId: this.data.employeeId || '',
        status: this.data.status || 'pending',
        description: this.data.description || ''
      });

      if (this.data.items?.length) {
        const itemControls = this.data.items.map((item: any) => this.createItem(item));
        this.form.setControl('items', this.fb.array(itemControls));
      }
    }
  }

  createItem(item: any = { itemName: '', quantity: 1 }): FormGroup {
    return this.fb.group({
      itemName: [item.itemName, Validators.required],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  save() {
    if (this.form.valid) {
      this.saveRequest.emit(this.form.value);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
