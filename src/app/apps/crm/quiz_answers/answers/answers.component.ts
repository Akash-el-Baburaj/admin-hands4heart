import { Component, OnInit, TemplateRef } from "@angular/core";

// types
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

import { QuizService } from "src/app/core/service/quiz.service";
import { AdminItem } from "../../quiz/model";
import { CourseService } from "../../services/course.service";
import {
  Course,
  CourseListResponse,
} from "src/app/apps/chat/banner/banner.module";
import { Question } from "./model";

@Component({
  selector: "app-answers",
  templateUrl: "./answers.component.html",
  styleUrls: ["./answers.component.scss"],
})
export class AnswersComponent implements OnInit {


  addQuestionsForm!: FormGroup;
  editQuestionForm!: FormGroup;
  quizData: AdminItem[] = [];
  quiz_title: any;
  quiz_id: any;

  questionsData: Question[] = [];



  pageTitle: BreadcrumbItem[] = [];
  quiz: any;
  questionIndex: any;
  type: string | null = null;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {



    this.pageTitle = [
      { label: "CRM", path: "/" },
      { label: "Clients List", path: "/", active: true },
    ];

    this.quiz_title = localStorage.getItem("quiz_title");
    this.quiz_id = localStorage.getItem("quiz_id");
    this.fetchData(this.quiz_id);



    this.addQuestionsForm = this.fb.group({
      questions: this.fb.array([this.createQuestionGroup()])
    });


  }

  private fetchData(quiz_id:any): void {
  

    this.quizService.getQuestion(this.quiz_id).subscribe({
      next: (response) => {

        console.log("Question list:", response);
       this.questionsData = response.data.questions;

      },
      error: (error) => {
        console.error("Error fetching quiz:", error);
      },
    });

    
  }

  open(content: TemplateRef<NgbModal>, type: string): void {
    this.modalService.open(content, { scrollable: true });
    this.type = type;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      options: this.fb.array([this.createOptionGroup()])
    });
  }

  
  
  createOptionGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false] // Initialize as false
    });
  }

  get questions(): FormArray {
    return this.addQuestionsForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  addOption(questionIndex: number): void {
    this.getOptions(questionIndex).push(this.createOptionGroup());
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number): void {
    const optionsArray = this.getOptions(questionIndex);
    optionsArray.controls.forEach((control, index) => {
      control.get('isCorrect')?.setValue(index === optionIndex);
    });
  }
  resetForm() {
    this.addQuestionsForm.reset();

  }
  onSubmitCreateQuestions(): void {
    if (this.addQuestionsForm.valid) {
      const quizData: any = {
        quizId: this.quiz_id,
        questions: this.addQuestionsForm.value.questions
      };
      console.log(quizData);
     if (this.type === 'add') {
      this.quizService.createQuestion(quizData).subscribe({
        next: (response) => {
          console.log("response of create Question - ", response);
          if (response.success) {
             this.resetForm();
           
          } else {
            console.error("Failed to create Question:", response.success);
          }
        },
        error: (error) => {
          console.error("Error creating Question:", error);
        },
        complete: () => {
           this.fetchData(this.quiz_id);
          console.log("Question created successfully!...");
        },
      });
     } else if (this.type === 'edit') {
      quizData.questionId = ''
      this.quizService.updateQuestion(quizData).subscribe({
        next: (response) => {
          console.log("response of create Question - ", response);
          if (response.success) {
             this.resetForm();
           
          } else {
            console.error("Failed to create Question:", response.success);
          }
        },
        error: (error) => {
          console.error("Error creating Question:", error);
        },
        complete: () => {
           this.fetchData(this.quiz_id);
          console.log("Question created successfully!...");
        },
      });
     }
    }
  }

  openEditModal(content: TemplateRef<NgbModal>, quiz: any, type: string): void {
    this.modalService.open(content, { scrollable: true });
    this.quiz = quiz;
    console.log('quiz==> ', this.quiz)
    this.type = type;
    this.editQuizForm(this.quiz)
    // this.questionIndex = index;
  }

  editQuizForm(data: any) {
    const questionsArray = this.fb.array(
      data.map((question: any) =>
        this.fb.group({
          text: [question.text, Validators.required],
          options: this.fb.array(
            question.options.map((option: any) =>
              this.fb.group({
                text: [option.text, Validators.required],
                isCorrect: [option.isCorrect === 1] // Convert 1/0 to boolean
              })
            )
          )
        })
      )
    );
  
    this.addQuestionsForm.setControl("questions", questionsArray);
    console.log("Updated Form Data:", this.addQuestionsForm.value);
  }
  

  setCorrectAnswerChanges(data: any) {
    switch(data) {
      case 1:
        return true;
      case 0: 
        return false;
      default:
        return false
    }
  }

  

  // addOption(): void {
  //   this.options.push(this.fb.group({
  //     text: ['', Validators.required],
  //     isCorrect: [false]
  //   }));
  // }

  // setCorrectAnswer(optionIndex: number): void {
  //   this.options.controls.forEach((control, index) => {
  //     control.get('isCorrect')?.setValue(index === optionIndex);
  //   });
  // }

  onSubmit(): void {
    if (this.editQuestionForm.valid) {
      const data = this.editQuestionForm.value;
      console.log('data =>>>> ', data)
    }
  }

}
