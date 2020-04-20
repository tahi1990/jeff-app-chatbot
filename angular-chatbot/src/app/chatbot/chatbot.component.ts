import { Component, OnInit } from '@angular/core';
import { ChatControllerService } from '../../swagger';
import { Message } from '../../swagger';

import * as uuid from 'uuid';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  sessionId = uuid.v4();
  websocketEndpoint = 'http://localhost:8080/chat';
  stompClient: any;
  end = false;

  title = 'Jeff App';
  status = 'success';
  messages = [

  ];

  constructor(private chatService: ChatControllerService) { }

  ngOnInit(): void {
    this._connect();
  }

  _connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(this.websocketEndpoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, frame => {
      this.stompClient.subscribe('/topic/message-' + this.sessionId, event => {
        this.onMessageReceived(event);
      });
    }, this.errorCallBack);
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  onMessageReceived(message) {
    const msg: Message = JSON.parse(message.body);

    if(msg.end) {
      this.end = true;
    }

    const msgType = msg.image ? 'file' : 'text';
    this.messages.push({
      text: msg.content,
      type: msgType,
      date: new Date(),
      image: msg.image,
      reply: false,
      user: {
        name: msg.sender,
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });
  }

  sendMessage(messages, event) {
    const msg = {
      sender: this.sessionId,
      content: event.message
    };

    messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        name: 'You',
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });
    this.chatService.sendMessageUsingPOST(msg).subscribe();
  }

}
