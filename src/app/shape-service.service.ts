import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private shapeRemovedSource = new Subject<void>();
  shapeRemoved$ = this.shapeRemovedSource.asObservable();

  constructor() {}

  emitShapeRemoved() {
    this.shapeRemovedSource.next();
  }
}
