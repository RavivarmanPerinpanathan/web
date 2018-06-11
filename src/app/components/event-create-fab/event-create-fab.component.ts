import {Component, OnInit} from '@angular/core';
import {CreateEventComponent} from "../create-event/create-event.component";
import {MdDialog} from "@angular/material";

@Component({
    selector: 'app-event-create-fab',
    templateUrl: './event-create-fab.component.html',
    styleUrls: ['./event-create-fab.component.css']
})
export class EventCreateFabComponent implements OnInit {

    constructor(private dialog: MdDialog) {
    }

    ngOnInit() {
    }

    openCreateEvent() {

        this.dialog.open(CreateEventComponent);
    }
}
