import { Component, OnInit , OnDestroy , ElementRef, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';

class Shape {
  public graphics: PIXI.Graphics;
  private isDestroyed: boolean = false;

  constructor(private game: PIXI.Application) {
    this.graphics = new PIXI.Graphics();

    //@ts-ignore
    this.graphics.interactive = true; 
    //@ts-ignore
    this.graphics.buttonMode = true; 
    //@ts-ignore
    this.graphics.on('pointerdown', () => { 
      this.game.stage.removeChild(this.graphics);
      this.removeShape()
    });
  }

  removeShape() {
    if (!this.isDestroyed) {
      this.isDestroyed = true;
      this.game.stage.removeChild(this.graphics);
      //@ts-ignore
      this.graphics.removeAllListeners();
    }
  }

  isOnCanvas(canvasHeight: number) {
    return !this.isDestroyed && this.graphics.y <= canvasHeight + 50;
  }

  drawStar(graphics: PIXI.Graphics, x: number, y: number, numPoints: number, outerRadius: number, innerRadius: number): void {
    const starVertices: number[] = [];
    const angleIncrement = Math.PI / numPoints;

    for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * angleIncrement;

        const vertexX = x + Math.cos(angle) * radius;
        const vertexY = y + Math.sin(angle) * radius;

        starVertices.push(vertexX, vertexY);
    }
      graphics.drawPolygon(starVertices);
    }

    createRandomIrregularShape(color: number, x: number, y: number, radius: number) {
      const numPoints = Math.floor(Math.random() * 10) + 5; // Random number of points between 5 and 14
      const points: PIXI.Point[] = [];
    
      // Generate random points within a circle
      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const distance = Math.random() * radius; // Random distance from center
    
        // Calculate the coordinates of the point
        const pointX = x + Math.cos(angle) * distance;
        const pointY = y + Math.sin(angle) * distance;
    
        points.push(new PIXI.Point(pointX, pointY));
      }
    
      // Sort points clockwise
      points.sort((a, b) => Math.atan2(a.y - y, a.x - x) - Math.atan2(b.y - y, b.x - x));
    
      const shape = new PIXI.Graphics();
      shape.beginFill(color);
    
      // Move to the first point
      shape.moveTo(points[0].x, points[0].y);
    
      // Draw lines to connect the points
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].y);
      }
    
      // Close the shape
      shape.closePath();
      shape.endFill();
    
      this.game.stage.addChild(shape);
    }

  draw(color: number, x: number, y: number) {
    const shapeSize = 100;

    this.graphics.beginFill(color);

    this.drawShape();

    this.graphics.endFill();
    this.graphics.position.set(x,y);
    this.game.stage.addChild(this.graphics);
  }

  animate(gravity: number) {
    this.game.ticker.add(() => {
      // Apply gravity effect to the shape
      this.graphics.y += gravity;

      // Remove the shape if it reaches the bottom
      if (this.graphics.y > this.game.renderer.height + 50) {
        this.game.stage.removeChild(this.graphics);
      }
    });
  }

  protected drawShape() {}
}

class Circle extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    const circleRadius = shapeSize / 2;
    this.graphics.drawCircle(0, 0, circleRadius);
  }
}

class Square extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    this.graphics.drawRect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
  }
}

class Triangle extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    this.graphics.drawPolygon([-shapeSize / 2, shapeSize / 2, shapeSize / 2, shapeSize / 2, 0, -shapeSize / 2]);
  }
}

class Pentagon extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    this.graphics.drawPolygon([
      0, -shapeSize / 2,
      shapeSize / 2 * 0.951, -shapeSize / 2 * 0.309,
      shapeSize / 2 * 0.588, shapeSize / 2 * 0.809,
      -shapeSize / 2 * 0.588, shapeSize / 2 * 0.809,
      -shapeSize / 2 * 0.951, -shapeSize / 2 * 0.309
    ]);
  }
}

class Hexagon extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    this.graphics.drawPolygon([
      shapeSize / 2 * 0.866, shapeSize / 2 * 0.5,
      0, shapeSize / 2,
      -shapeSize / 2 * 0.866, shapeSize / 2 * 0.5,
      -shapeSize / 2 * 0.866, -shapeSize / 2 * 0.5,
      0, -shapeSize / 2,
      shapeSize / 2 * 0.866, -shapeSize / 2 * 0.5
    ]);
  }
}

class Ellipse extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    this.graphics.drawEllipse(0, 0, shapeSize / 2, shapeSize / 2);
  }
}

