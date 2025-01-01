import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../User/Services/question.service';
import { questionDTO } from '../../User/Models/question.model';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-question-client-detail',
  standalone: true,
    imports: [CardModule,
      DatePipe, 
      MarkdownComponent,
      FormsModule,
      ],
  templateUrl: './question-client-detail.component.html',
  styleUrl: './question-client-detail.component.scss',
})
export class QuestionClientDetailComponent implements OnInit {
  questionId: string = '';
  dataQuestion?:questionDTO;
  private route = inject(ActivatedRoute);
  private questionService = inject(QuestionService);

  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('id')!;
     this.questionService.getQuestionById(this.questionId).subscribe(res => {
      this.dataQuestion = res
      console.log(this.dataQuestion)
     })
  }
}
