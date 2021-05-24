import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
// import { PostCreateComponent } from '../post-create/post-create.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalBill = '';
  totalDiscountPrice = '';
  totalNotDiscountedPrice = '';
  editForm: FormGroup;

  discountPrices = [];
  notdiscountPrices = [];
  prices = [];
  totals = [];

  totalDiscountedBill: Number;

  editTable = false;

  // for validation
  apiError: boolean;

  added = false;
  deleted = false;
  updated = false;

  details: {
    id: string;
    ordName: string;
    ordPrice: number;
    discounted: boolean;
  };

  // isLoading = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.apiError = this.postsService.errorApi;
    }, 5000);

    this.editForm = new FormGroup({
      id: new FormControl(null),
      ordName: new FormControl(null),
      ordPrice: new FormControl(null),
      discounted: new FormControl(null),
    });

    // this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        //accessing post data
        this.posts = posts;
        // getting the total bill amount
        this.prices = this.posts.map((post) => post.ordPrice);
        this.totalBill = this.prices
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
          .toFixed(2);

        //getting the total discount amount
        this.discountPrices = this.posts.map((post) =>
          post.discounted ? parseFloat(post.ordPrice) * 0.05 : 0
        );
        this.totalDiscountPrice = this.discountPrices
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
          .toFixed(2);
        // console.log(this.totalDiscountPrice);

        //getting the total discount amount
        this.notdiscountPrices = this.posts.map((post) =>
          !post.discounted ? parseFloat(post.ordPrice) : 0
        );
        this.totalNotDiscountedPrice = this.notdiscountPrices
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
          .toFixed(2);
        // console.log(this.totalNotDiscountedPrice);

        this.totals = [this.totalDiscountPrice, this.totalBill];

        //total Discounted Bill:
        this.totalDiscountedBill = this.totals
          .reduce(function (totalBill, totalDiscountPrice) {
            return parseFloat(totalDiscountPrice) - parseFloat(totalBill);
          }, 0)
          .toFixed(2);
        // this.totalDiscountedBill =
        //   parseFloat(this.totalBill) - parseFloat(this.totalDiscountPrice);

        // console.log(this.totalDiscountedBill);
      });

    this.postsService.addSubject.subscribe((response) => {
      this.added = response;
      setTimeout(() => {
        this.added = false;
      }, 3000);
    });
  }

  onEdit(data) {
    this.editTable = true;
    this.details = data;
    this.editForm = new FormGroup({
      id: new FormControl(this.details.id),
      ordName: new FormControl(this.details.ordName),
      ordPrice: new FormControl(this.details.ordPrice),
      discounted: new FormControl(this.details.discounted),
    });
    // console.log(this.details);
  }

  onUpdate() {
    this.apiError;
    this.postsService.updatePost(
      this.details.id,
      this.editForm.value.ordName,
      this.editForm.value.ordPrice,
      this.editForm.value.discounted
    );
    this.updated = true;
    this.editTable = false;
    setTimeout(() => {
      this.updated = false;
    }, 2000);
  }
  onCancel() {
    this.editTable = false;
  }

  onDelete(postId: string) {
    this.apiError;
    this.postsService.deletePost(postId);
    this.deleted = true;
    setTimeout(() => {
      this.deleted = false;
    }, 2000);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onAdded() {
    this.added = false;
  }
  onUpdated() {
    this.updated = false;
  }
  onDeleted() {
    this.deleted = false;
  }
  onAPIClose() {
    this.apiError = false;
  }
}
