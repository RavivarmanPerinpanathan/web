import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
    selector: 'app-generic-confirmation-dialog',
    templateUrl: './generic-confirmation-dialog.component.html',
    styleUrls: ['./generic-confirmation-dialog.component.css']
})
export class GenericConfirmationDialogComponent implements OnInit {

    constructor(private dialogRef: MdDialogRef<GenericConfirmationDialogComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {}

    ngOnInit() {
    }

    answerIs(answer): void {

        this.dialogRef.close(answer);
    }
}
