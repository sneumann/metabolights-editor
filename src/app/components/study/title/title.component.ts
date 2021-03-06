import { Component, OnInit, Input, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { IAppState } from '../../../store';
import { NgRedux, select } from '@angular-redux/store';
import { EditorService } from '../../../services/editor.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidateStudyTitle } from './title.validator';
import * as toastr from 'toastr';

@Component({
  selector: 'mtbls-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  @select(state => state.study.title) studyTitle;
  @select(state => state.study.validations) studyValidations: any

  title: string = '';
  validations: any;
  form: FormGroup;
  isFormBusy: boolean = false;

  validationsId = 'title';

  isModalOpen: boolean = false;

  constructor( private fb: FormBuilder, private editorService: EditorService, private ngRedux: NgRedux<IAppState>) { 
    this.studyTitle.subscribe(value => { 
      if(value == ''){
        this.title = 'Please add your study title here';
      }else{
        this.title = value;  
      }
    });
    this.studyValidations.subscribe(value => { 
      this.validations = value;
    });
  }

  ngOnInit() {
  }

  openModal() {
    this.initialiseForm()
    this.isModalOpen = true
  }

  initialiseForm() {
    this.isFormBusy = false;
    this.form = this.fb.group({
      title:  [ this.title, ValidateStudyTitle(this.validation)]
    });
  }

  closeModal() {
    this.isModalOpen = false
  }

  save() {
    this.isFormBusy = true;
    this.editorService.saveTitle(this.compileBody(this.form.get('title').value)).subscribe( res => {
      this.form.get('title').setValue(res.title)
      this.form.markAsPristine()
      this.isFormBusy = false;
      toastr.success('Title updated.', "Success", {
        "timeOut": "2500",
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "extendedTimeOut": 0,
        "tapToDismiss": false
      })
    }, err => {
      this.isFormBusy = false
    });
  }

  compileBody(title) {
    return {
      'title': title,
    }
  }

  get validation() {
    return this.validations[this.validationsId];
  }
}
