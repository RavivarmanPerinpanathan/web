import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {ToasterService} from "angular2-toaster";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private sub: Subscription;
  username: string;
  password1: string;
  password2: string;
  public data: any;
  state: boolean;
  token;
  constructor(private userService: UserService, private toaster: ToasterService, private router: Router, private route: ActivatedRoute/*, private dialogRef: MdDialogRef<ResetPasswordComponent>*/) { }

  ngOnInit() {
    this.statepwd();
    //this.state = false;
    this.sub = this.route.params.subscribe(params =>{this.token = params;});
    console.log(this.token);
  }

////display the right reset password window
  statepwd(){

    if (this.data)
      this.state = this.data.state;///// state psswd window from the Editprofile
    else
      this.state = false;
    console.log(this.state);
  }

  requestResetPasswd(){
   // this.state = true;
    this.userService.requestResetPasswd(this.username).subscribe((response) => {
      this.toaster.pop("success", "mail request was sent");
    }, (error) => {

      console.log(error);
      this.toaster.pop("error", "unknow username");
    });;
    //this.dialogRef.close(ResetPasswordComponent);
    console.log(this.username);
  }

  ResetPasswd(){
    this.userService.resetPasswd(this.token, this.password1, this.password2).subscribe(data =>{this.data = data;});
    console.log(this.data);
     //this.router.navigate(['/login']);


  }

}
