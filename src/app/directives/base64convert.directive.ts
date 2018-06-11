import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[appBase64convert]'
})
export class Base64convertDirective {

    @Output() applyConvertedImage: EventEmitter<any> = new EventEmitter();

    constructor(private element: ElementRef) {}

    @HostListener('change') onChange() {

        const reader = new FileReader();
        reader.onload = () => {

            this.applyConvertedImage.emit(reader.result);
        };
        reader.readAsDataURL(this.element.nativeElement.files[0]);
    }

}
