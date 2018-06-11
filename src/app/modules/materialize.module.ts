/**
 * Created by milka on 27/06/17.
 */

import {NgModule} from '@angular/core';
import {MdSidenavModule, MdToolbarModule, MdProgressBarModule, MdTooltipModule,
    MdDialogModule, MdButtonModule, MdIconModule, MdInputModule, MdCheckboxModule,
        MdSelectModule, MdNativeDateModule, MdDatepickerModule, MdTabsModule, MdMenuModule} from '@angular/material';

const materialComponents = [
    MdSidenavModule,
    MdToolbarModule,
    MdProgressBarModule,
    MdDialogModule,
    MdButtonModule,
    MdIconModule,
    MdTooltipModule,
    MdInputModule,
    MdCheckboxModule,
    MdSelectModule,
    MdNativeDateModule,
    MdDatepickerModule,
    MdTabsModule,
    MdMenuModule
];

@NgModule({
    imports: [materialComponents],
    exports: [materialComponents]
})
export class MaterializeModule {
}
