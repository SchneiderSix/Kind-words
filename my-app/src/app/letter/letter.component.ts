import { Component, NgZone } from '@angular/core';
import { DataService } from '../data.service';
import { letter } from '../types';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [LottieComponent, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent {

  /**
   * Initialize specific variables to maintain clear code and
   * @param dataService Functions from service used to call the API
   * @param ngZone Variable used to handle the ngx-lottie animation
   * @param textAreaContent Form control for input
   */
  constructor(private dataService: DataService, private ngZone: NgZone) {}

  profileForm = new FormGroup({
    content: new FormControl('', Validators.required)
  });
  
  public letterData: letter | null = null;

  public vote: boolean = false;

  public writeLetter: boolean = false;

  public spinner: boolean = false;

  private animationItem: AnimationItem | null = null;

  options: AnimationOptions = {
    path: '/assets/like.json',
    loop: 0
  };

  styles: Partial<CSSStyleDeclaration> = {
    width: '100%',
  }


  /**
   * Fetch random letter
   */
  ngOnInit() {
    this.dataService.getLetter().subscribe((letter) => this.letterData = letter);
  }

  /**
   * Set new random letter
   */
  newLetter(): void {
    this.dataService.getLetter().subscribe((letter) => {
      if (letter?._id !== this.letterData?._id) {
        this.letterData = letter;
      } else {
        // If the new letter is the same then use recursion
        this.newLetter();
      }
    });
    if (this.vote === true) this.vote = false;
  }

  /**
   * Vote letter, update the vote and trigger animation
   */
  voteLetter(): void {
    this.dataService.voteLetter(this.letterData?._id as string).subscribe((value : any) => {
      if (value === null) {
        alert('Not voted');
      } else {
        this.vote = true;
      }
    });
    if (this.letterData) this.letterData!.votes += 1;
  }

  /**
   * Create letter and handle spinner,
   * input should contain letters
   */
  onSubmit(): void {
    event?.preventDefault();
    this.spinner = true;
    // Regex, detect punctuation and spaces
    const rex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;
    if (
      this.profileForm.controls.content.value && 
      this.profileForm.controls.content.value?.length >= 30 &&
      /^[a-z]+$/i.test(this.profileForm.controls.content.value.replace(rex, ''))
    ) {
      this.dataService.createLetter(this.profileForm.controls.content.value as string).subscribe((value : any) => {
        if (value) {
          this.spinner = false;
          this.profileForm.controls.content.setValue(value.message);
        }
      });
    } else {
      this.spinner = false;
      this.profileForm.controls.content.setValue('Invalid format, only letters please');
    }
  }

  /**
   * Show or hide form depending on boolean variable
   */
  writeNewLetter(): void {
    this.writeLetter = !this.writeLetter;
  }

  /**
   * Get animation item when the animation is created
   */
  animationCreated(animation : AnimationItem): void {
    this.animationItem = animation;
  }

  /**
   * Destroy animation
   */
  destroyAnimation(): void {
    if (this.animationItem) this.animationItem.destroy();
  }
}
