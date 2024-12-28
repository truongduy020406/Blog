import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Editor, EditorModule } from 'primeng/editor';
@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent implements OnInit {
  formGroup!: FormGroup ;

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl()
        });
    }
}
