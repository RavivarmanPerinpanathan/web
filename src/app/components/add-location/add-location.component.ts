import {Component, Inject,Optional, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {RentsService} from "../../services/rents.service";
import {ToasterService} from "angular2-toaster";
@Component({
    selector: 'app-add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

  toSend: any;
  toSend2: any;
    constructor(private dialogRef: MdDialogRef<AddLocationComponent>,private toaster:ToasterService,
                @Optional() @Inject(MD_DIALOG_DATA) public data: any, private rentsService: RentsService) {
    }

    ngOnInit() {
      this.toSend = {
        thumbnail: null,
        name: null,
        note: null,
        price: null,
        quantity: 1
      };
      this.toSend2 = {
        thumbnail: this.data.thumbnail,
        name: this.data.name,
        note: this.data.note,
        price: this.data.price,
        quantity: 1
      };
      console.log(this.toSend2);
    }

  additems()
  {
    this.rentsService.createrents(this.toSend).subscribe((response) => {
      this.toaster.pop("success", "Item succefully created");
    }, (error) => {
      console.log(error);
      this.toaster.pop("error", "Fail to create item");
    });;
    this.dialogRef.close(AddLocationComponent);
  }

  editItems(){
    console.log(this.toSend2);
    this.rentsService.editrents(this.toSend2, this.data.id).subscribe((response) => {
      this.toaster.pop("success", "Item succefully edit");
    }, (error) => {
      console.log(error);
      this.toaster.pop("error", "Fail to edit item");
    });;
    this.dialogRef.close(AddLocationComponent);
  }
}
