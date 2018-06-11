import {Component, Inject, OnInit} from '@angular/core';
import {SportService} from "../../services/sport.service";
import {ToasterService} from "angular2-toaster";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {User} from "../../models/user";
import {Sport} from "../../models/sport";
import {UserService} from "../../services/user.service";
import {ResetPasswordComponent} from "../reset-password/reset-password.component"

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    toSend: any;

    sports: Sport[];
    stock = false;
    currentpwd: string;
    password1: string;
    password2: string;
    constructor(private sportService: SportService, private toaster: ToasterService, private userService: UserService,
                private dialogRef: MdDialogRef<EditProfileComponent>, @Inject(MD_DIALOG_DATA) public data: User, private dialog: MdDialog) { }

    ngOnInit() {

        this.toSend = {
            username: this.data.username,
            email: this.data.email,
            picture: null
        };
        this.getSports();
    }

    getSports = () => {

        this.sportService.getSports()
            .subscribe((sports: Sport[]) => {

                this.sports = sports;
            }, (error) => console.error(error));
    };

    sendDifferencesOnly() {

        const editedValues = {};
        for (const k in this.toSend) {

            if (this.toSend.hasOwnProperty(k) && this.toSend[k]) {

                if (this.toSend[k] !== this.data[k]) {

                    editedValues[k] = this.toSend[k];
                }
            }
        }
        return editedValues;
    }

    editUser() {

        const tmp = this.sendDifferencesOnly();
        console.log(tmp);
        this.userService.put(tmp)
            .subscribe((editedUser: User) => {

                this.toaster.pop("success", "User successfully edited");
                this.dialogRef.close(editedUser);
            }, (error) => {

                console.log(error);
                this.toaster.pop("error", "Failed to edit user");
            });
    }

  /*openResetPasswordDialog() {

  this.state = true;
    const dialogRef = this.dialog.open(ResetPasswordComponent);
    dialogRef.componentInstance.data= {
      state: this.state
    };

    //this.dialog.open(ResetPasswordComponent, {data: this.state})
      //.afterClosed().subscribe((result) => {
     // console.log(result);
    //});
    //this.dialogRef.close(EditProfileComponent);
  }*/
    editPwd(){
      this.userService.changePasswd(this.currentpwd, this.password1, this.password2).subscribe((response) => {
        this.toaster.pop("success", "your password was changed");
        //this.dialogRef.close(response);
      }, (error) => {

        console.log(error);
        this.toaster.pop("error", "please fill the field correctly");
      });;
      console.log(this.stock);
    }



}
