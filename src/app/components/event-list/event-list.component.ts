import {Component, Input} from '@angular/core';
import {BaseEventCoaching} from "../../models/BaseEventCoaching";

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.css']
})
export class EventListComponent {

    @Input() title: string;
    @Input() events: BaseEventCoaching[];
}
