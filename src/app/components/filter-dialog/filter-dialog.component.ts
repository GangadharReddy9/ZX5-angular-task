import {Component, Inject, OnInit} from '@angular/core';
import {MovieFilter, MovieFilterItem} from '../../models/movie';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';

export interface DialogData {
  searchLabel?: string;
  filterType?: MovieFilter;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  form: FormGroup;
  filterItems: MovieFilterItem[] = [
    {value: MovieFilter.NONE, viewValue: 'None'},
    {value: MovieFilter.SEARCH, viewValue: 'By Title Search'},
    {value: MovieFilter.MAJOR_GENRE, viewValue: 'By Genre Search'},
    {value: MovieFilter.YEAR, viewValue: 'By Year Search'}
  ];

  searchTextControl = new FormControl();
  filterTypeControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    let filterType = this.filterItems.find(item => item.value === this.data.filterType);
    filterType = filterType ?? this.filterItems[0];

    this.data.searchLabel = this.data.searchLabel ?? '';
    this.data.filterType = filterType.value;

    this.searchTextControl.setValue(this.data.searchLabel);
    this.filterTypeControl.setValue(this.data.filterType);

    this.form = new FormGroup({
      search: this.searchTextControl,
      type: this.filterTypeControl,
    });

    this.searchTextControl.valueChanges.subscribe(value => this.data.searchLabel = value);
    this.filterTypeControl.valueChanges.subscribe(value => this.data.filterType = value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onReset(): void {
    this.data = {
      searchLabel: '',
      filterType: MovieFilter.NONE
    };

    this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    if (this.data?.searchLabel && this.data.filterType !== MovieFilter.NONE) {
      this.dialogRef.close(this.data);
    }
  }
}
