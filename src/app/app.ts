import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component of the application
 * Serves as the entry point and container for all other components
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'talent-flow-webapp';
}
