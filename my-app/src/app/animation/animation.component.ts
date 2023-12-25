import { Component, NgZone, OnInit } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { letter } from '../types';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-animation',
  standalone: true,
  templateUrl: './animation.component.html',
  imports: [LottieComponent, CommonModule],
  styleUrl: './animation.component.css',
  animations: [
    trigger('animation', [
      state('initial', style({
        opacity: 1
      })),
      state('final', style({
        opacity: 0
      })),
      transition('initial => final', animate('1000ms')),
      transition('final => initial', animate('1000ms')),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 }))
      ]),
    ]),  
  ],
})
export class AnimationComponent implements OnInit {

  currentState: string = 'final';
  animationNumber: number = 1;
  options: AnimationOptions = {
    path: '/assets/1.json',
    loop: 4
  };

  /**
   * Change custom state of angular animation
   */
  toggleAnimation() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }


  styles: Partial<CSSStyleDeclaration> = {
    transition: 'transform 250ms linear',
    animation: 'myAnimation 2s ease-in-out infinite'
  }

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
      this.toggleAnimation();
  }

  /**
   * Triggered when animations are completed
   */
  changeAnimation(): void {

    this.ngZone.run(() => {
      // Trigger angular animation
      this.toggleAnimation();
      // Wait for angular animation
      setTimeout(() => {
        // Get last animationNumber
        const excludedAnimationNumber = this.animationNumber;
        // Get random number between 1-5
        let newAnimationNumber =  Math.floor(Math.random() * 5) + 1;
        // Repeat process if random number is the last animationNumber
        do {
          newAnimationNumber =  Math.floor(Math.random() * 5) + 1;
        } while (newAnimationNumber == excludedAnimationNumber);
        // Get new animation
        this.options = {
          ...this.options,
          path: '/assets/'+newAnimationNumber+'.json'
        }
        // Set animationNumber
        this.animationNumber = newAnimationNumber;
        // Trigger angular animation
        this.toggleAnimation();
      }, 1000);
    });
  }
}
