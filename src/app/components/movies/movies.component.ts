import {Component, OnInit} from '@angular/core';
import {ApiCallsService} from '../../services/api-calls.service';
import {Movie, MovieFilter} from '../../models/movie';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, FilterDialogComponent} from '../filter-dialog/filter-dialog.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  filterData: DialogData = {};
  noRecordsFound = false;

  constructor(private apiCalls: ApiCallsService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchMovies();
  }

  private fetchMovies(value?: string, filterType?: MovieFilter): void {
    this.apiCalls.getMovies(value, filterType).subscribe(movies => {
      this.movies = movies;
      this.noRecordsFound = this.movies.length <= 0;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: this.filterData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filterData = result;

        if (this.filterData?.searchLabel && this.filterData?.filterType !== MovieFilter.NONE) {
          this.fetchMovies(this.filterData.searchLabel, this.filterData.filterType);
        } else {
          this.fetchMovies();
        }
      }
    });
  }
}
