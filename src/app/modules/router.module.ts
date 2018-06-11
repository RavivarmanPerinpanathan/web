/**
 * Created by milka on 27/06/17.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NeedAuthGuard} from "../route-guards/need-auth.guard"
import {NeedAnonGuard} from "../route-guards/need-anon.guard"

import {TestComponent} from '../components/test/test.component';
import {MainComponent} from '../components/main/main.component';
import {LoginComponent} from '../components/login/login.component';
import {SignupComponent} from '../components/signup/signup.component';
import {MapComponent} from '../components/map/map.component';
import {SearchComponent} from "../components/search/search.component";
import {ConfirmEmailComponent} from "../components/confirm-email/confirm-email.component";
import {ProfileComponent} from "../components/profile/profile.component";
import {ChatComponent} from "../components/chat/chat.component";
import {NotificationComponent} from "../components/notification/notification.component";
import {ResetPasswordComponent} from "../components/reset-password/reset-password.component";

const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'test', component: TestComponent, canActivate: [NeedAuthGuard]},
    {path: 'login', component: LoginComponent, canActivate: [NeedAnonGuard]},
    {path: 'signup', component: SignupComponent, canActivate: [NeedAnonGuard]},
    {path: 'map', component: MapComponent}, // TODO remove this test
    {path: 'chat', component: ChatComponent, canActivate: [NeedAuthGuard]}, // TODO remove this test
    {path: 'search', component: SearchComponent},
    {path: 'confirm-email/:token', component: ConfirmEmailComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [NeedAuthGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate: [NeedAuthGuard]},
    {path: 'notification', component: NotificationComponent, canActivate: [NeedAuthGuard]},
    {path: 'reset/:token', component: ResetPasswordComponent, canActivate:[NeedAnonGuard]},
    {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule {
}
