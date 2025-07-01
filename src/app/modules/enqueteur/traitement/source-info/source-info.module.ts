import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceInfoComponent } from './source-info/source-info.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {RouterModule} from "@angular/router";
import {SOURCE_INFO_ROUTE} from "@modules/enqueteur/traitement/source-info/source-info-routing";
import { SourceCardComponent } from './source-info/components/source-card/source-card.component';
import { SourceFiltersComponent } from './source-info/components/source-filters/source-filters.component';
import { RecentSourcesComponent } from './source-info/components/recent-sources/recent-sources.component';
import { SourceTestComponent } from './source-test/source-test.component';
import { SourceFilterComponent } from './source-test/components/source-filter/source-filter.component';
import {
  SourceCardTestComponent
} from "@modules/enqueteur/traitement/source-info/source-test/components/source-card/source-card.component";
import { FormSourceInfoComponent } from './form-source-info/form-source-info.component';
import {
  SelectSearchPaginateComponent
} from "@shared/components/select-search-paginate/select-search-paginate.component";



@NgModule({
  declarations: [
    SourceInfoComponent,
    SourceCardComponent,
    SourceFiltersComponent,
    RecentSourcesComponent,
    SourceTestComponent,
    SourceFilterComponent,
    SourceCardTestComponent,
    FormSourceInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    SelectSearchPaginateComponent,
    RouterModule.forChild(SOURCE_INFO_ROUTE),
  ]
})
export class SourceInfoModule { }
