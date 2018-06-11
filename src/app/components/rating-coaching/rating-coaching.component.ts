import {Component, OnDestroy, OnInit,Inject} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {CoachingService} from "../../services/coaching.service";
import {EventService} from "../../services/event.service";
import {Paginable} from "../../class/Paginable";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {SwiperEventListComponent} from "../swiper-event-list/swiper-event-list.component";
import {AddLocationComponent} from "../add-location/add-location.component";
import {ManageFriendsService} from "../../services/manage-friends.service";
import {Router} from "@angular/router";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'app-rating-coaching',
  templateUrl: './rating-coaching.component.html',
  styleUrls: ['./rating-coaching.component.css']
})
export class RatingCoachingComponent implements OnInit {

  public user: User;
  public isLoggedUser: boolean;
  private sub: Subscription;
  ratinglist: Array<Object>;
  totalScore: number;
  score ;
  buff ;
  list = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private dialog: MdDialog,
              private commentService:CommentService, @Inject(MD_DIALOG_DATA) public userinfo: any,
              private eventService: EventService,private router:Router, private coachingService: CoachingService) { }

  ngOnInit() {
    console.log("titi");
    console.log(this.userinfo.userId);
    //console.log("titi");
    this.commentService.get_eval(this.userinfo.userId.id).subscribe(data =>{this.ratinglist = data;});
    this.score = this.userinfo.score;
    this.totalScore = this.userinfo.score;
  }

  getEval(){
    console.log(this.userinfo);

      this.commentService.get_eval(this.userinfo.userId.id).subscribe(data =>{this.ratinglist = data;});
    console.log(this.ratinglist );
      this.score = null;
      var count = 0;
      /*Object.keys(this.ratinglist).forEach(key => {
          this.score += this.ratinglist[key].note;
      });*/
      //console.log(this.score);
      for (let i = 0; i < this.ratinglist.length; i++) {
        count++;
        this.score  +=  this.ratinglist[i]["note"];
      }
      this.score /= count;
      console.log(this.score);
      this.totalScore = this.score;
    /*else{
      this.commentService.get_eval(this.score2).subscribe(data =>{this.ratinglist = data;});
    }*/

  }

}
