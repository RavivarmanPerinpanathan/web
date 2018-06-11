import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {FormsModule} from '@angular/forms';
import {ToasterModule} from "angular2-toaster";
import {FacebookModule} from "ngx-facebook";
import {AgmCoreModule} from "@agm/core";
import {NguiDatetimePickerModule} from "@ngui/datetime-picker";
import {SwiperModule} from "ngx-swiper-wrapper";
//import {PushNotificationsModule} from 'ng-push';

import {RoutingModule} from './modules/router.module';
import {MaterializeModule} from './modules/materialize.module';

import {Base64convertDirective} from './directives/base64convert.directive';

import {UserService} from "./services/user.service";
import {EventService} from "./services/event.service";
import {CoachingService} from "./services/coaching.service";
import {SportService} from "./services/sport.service";
import {CommentService} from "./services/comment.service";
import {ManageFriendsService} from "./services/manage-friends.service";
import {NotifService} from "./services/notification.service";
import {RentsService} from "./services/rents.service";

import {NeedAuthGuard} from "./route-guards/need-auth.guard";
import {NeedAnonGuard} from "./route-guards/need-anon.guard";

import {AppComponent} from './app.component';
import {TestComponent} from './components/test/test.component';
import {MainComponent} from './components/main/main.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {EventListComponent} from './components/event-list/event-list.component';
import {EventDetailComponent} from './components/event-detail/event-detail.component';
import {EventCreateFabComponent} from './components/event-create-fab/event-create-fab.component';
import {CreateEventComponent} from './components/create-event/create-event.component';
import {MapComponent} from './components/map/map.component';
import {DistancePipe} from './pipes/distance/distance.pipe';
import {SearchComponent} from './components/search/search.component';
import {ConfirmEmailComponent} from './components/confirm-email/confirm-email.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AsyncDistanceComponent} from './components/async-distance/async-distance.component';
import {GenericConfirmationDialogComponent} from './components/generic-confirmation-dialog/generic-confirmation-dialog.component';
import {SwiperEventListComponent} from './components/swiper-event-list/swiper-event-list.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EventCardComponent} from './components/event-card/event-card.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { ChatComponent } from './components/chat/chat.component';
import {ChatService} from "./services/chat.service";
import { NotificationComponent } from './components/notification/notification.component';
import { RatingCoachingComponent } from './components/rating-coaching/rating-coaching.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export function userServiceFactory(userService: UserService): Function {
    return () => userService.initApp(); // get current position + last user from local storage if exists
}

@NgModule({
    declarations: [
        AppComponent,
        TestComponent,
        MainComponent,
        LoginComponent,
        SignupComponent,
        EventListComponent,
        EventDetailComponent,
        EventCreateFabComponent,
        CreateEventComponent,
        MapComponent,
        DistancePipe,
        SearchComponent,
        ConfirmEmailComponent,
        ProfileComponent,
        Base64convertDirective,
        AsyncDistanceComponent,
        GenericConfirmationDialogComponent,
        SwiperEventListComponent,
        EditProfileComponent,
        EventCardComponent,
        AddLocationComponent,
        ChatComponent,
        NotificationComponent,
        RatingCoachingComponent,
        ResetPasswordComponent
    ],
    entryComponents: [
        EventDetailComponent,
        CreateEventComponent,
        GenericConfirmationDialogComponent,
        EditProfileComponent,
        AddLocationComponent,
        RatingCoachingComponent,
        ResetPasswordComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutingModule,
        MaterializeModule,
        HttpModule,
        FormsModule,
        ToasterModule,
        //PushNotificationsModule,
        FacebookModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyB9sW2LbZIww6h_x4mXjg5tnisEFOuONHw",
            libraries: ["places"]
        }),
        NguiDatetimePickerModule,
        SwiperModule.forRoot({})
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: userServiceFactory,
            deps: [UserService],
            multi: true
        },
        UserService,
        EventService,
        CoachingService,
        SportService,
        CommentService,
        ManageFriendsService,
        ChatService,
        NeedAuthGuard,
        NeedAnonGuard,
        NotifService,
        RentsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
