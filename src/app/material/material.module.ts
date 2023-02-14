import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const material = [
  MatSlideToggleModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatProgressSpinnerModule
]

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
