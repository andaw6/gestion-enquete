import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  currentPage = 1
  totalPages = 2
  pageTitle: string = "Mes Documents";
  pageSubTitle: string = "Gérez tous vos documents d'enquêtes de manière efficace";

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    // this.investigations$ = this.documentService.investigations$
  }

  onSearchChange(searchTerm: string): void {
    console.log("Search:", searchTerm)
  }

  onInvestigationFilter(investigation: string): void {
    console.log("Filter by investigation:", investigation)
  }

  onTypeFilter(type: string): void {
    console.log("Filter by type:", type)
  }

  onSortChange(sort: string): void {
    console.log("Sort by:", sort)
  }

  onViewModeChange(mode: "grid" | "list"): void {
    console.log("View mode:", mode)
  }

  onPageChange(page: number): void {
    this.currentPage = page
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }
}
