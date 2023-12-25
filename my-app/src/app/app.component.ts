import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimationComponent } from "./animation/animation.component";
import { LetterComponent } from './letter/letter.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterModule, AnimationComponent, LetterComponent],
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular';

  ngOnInit() {

    const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(() => {
          move();
      });
    }

    window.addEventListener('mousemove', (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move();
  }
}