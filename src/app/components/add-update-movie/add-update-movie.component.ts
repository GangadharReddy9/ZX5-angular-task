import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Movie} from '../../models/movie';
import {ApiCallsService} from '../../services/api-calls.service';

@Component({
  selector: 'app-add-update-movie',
  templateUrl: './add-update-movie.component.html',
  styleUrls: ['./add-update-movie.component.scss']
})
export class AddUpdateMovieComponent implements OnInit, OnChanges {
  @Input() movie?: Movie;
  @Output() moviesUpdated = new EventEmitter<boolean>();

  movieForm: FormGroup;

  titleControl = new FormControl();
  usGrossControl = new FormControl();
  worldwideGrossControl = new FormControl();
  productionBudgetControl = new FormControl();
  distributorControl = new FormControl();
  sourceControl = new FormControl();
  majorGenreControl = new FormControl();
  creativeTypeControl = new FormControl();
  directorControl = new FormControl();
  imdbRatingControl = new FormControl();

  buttonText = 'Add movie';
  isMovieEditEnabled = false;

  constructor(private fb: FormBuilder, private apiCallsService: ApiCallsService) {
  }

  ngOnInit(): void {
    this.movieForm = this.fb.group({
      title: this.titleControl,
      usGross: this.usGrossControl,
      worldwideGross: this.worldwideGrossControl,
      productionBudget: this.productionBudgetControl,
      distributor: this.distributorControl,
      source: this.sourceControl,
      majorGenre: this.majorGenreControl,
      creativeType: this.creativeTypeControl,
      director: this.directorControl,
      imdbRating: this.imdbRatingControl,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.movie.currentValue) {
      this.setupMovieData();
    }
  }

  private setupMovieData(): void {
    this.isMovieEditEnabled = true;
    this.buttonText = 'Update movie';

    this.titleControl.setValue(this.movie.Title);
    this.titleControl.disable();
    this.usGrossControl.setValue(this.movie.US_Gross);
    this.worldwideGrossControl.setValue(this.movie.Worldwide_Gross);
    this.productionBudgetControl.setValue(this.movie.Production_Budget);
    this.distributorControl.setValue(this.movie.Distributor);
    this.sourceControl.setValue(this.movie.Source);
    this.majorGenreControl.setValue(this.movie.Major_Genre);
    this.creativeTypeControl.setValue(this.movie.Creative_Type);
    this.directorControl.setValue(this.movie.Director);
    this.imdbRatingControl.setValue(this.movie.IMDB_Rating);
  }

  addOrUpdateMovie(): void {
    if (!this.titleControl.value) {
      return;
    }

    let status: boolean;
    this.setFormControlValuesToMovie();

    if (this.isMovieEditEnabled) {
      status = this.apiCallsService.updateMovie(this.movie);
    } else {
      status = this.apiCallsService.addMovie(this.movie);
    }

    this.moviesUpdated.emit(status);
  }

  deleteMovie(): void {
    this.setFormControlValuesToMovie();
    this.moviesUpdated.emit(this.apiCallsService.deleteMovie(this.movie.Title));
  }

  private setFormControlValuesToMovie(): void {
    this.movie = {
      ...this.movie,
      Title: this.titleControl.value,
      US_Gross: this.usGrossControl.value,
      Worldwide_Gross: this.worldwideGrossControl.value,
      Production_Budget: this.productionBudgetControl.value,
      Distributor: this.distributorControl.value,
      Source: this.sourceControl.value,
      Major_Genre: this.majorGenreControl.value,
      Creative_Type: this.creativeTypeControl.value,
      Director: this.directorControl.value,
      IMDB_Rating: this.imdbRatingControl.value
    };
  }
}
