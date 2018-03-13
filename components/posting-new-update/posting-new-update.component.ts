import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxCarousel } from 'ngx-carousel';
require('aws-sdk');

import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { PostService } from './../../services/post.service';
import { SearchService } from './../../services/search.service';

import { Post } from './../../interfaces/post';
import { Tag } from './../../interfaces/tag';

@Component({
  selector: 'app-posting-new-update',
  templateUrl: './posting-new-update.component.html',
  styleUrls: ['./posting-new-update.component.css']
})

export class PostingNewUpdateComponent implements OnInit {
	isEditing: boolean;
	isAddtags: boolean;
	isPostingWithTags: boolean;
	isAddMoreTags: boolean;
  isServiceProvider: boolean;
  form   : FormGroup;
  medias: { fileName: string, mediaType: string }[];
  tags: Tag[];
  public carouselOne: NgxCarousel;

  public avaimg: string;

  makeid(text = '') {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  fileEvent(fileInput:any) {
    const vm = this;
    let AWSService = window.AWS;
    let file = fileInput.target.files[0];
    const onlyName = file.name.split("."); 
    AWSService.config.accessKeyId = 'AKIAIGALHANVPEWURBJA';
    AWSService.config.secretAccessKey = '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';
    onlyName[0] = this.makeid(onlyName[0]);
    let bucket = new AWSService.S3({params: {Bucket: 'pointters_dev/dev'}});
    let params = {Key: onlyName[0] + '.' + onlyName[1] , Body: file};
    bucket.upload(params, function(error, res) {
      console.log('error', error);
      console.log('response', res);
      vm.isEditing = true;
      vm.avaimg = res.Location;
      if (vm.isImage(res.Location)) {
        vm.medias.push({
          mediaType: 'image',
          fileName: res.Location
        });
      } else if (vm.isVideo(res.Location)) {
        vm.medias.push({
          mediaType: 'video',
          fileName: res.Location
        });
      }
    });
  }
	

  constructor(
    private authService: AuthService,
    public userService: UserService,
    private postService: PostService,
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  	this.isEditing = false;
  	this.isAddtags = true;
  	this.isPostingWithTags = false;
  	this.isAddMoreTags = false;
    
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 2,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    };

    this.medias = [];
    this.tags = [];
  }

  public myfunc(event: Event) {
     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel
  }

  onClickPost(): void {
    const data: Post = {
      message: "Check out this dog walk service",
      media: this.medias,
      tags: []
    };
    console.log(data);
    this.postService.createPost(data);
  }

  onCickRemoveImage(index) {
    this.medias.splice(index, 1);
  }

  clickNewUpdate(): void {
  	this.isEditing = true;
  }

  clickCancelUpdate(): void {
  	this.ngOnInit();
  }

  clickAddTags(): void {
  	this.isAddtags = false;
  	this.isPostingWithTags = true;

    this.searchService.tags('firstName:service OR lastName:service OR description:service')
      .subscribe((res: { hits: { hits: Tag[] } }) => {
        this.tags = res.hits.hits;
      });
  }

  clickServiceProvider(): void {
  	this.isPostingWithTags = false;
  	this.isAddMoreTags = true;
  }

  cancelAddMoreTags(): void {
  	this.isPostingWithTags = true;
  	this.isAddMoreTags = false;	
  }

  defaultTagOption(): void {
  	this.isPostingWithTags = false;
  	this.isAddtags = true;
  }

  getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      return true;
    }
    return false;
  }

  isVideo(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true;
    }
    return false;
  }

}
