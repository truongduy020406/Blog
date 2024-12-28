import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  standalone:true,
  imports:[CommonModule]
})
export class ValidationMessageComponent implements OnInit {
  @Input() entityForm!: FormGroup;
  @Input() fieldName!: string;
  @Input() validationMessages: any;
  constructor() { }

  ngOnInit(): void {

  }

}