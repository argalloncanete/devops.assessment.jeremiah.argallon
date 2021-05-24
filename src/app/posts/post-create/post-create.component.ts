import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
@Injectable()
export class PostCreateComponent implements OnInit {
  post: Post;
  form: FormGroup;
  added = false;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      ordName: new FormControl(null, { validators: [Validators.required] }),
      ordPrice: new FormControl(null, { validators: [Validators.required] }),
      discounted: new FormControl(false),
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      console.log('invalid');
      return;
    }
    this.postsService.addPost(
      this.form.value.ordName,
      this.form.value.ordPrice,
      this.form.value.discounted
    );
    this.postsService.nextAddSubject((this.added = true));
    this.form.reset();
  }

  onAdded() {
    return this.added;
  }
}
