import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { added } from '../posts/post-create/post-create.component';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  errorApi = false;

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              ordName: post.ordName,
              ordPrice: post.ordPrice,
              id: post._id,
              discounted: post.discounted,
            };
          });
        })
      )
      .pipe(
        catchError((err) => {
          console.log('Order list fetched failed');
          this.errorApi = true;
          return throwError(err);
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addSubject = new Subject<boolean>();

  nextAddSubject(bool: boolean) {
    this.addSubject.next(bool);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      ordName: string;
      ordPrice: string;
      discounted: boolean;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(ordName: string, ordPrice: string, discounted: boolean) {
    const post: Post = {
      id: null,
      ordName: ordName,
      ordPrice: ordPrice,
      discounted: discounted,
    };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .pipe(
        catchError((err) => {
          console.log('Add Order failed');
          this.errorApi = true;
          return throwError(err);
        })
      )
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    ordName: string,
    ordPrice: string,
    discounted: boolean
  ) {
    const post: Post = {
      id: id,
      ordName: ordName,
      ordPrice: ordPrice,
      discounted: discounted,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .pipe(
        catchError((err) => {
          console.log('Update Order failed');
          this.errorApi = true;
          return throwError(err);
        })
      )
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .pipe(
        catchError((err) => {
          console.log('Delete Order failed');
          this.errorApi = true;
          return throwError(err);
        })
      )
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
