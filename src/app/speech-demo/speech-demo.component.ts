import { Component, Renderer2, OnInit, ElementRef } from '@angular/core';
import { AudioRecordService, RecordedAudioOutput } from '../services/audio-record.service';
import { WhisperapiService } from '../services/whisperapi.service';
import { FileSaverService } from 'ngx-filesaver';
import { InputServiceService } from '../services/input-service.service';

import { ChatLogComponent } from '../chat-log/chat-log.component';
import { ChatLogService } from '../services/chat-log.service';

// Bugs to fix:
// Saved wav file has no length - WhisperAPI works nonetheless
// After every reply (Excluding the first), you get more replis (n+2)??
// Speech Demo (THIS) was debugged, it's fine. The problem is somewhere else 

@Component({
  selector: 'app-speech-demo',
  templateUrl: './speech-demo.component.html',
  styleUrls: ['./speech-demo.component.css']
})
export class SpeechDemoComponent {
  protected inputValue: string = '';
  getResponsePressed: boolean = true;
  getImagePressed: boolean = false;
  

  constructor(private inputService: InputServiceService, private chatService: ChatLogService,private whisper: WhisperapiService, private audioRecordService: AudioRecordService, private fileSaverService: FileSaverService, private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  private rec: boolean = false;
  onMicClick() {
    const micBtn = document.getElementById('mic-btn');

    if (!this.rec) {
      this.onStartRecording();
      
      // Adds rec animation
      this.renderer.addClass(micBtn, 'pulse-animation');
    } else {
      this.onStopRecording();
      
      // Removes rec animation
      this.renderer.removeClass(micBtn, 'pulse-animation');
    }

    this.rec = !this.rec;
  }

  onStartRecording() {
    this.audioRecordService.startRecording();
  }

  onStopRecording() {
    this.audioRecordService.stopRecording();
    this.audioRecordService.getRecordedBlob().subscribe(async (audioOutput: RecordedAudioOutput) => {
      const blob = audioOutput.blob;
      const title = audioOutput.title;
      const file = new File([blob], title, { type: "audio/mp3" });

      // Saves the file for the user
      /* this.fileSaverService.save(blob, title); */

        const recognizedText = await this.whisper.convertSpeechToText(file);
        console.log(recognizedText);

        // Writes the transcription in the input field
        this.inputValue = recognizedText;
        this.getResponse();
    });
  }


  getResponse(): void {
    if (this.inputValue === '/clear') {
      this.chatService.clearChats();
      /* this.chats = []; */
      this.inputValue = '';
      window.location.reload();
      return;
    } else if (this.getResponsePressed){
      console.log("Generating reply...")
      this.inputService.getTextResponse(this.inputValue).subscribe(response => {
        const output = response.choices[0].message.content;
        console.log(output);
        this.chatService.addChat(this.inputValue, output);
        this.inputValue = '';
      });
    }
    else{
      console.log("Generating image...")
      this.inputService.getImageResponse(this.inputValue).subscribe(response => {
        const output = response.data[0].url;
        console.log(output);
        this.chatService.addImg(this.inputValue, output);

        this.inputValue = '';
      });
    }
  }
  
  getText() {
    this.getResponsePressed = true;
    this.getImagePressed = false;
  }

  getImage() {
    this.getImagePressed = true;
    this.getResponsePressed = false;
  }

  getChats(): void {
    this.chatService.getChats().subscribe(chats => {
      console.log(chats);
      // ...
    });
  }
}
