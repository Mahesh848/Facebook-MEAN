import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  createRegisterForm(): FormGroup {
    return new FormBuilder().group({
      firstname: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required)
    });
  }

  createLoginForm(): FormGroup {
    return new FormBuilder().group({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  createCommentForm(): FormGroup {
    return new FormBuilder().group({
      comment: new FormControl(null, Validators.required)
    });
  }
  createSearchForm(): FormGroup {
    return new FormBuilder().group({
      search: new FormControl(null, Validators.required)
    });
  }
  createMessageForm(): FormGroup {
    return new FormBuilder().group({
      message: new FormControl(null, Validators.required)
    });
  }
}
