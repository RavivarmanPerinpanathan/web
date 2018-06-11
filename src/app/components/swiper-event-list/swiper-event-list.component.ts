import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SwiperComponent, SwiperConfigInterface} from "ngx-swiper-wrapper";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";

@Component({
    selector: 'app-swiper-event-list',
    templateUrl: './swiper-event-list.component.html',
    styleUrls: ['./swiper-event-list.component.css']
})
export class SwiperEventListComponent {

    swiperConfig: SwiperConfigInterface = {
        centeredSlides: true,
        scrollbar: null,
        direction: 'horizontal',
        slidesPerView: 3    ,
        scrollbarHide: false,
        spaceBetween: 10,
        keyboardControl: true,
        mousewheelControl: true,
        scrollbarDraggable: true,
        scrollbarSnapOnRelease: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    };
    @ViewChild(SwiperComponent) swiperView: SwiperComponent;


    @Input() title: string;
    @Input() events: BaseEventCoaching[];

    @Output() loadMoreClicked = new EventEmitter();

    constructor() {}

    updateSwiper() {

        console.log("updateSwiper");
        this.swiperView.update();
    }

    loadMore() {

        this.loadMoreClicked.emit();
    }
}
