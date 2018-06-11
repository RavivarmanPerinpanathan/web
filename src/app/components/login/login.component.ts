import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ToasterService} from "angular2-toaster";
import {FacebookService} from "ngx-facebook";
import {Router} from "@angular/router";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {ResetPasswordComponent} from "../reset-password/reset-password.component"

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    username: string;
    password: string;
    loading = false;
    state = false;
    constructor(private userService: UserService, private toaster: ToasterService,
                private fb: FacebookService, private router: Router, private dialog: MdDialog) {
    }

    ngOnInit() {

        this.fb.init({
            appId: '802601793241421',
            xfbml: true,
            version: 'v2.8'
        });
    }

    facebookLogin = () => {

        this.fb.login({
            scope: 'email, user_friends'
        })
            .then((response) => {

                console.log("Facebook login success: retrieving sporthub user now");
                this.loginSubscriber(this.userService.facebookLogin({
                    token: response.authResponse.accessToken
                }));
            })
            .catch((error) => {

                console.log(error);
                this.toaster.pop("error", "Failed to connect with Facebook");
            });
    };

    login = () => {

        this.loginSubscriber(this.userService.sporthubLogin({
            username: this.username,
            password: this.password
        }));
    };

    loginSubscriber = (loginObservable) => {

        this.loading = true;
        loginObservable.subscribe(() => {

            this.toaster.pop("success", "Login successful");
            this.router.navigate(['/']);
        }, (error) => {

            this.toaster.pop("error", "Unknown username or wrong password.");
            // this.toaster.pop("error", error.json().message);
            this.loading = false;
        });
    }

    openResetPasswordDialog() {
      /*this.dialog.open(ResetPasswordComponent)
        .afterClosed().subscribe((result) => {

        console.log(result);
      });*/
      this.state = true;
      const dialogRef = this.dialog.open(ResetPasswordComponent);
      dialogRef.componentInstance.data= {
        state: this.state
      };

    }

}
