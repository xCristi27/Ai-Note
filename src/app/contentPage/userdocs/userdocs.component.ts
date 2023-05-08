import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SavedChatService } from 'src/app/services/saved-chat.service';

interface CardObject {
  title: string;
  description: string;
}

@Component({
  selector: 'app-userdocs',
  templateUrl: './userdocs.component.html',
  styleUrls: ['./userdocs.component.css']
})

export class UserdocsComponent implements OnInit, OnDestroy {

  cards: CardObject[] = [];
  private savedChatSubscription: Subscription;


  constructor(private savedChatService: SavedChatService ) {}
/*
  ngOnInit(): void {
    this.cards = this.savedChatService.getSavedChats();
    this.savedChatService.getSavedChatsSubject().subscribe(chats => {
      this.cards = chats;
    } )
  }
*/

ngOnInit(): void {
  this.savedChatSubscription = this.savedChatService.getSavedChatsSubject().subscribe(
    (cards: CardObject[]) => {
      this.cards = cards;
    }
  );
}

ngOnDestroy(): void {
  this.savedChatSubscription.unsubscribe();
}


  isEditing = [false, false, false, false, false];


  deleteCard(card: CardObject) {
    const index = this.cards.indexOf(card);
    if (index >= 0) {
      this.cards.splice(index, 1);
    }
    console.log("torol", index);
  }

  editContent(index: number) {
    console.log("bejott ide");
    this.isEditing[index] = true;
    console.log(this.isEditing[index], index);
  }

  finalizeRename(index: number) {
    console.log('Content saved:', this.cards[index].title);
    this.isEditing[index] = false;
  }

  cancel(index: number){
    this.isEditing[index] = false;
  }

  updateTitle(index: number, newTitle: string) {
    this.cards[index].title = newTitle;
  }

}