class Star extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    const starSize = shapeSize / 2;
    this.drawStar(this.graphics, 0, 0, 5, starSize, starSize / 2);
  }
}

class RandomShape extends Shape {
  protected override drawShape() {
    const shapeSize = 100;
    const graphics = this.graphics;
    const numPoints = Math.floor(Math.random() * 10) + 3; // Random number of points between 3 and 12
    const points: number[] = [];

    // Generate random points within a circle
    for (let i = 0; i < numPoints; i++) {
      const angle = Math.random() * Math.PI * 2; // Random angle
      const distance = Math.random() * shapeSize; // Random distance from center

      // Calculate the coordinates of the point
      const pointX = Math.cos(angle) * distance;
      const pointY = Math.sin(angle) * distance;

      points.push(pointX, pointY);
    }

    graphics.drawPolygon(points);
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shape-reevo';
  @ViewChild('pixiContainer') pixiContainer: ElementRef;

  activeShapes: Shape[] = [];

  game: PIXI.Application;
  gravity: number = 1; // Gravity value
  shapeInterval: any; // Interval reference
  seconds: number = 1000;
  shapes: number = 1;

  shapesOnScreen: number = 0;
  shapesArea: number = 0;

  constructor() {}

  checkActiveShapes() {
    // Filter out and destroy shapes that are no longer on the canvas
    this.activeShapes = this.activeShapes.filter(shape => shape.isOnCanvas(this.game.renderer.height));

    this.shapesOnScreen = this.activeShapes.length
    this.shapesArea = this.activeShapes.length * 1000;

  }

  increaseGravity() {
    this.gravity++;
  
  }

  decreaseGravity() {
    if (this.gravity > 1) {
      this.gravity--;
    }
  }

  increaseShapesPerSecond() {
    this.shapes++;
    this.seconds = this.seconds / this.shapes;
    clearInterval(this.shapeInterval);
    this.shapeInterval = setInterval(() => {
      this.checkActiveShapes();
      this.createRandomShape();
    }, this.seconds);
  }

  decreaseShapesPerSecond() {
    if (this.shapes > 0) {
      this.shapes--;
      this.seconds = this.seconds * this.shapes;
      clearInterval(this.shapeInterval);
      if(this.seconds !== 0){
        this.shapeInterval = setInterval(() => {
          this.checkActiveShapes();
          this.createRandomShape();
        }, this.seconds);
      }else{
        this.seconds = 1000;
      }
    }
  }

  ngOnInit(): void {
    this.game = new PIXI.Application({ width: window.innerWidth, height: 600, backgroundColor: 0x1099bb });

    this.shapeInterval = setInterval(() => {
      this.checkActiveShapes();
      this.createRandomShape();
    }, this.seconds);
    
    //@ts-ignore
    this.game.view.addEventListener('click', (event) => {
      //@ts-ignore
      const x = event.offsetX;
      //@ts-ignore
      const y = event.offsetY;
      this.createClickShape(x, y);
    });
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.game.view);
  }

  ngOnDestroy() {
    clearInterval(this.shapeInterval);
  }

  getRandomColor(): number {
    return Math.random() * 0xFFFFFF;
  }

  createClickShape(x: number, y: number) {

  const clickedShape = this.activeShapes.find(shape => {
    const shapeBounds = shape.graphics.getBounds();
    return shapeBounds.contains(x, y);
  });

  if (clickedShape) {
    return;
  }

  const shape = new RandomShape(this.game);

  shape.draw(this.getRandomColor(), x, y);
  shape.animate(this.gravity);

  this.activeShapes.push(shape);
  }

  createRandomShape() {
    let shape: Shape = new Shape(this.game);
    const shapeIndex = Math.floor(Math.random() * 7);

    switch (shapeIndex) {
      case 0:
        shape = new Circle(this.game)
        break;
      case 1:
        shape = new Square(this.game);
        break;
      case 2:
        shape = new Triangle(this.game);
        break;
      case 3:
        shape = new Pentagon(this.game);
        break;
      case 4:
        shape = new Hexagon(this.game);
        break;
      case 5:
        shape = new Ellipse(this.game);
        break;
      case 6:
        shape = new Star(this.game);
        break;
    }
    
    shape.draw(this.getRandomColor(), Math.random() * (this.game.renderer.width - 100) + 50, -100);
    shape.animate(this.gravity);
    this.activeShapes.push(shape);
    console.log(shape)
  }
}

