import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CollectionReference, DocumentData, addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { LoginComponent } from './commponet/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'recipe-app';
  constructor(private firestore : Firestore){}
  public ngOnInit(): void {
    // const testcolloction: CollectionReference <DocumentData , DocumentData> = collection(this.firestore,'test')
    // addDoc(testcolloction,{text:'hello '})
  }
}
