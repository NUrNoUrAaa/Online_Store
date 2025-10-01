import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/Components/header/header";
import { Toast } from './toast/components/toast/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header , Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('store');
}
