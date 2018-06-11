import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {Event} from "../../models/event";
import {Coaching} from "../../models/coaching";
import {UserService} from "../../services/user.service";
import {CreateEventComponent} from "../create-event/create-event.component";
import {EventService} from "../../services/event.service";
import {CoachingService} from "../../services/coaching.service";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {GenericConfirmationDialogComponent} from "../generic-confirmation-dialog/generic-confirmation-dialog.component";
import {ToasterService} from "angular2-toaster";
import {Observable} from "rxjs/Observable";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {CommentService} from "../../services/comment.service";
import {ManageFriendsService} from "../../services/manage-friends.service";
import {RentsService} from "../../services/rents.service";

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  public canEdit:boolean;
  public toShow:Event | Coaching;
  userLogged:boolean;

  private serviceList = {
    "Event": this.eventService,
    "Coaching": this.coachingService
  };
  eventType: string;
  notationLists: any = [
    {id: 1, text: '1'},
    {id: 2, text: '2'},
    {id: 3, text: '3'},
    {id: 4, text: '4'},
    {id: 5, text: '5'}
  ];
  current = '2';
  comment_coach :string;
  notation : string;
  public rate_state:boolean;
  items:  Array<any>;
  items2:  Array<any>;
  rentable_items = [];
  public rentable_state :boolean;
  dataRents:  Array<any>;
  public state_event:string;
  msg : string;
  public paid;
  public paid2;
  constructor(@Inject(MD_DIALOG_DATA) public data:Event | Coaching, private userService:UserService,
              private dialog:MdDialog, private eventService:EventService, private coachingService:CoachingService,
              private toaster:ToasterService, private dialogRef:MdDialogRef<EventDetailComponent>,
              private router:Router, private commentService:CommentService,
              private manageFriendsService:ManageFriendsService, private rentsService: RentsService) {
    //this.commentService.add_comment_coaching(this.data.id, this.msg).subscribe((data) =>{this.msg = data});
  }

  ngOnInit() {

    this.userLogged = this.userService.isLogged();
    this.serviceList[this.data.getClassName()].get(this.data.id)
      .subscribe((event:BaseEventCoaching) => {

        this.toShow = event;
        this.canEdit = this.userLogged && this.userService.currentUser.id === this.data.owner.id;
      });
    if (this.data.getClassName() == "Event") {
      this.state_event = "Event";
    }
    //this.commentService.add_comment_coaching(this.data.id, this.msg).subscribe((data) =>{this.msg = data});
    this.display_MyOwn_items();
    this.display_Rentable_items();
    this.refresh_comment();
  }

  editItem() {

    this.dialog.open(CreateEventComponent, {data: this.toShow});
    console.log(this.toShow);
  }



  deleteItem() {

    this.dialog.open(GenericConfirmationDialogComponent, {
      data: {
        message: `Are you sure you want to delete this ${this.data.getClassName()} ?`,
        answers: [
          {
            "text": "Yes",
            "color": "primary"
          },
          {
            "text": "No",
            "color": "warn"
          }
        ]
      }
    })
      .afterClosed().subscribe(result => {

      if (result && result === "Yes") {

        this.serviceList[this.data.getClassName()].deleteResource(this.data.id)
          .subscribe((deleteMessage:string) => {

            this.toaster.pop("success", deleteMessage);
            this.toShow.gotDeleted = true;
            this.dialogRef.close();
          }, (error) => {

            this.toaster.pop("error", error.json().message);
          });
      }
    });
  }

  goToUserProfile(user:User):void {

    this.router.navigate(['/profile', user.id]);
    console.log("user id du compte = " + user.id);
    this.dialogRef.close();
  }

  handleRegistrationChange(observable:Observable<string>, event:BaseEventCoaching):void {

    observable
      .map((response) => {

        this.serviceList[event.getClassName()].get(event.id).subscribe();
        return response;
      })
      .subscribe((textMessage:string) => {

        console.log(textMessage);
        this.toaster.pop("success", textMessage);
      }, error => {

        this.toaster.pop("error", error.json().message);
      });
  }

  register(event:BaseEventCoaching):void {

    this.handleRegistrationChange(this.serviceList[event.getClassName()].register(event.id), event);

  }

  unregister(event:BaseEventCoaching):void {

    this.handleRegistrationChange(this.serviceList[event.getClassName()].unregister(event.id), event);
  }

  delete_comment(id) {
    console.log(this.data.getClassName());

    //this.commentService.del(id, this.data.id);
    this.toShow.comments.slice(id, 1);
  if (this.data.getClassName() == "Event") {this.refresh_comment();
      this.commentService.del(id, this.data.id).subscribe(data => console.log(data));this.refresh_comment();
      this.toShow.comments.slice(id, 1);
      console.log(id);
      this.refresh_comment();
      //this.toaster.pop("success", "Message successfully deleted");
      this.refresh_comment();

    }
    else if (this.data.getClassName() == "Coaching") {this.refresh_comment();
      //this.commentService.del(id, this.data.id).subscribe(data => console.log(data));this.refresh_comment();
      this.commentService.del2(id, this.data.id).subscribe(data => console.log(data));this.refresh_comment();
      this.toShow.comments.slice(id, 1);
      console.log(id);
      //id.comment.slice(id.id, 1);
      this.refresh_comment();
      //this.toaster.pop("success", "Message successfully deleted");
    }
  }

  refresh_comment(){
    this.serviceList[this.data.getClassName()].get(this.data.id)
      .subscribe((event:BaseEventCoaching) => {
        this.toShow = event;
      });
  }

  addcomment(message: string): void {
    console.log(this.data.getClassName());
    console.log("event id = " + this.data.id);
    console.log("user id = " + this.userService.currentUser.id);
    this.msg = message;
    /*if (message == "")
    {
      this.toaster.pop("error", "Nothing to add");
    }*/
    if (this.data.getClassName() == "Event") {
      this.commentService.add_comment_event(this.data.id, this.msg).subscribe((data) =>{this.msg = data});
       this.toaster.pop("success", "Message successfully added");
       this.refresh_comment();
       this.refresh_comment();
    }
    else if (this.data.getClassName() == "Coaching") {
      this.commentService.add_comment_coaching(this.data.id, this.msg).subscribe((data) =>{this.msg = data});
      this.toaster.pop("success", "Message successfully added");
      //this.msg = "";
      this.refresh_comment();
      this.refresh_comment();
    }
  }

  addfriends(id){
    console.log("ID du futur ami = " + id);
    console.log("user id currentuser= " + this.userService.currentUser.id);
    this.manageFriendsService.requestfriend(id).subscribe(data => console.log(data));
     //this.toaster.pop("success", "Message successfully sent");
  }

  /////////////////////////my created rents////////////////////
  display_MyOwn_items(){
    this.rentsService.getMyrents().subscribe(data =>{this.items = data;});
    //this.items2;
    /*for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]["owner"].id == this.userService.currentUser.id){

      }
      console.log(this.items[i]["owner"].id);
      console.log(this.items[i].id);
    }*/
    //console.log(this.items);
  }

  /////////////////////////my sharing rents////////////////////
  display_Rentable_items(){
    this.rentsService.getRentableItemsListtoEvent(this.data.id).subscribe(data =>{this.items2 = data;});
    //console.log(this.items2["rents"][0]["rent"]);
    console.log("dans retable item");
    console.log(this.items2);
    for (let i = 0; i < this.items2["rents"].length; i++) {
      this.rentable_items[i] = this.items2["rents"][i];
    }
    console.log(this.rentable_items[0]);
  }

  add_itemsToEvent(rentId){
    //this.rentsService.add_rent_toEvent(this.data.id, rentId).subscribe(data =>{this.dataRents = data;});
    //this.rentsService.add_rent_toEvent(this.data.id, rentId).subscribe(data =>{this.dataRents = data;});
    console.log("event id = " + this.data.id);
    console.log("item id = " + rentId);
    console.log(this.dataRents);
    this.rentsService.add_rent_toEvent(this.data.id, rentId).subscribe((response) => {
      this.toaster.pop("success", "item succefully add");
    }, (error) => {

      console.log(error);
      this.toaster.pop("error", "item already add");
    });;

  }

  rentItems(rentId, price){
    this.rentsService.rent_Items(rentId).subscribe((response) => {
      this.toaster.pop("success", "item succefully rent");this.display_Rentable_items();
      this.paid2 = this.payday(price);console.log(this.paid2);
    }, (error) => {

      console.log(error);
      this.toaster.pop("error", "this item cannot be rent");
    });;
    console.log(rentId);
  }
  unrentItems(rentId){
    this.rentsService.unrent_Items(rentId).subscribe((response) => {
      this.toaster.pop("success", "item succefully unrent");this.display_Rentable_items();
    }, (error) => {

      console.log(error);
      this.toaster.pop("error", "Someone else rent it");
    });;
    console.log(rentId);
  }

  payday(price){
    var total = null;
    this.paid = null;
    total += price;
    this.paid += total;
    //this.paid2 = this.paid;
    console.log(total);
    console.log(this.paid);
    //console.log(this.paid2);
    return this.paid;
  }

  evalcoach( message: string): void{
    //this.eventType = this.data.getClassName() == "Coaching";
    console.log(this.comment_coach);
    this.rate_state = this.logDropdown(this.notation);
    console.log(this.rate_state);
    if (this.rate_state){
      this.comment_coach = message;
      this.commentService.evaluate_coach(this.data.id,this.notation, this.comment_coach).subscribe(data => console.log(data));
      this.toaster.pop("success", "Message successfully sent");
    }
  }

  logDropdown(note): boolean{
    console.log(note);
    this.notation = note;
    this.comment_coach = " ";
    if(this.notation)
      return this.rate_state = true;
  }

}
