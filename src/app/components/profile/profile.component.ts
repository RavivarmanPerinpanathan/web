import {Component, OnDestroy, OnInit, ViewChild,Inject} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {CoachingService} from "../../services/coaching.service";
import {EventService} from "../../services/event.service";
import {Paginable} from "../../class/Paginable";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {SwiperEventListComponent} from "../swiper-event-list/swiper-event-list.component";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
//import {MdDialog} from "@angular/material";
import {AddLocationComponent} from "../add-location/add-location.component";
import {ManageFriendsService} from "../../services/manage-friends.service";
import {Router} from "@angular/router";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {RentsService} from "../../services/rents.service";
import {CommentService} from "../../services/comment.service";
import {RatingCoachingComponent} from "../rating-coaching/rating-coaching.component"
import {ToasterService} from "angular2-toaster";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

    public user: User;
    public isLoggedUser: boolean;
    private sub: Subscription;

    registeredList: BaseEventCoaching[];
    private registeredListPage = 1;
    createdList: BaseEventCoaching[];
    private createdListPage = 1;

    private registeredSubscription: Subscription;
    private createdSubscription: Subscription;

    //data: Object = {};
    pendingFriendlist: Array<Object>;
    friends:  Array<any>;
    items:  Array<any>;
    ratinglist: Array<any>;
    totalScore: number;
    score ;
    toSend: any;
    datarent: Array<any>;
    public Id_friend;
    public Id_friend2;
    private serviceList = {
        "Events": this.eventService,
        "Coachings": this.coachingService
    };
    public currentResource = "Events";
    number : number;

    @ViewChild(SwiperEventListComponent) swiperComponent: SwiperEventListComponent;

    constructor(private route: ActivatedRoute, private userService: UserService, private dialog: MdDialog,
                private rentsService: RentsService,private commentService:CommentService,private toaster:ToasterService,
                //0private rent:RatingCoachingComponent,
        private eventService: EventService,private router:Router, private coachingService: CoachingService, private manageFriendsService:ManageFriendsService) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
          this.toSend = {
            userId: null,
            score: null,
          };

            if (!params.id || parseInt(params.id, 10) === this.userService.currentUser.id) {
                this.isLoggedUser = true;
                this.user = this.userService.currentUser;

                // TODO change this
                this.user.favorite_sports = this.user.favorite_sports.slice(0, 3);
              this.display_friends(this.user.id);//affiche auto amis

            }
            else {
              console.log(params.id);
                this.userService.getUser(params.id)
                    .subscribe(userData => {
                        this.isLoggedUser = false;
                        this.user = userData;
                      console.log("param.id :" + params.id);
                      console.log("user.id :" + this.user.id);
                    });
              this.Id_friend = params.id;
              this.display_friends(params.id);//affiche auto amis
            }
          //console.log("param.id2 :" + params.id);
          //console.log("user.id2 :" + this.user.id);
          this.display_items(); // affiche items
          this.display_friends(params.id);
          this.getCreatedList();
          this.getRegisteredList();
          //this.getEval();
        });

    }
    addfriends(){
      console.log("ID du futur ami dans profil= " + this.Id_friend);
      //console.log("user id currentuser= " + this.userService.currentUser.id);
      this.display_friends(this.Id_friend2);
      this.manageFriendsService.requestfriend(this.Id_friend).subscribe((response) => {
        this.toaster.pop("success", "request succefully send");
        this.display_friends(this.Id_friend2);
      }, (error) => {

        console.log(error);
        this.toaster.pop("error", "request already send");
      });;
    }

    editProfile() {

        if (!this.isLoggedUser) {

            return ;
        }
      //console.log(this.userService.getUser());
        this.dialog.open(EditProfileComponent, {data: this.user})
            .afterClosed().subscribe((result) => {
            if (result) {
                console.log(result);
                this.user = result;
              this.display_items();
            }
        });
    }

    openLocationDialog() {

        if (!this.isLoggedUser) {

            return ;
        }
      this.display_items();
        this.dialog.open(AddLocationComponent, {data: this.user})
            .afterClosed().subscribe((result) => {
            console.log(result);
          this.display_items();
        });
    }

    openEditLocationDialog(id) {

      if (!this.isLoggedUser) {
        return ;
      }
      this.display_items();
     this.getRentId(id);
      console.log(this.datarent);
      this.dialog.open(AddLocationComponent, {data: this.datarent})
        .afterClosed().subscribe((result) => {
        console.log(result);
        this.display_items();
      });
    }

    onSelectChange = (resourceName: string): void => {

       if (!this.isLoggedUser) {

            return ;
        }
        this.currentResource = resourceName;

        this.registeredListPage = 1;
        this.createdListPage = 1;
        this.registeredList = null;
        this.createdList = null;

        this.getCreatedList();
        this.getRegisteredList();
    };

    loadMoreRegistered() {

        this.getRegisteredList();
    }

    loadMoreCreated() {

        this.getCreatedList();
    }

    getCreatedList = (limit: number = 4) => {

        if (!this.isLoggedUser) {

            return ;
        }
        if (this.createdSubscription) {

            this.createdSubscription.unsubscribe();
        }
        this.createdSubscription = this.serviceList[this.currentResource].getCreated({
            page: this.createdListPage++,
            limit: limit
        }).subscribe((pagination: Paginable) => {


            if (this.createdList) {

                pagination.data.forEach((value: BaseEventCoaching) => {

                    this.createdList.push(value);
                });
            } else {

                this.createdList = pagination.data;
            }
            if (this.swiperComponent) {

                this.swiperComponent.updateSwiper();
            }

        }, (error) => console.error(error));
    };

    getRegisteredList = (limit: number = 4) => {

        /*if (!this.isLoggedUser) {

            return ;
        }*/
        if (this.registeredSubscription) {

            this.registeredSubscription.unsubscribe();
        }
        this.registeredSubscription = this.serviceList[this.currentResource].getRegistered({
            page: this.registeredListPage++,
            limit: limit
        }).subscribe((pagination: Paginable) => {

            if (this.registeredList) {

                pagination.data.forEach((value: BaseEventCoaching) => {

                    this.registeredList.push(value);
                });
            } else {

                this.registeredList = pagination.data;
            }
            if (this.swiperComponent) {

                this.swiperComponent.updateSwiper();
            }
        }, (error) => console.error(error));
    };

  /*  pendingfriends(){
         this.manageFriendsService.pending_friends_request().subscribe(data => {this.pendinglist = data;});
      //console.log(this.pendinglist);
        Object.keys(this.pendinglist).forEach( key => {
        console.log(this.pendinglist[key]); //value
        console.log(key); //key
           console.log(this.pendinglist[0]["author"].username);
          console.log(this.pendinglist[0]["author"].picture);
      });
    }*/

  goToUserProfile(user:User):void {

    this.router.navigate(['/profile', user.id]);
    console.log("user id du compte = " + user.id);
   //this.dialogRef.close();
  }

  pendingfriends(){
    if (this.isLoggedUser) {
      this.manageFriendsService.pending_friends_request().subscribe(pendingFriendlist => {
        this.pendingFriendlist = pendingFriendlist});
    }
  }

    accept_friendsrequest(id){
        this.manageFriendsService.accept_friend_request(id).subscribe(data => console.log(data));
        this.toaster.pop("success", "Friend successfully added");
    }

    remmove_friendrequest(id){
        this.manageFriendsService.reject_friend_request(id).subscribe(data => console.log(data));
        this.display_items();
        this.toaster.pop("success", "Friend request successfully removed");
    }

    deletefriends(id){
        this.manageFriendsService.remove_friend(id).subscribe(data => console.log(data));
        this.toaster.pop("success", "Friend successfully deleted");
    }

    display_friends(id){
      this.manageFriendsService.displayfriends(id).subscribe(data =>{this.friends = data;});
      console.log(this.friends);
    }
    display_items(){
      this.rentsService.getMyrents().subscribe(data =>{this.items = data;});
      console.log(this.items);
    }
    remove_items(id){
      this.rentsService.deleterent(id).subscribe(data => console.log(data));
      this.display_items();
      //this.toaster.pop("success", "Item successfully deleted");
    }

    getRentId(id){
      this.rentsService.get_a_rent(id).subscribe(data =>{this.datarent = data;});
      this.display_items();
    }

    /*getEval(){
      this.commentService.get_eval(this.user.id).subscribe(data =>{this.ratinglist = data;});
      console.log(this.ratinglist);

    }*/
  /*getEval(id){
    console.log(this.user.id);
    if (this.isLoggedUser) {
      this.commentService.get_eval(this.user.id).subscribe(data =>{this.ratinglist = data;});
      this.score =0;
      var count = 0;
      /*Object.keys(this.ratinglist).forEach(key => {
       this.score += this.ratinglist[key].note;
       });*/
      //console.log(this.score);
      /*for (let i = 0; i < this.ratinglist.length; i++) {
        count++;
        this.score  +=  this.ratinglist[i]["note"];
      }
      this.score /= count;
      console.log(this.score);
    }
    else{
      this.commentService.get_eval(this.user.id).subscribe(data =>{this.ratinglist = data;});
    }
  }*/

  openRatingDialog() {
    this.getEval();
    this.dialog.open(RatingCoachingComponent, {data: /*this.user*/ this.toSend})
      .afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  getEval(){
    //console.log(this.userinfo);

    this.commentService.get_eval(this.user.id).subscribe(data =>{this.ratinglist = data;});
    console.log(this.ratinglist );
    this.score = null;
    var count = 0;
    for (let i = 0; i < this.ratinglist.length; i++) {
      count++;
      this.score  +=  this.ratinglist[i]["note"];
    }
    this.score /= count;
    console.log(this.score);
    this.totalScore = this.score;
    this.toSend = {
      userId: this.user,
      score: this.score,
    };
  }



    ngOnDestroy() {

        this.sub.unsubscribe();
        if (this.registeredSubscription) {

            this.registeredSubscription.unsubscribe();
        }
        if (this.createdSubscription) {

            this.createdSubscription.unsubscribe();
        }
    }
}
