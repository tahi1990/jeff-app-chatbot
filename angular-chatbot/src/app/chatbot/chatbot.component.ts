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

    if (msg.end) {
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
        avatar: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzBweCIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgNzAgNzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA2MiAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT4zNEE0OEE2OC1FNTU5LTQxOTMtOTU1MC0yQTU1QUNGODZCMkM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPGZpbHRlciB4PSItMjcuNiUiIHk9Ii0yNy42JSIgd2lkdGg9IjE1NS4yJSIgaGVpZ2h0PSIxNTUuMiUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0xIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMC4xMTI0ODkwNzMgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgcmVzdWx0PSJzaGFkb3dNYXRyaXhPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICAgICAgPGZlTWVyZ2U+CiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgPC9mZU1lcmdlPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkxvY2F0aW9uLVNlbGVjdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNzEuMDAwMDAwLCAtNDI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR2xvYmFsLWZsYWciIGZpbHRlcj0idXJsKCNmaWx0ZXItMSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyNzcuMDAwMDAwLCA0MzEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjkiIGN5PSIyOSIgcj0iMjkiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzREODNGRiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC4yOTYyNDAsIDE2Ljk2NDY0MCkgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtNC4yOTYyNDAsIC0xNi45NjQ2NDApICIgY3g9IjQuMjk2MjM5ODQiIGN5PSIxNi45NjQ2NDAxIiByPSI0LjI5NjIzOTg0Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiM0RDgzRkYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2Ljk2NDY0MCwgNC4yOTYyNDApIHJvdGF0ZSgtOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTE2Ljk2NDY0MCwgLTQuMjk2MjQwKSAiIGN4PSIxNi45NjQ2NDAxIiBjeT0iNC4yOTYyMzk4NCIgcj0iNC4yOTYyMzk4NCI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTIiIGZpbGw9IiMwQ0JFMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5LjYzMzA0MCwgMTYuOTY0NjQwKSByb3RhdGUoLTkwLjAwMDAwMCkgdHJhbnNsYXRlKC0yOS42MzMwNDAsIC0xNi45NjQ2NDApICIgY3g9IjI5LjYzMzA0MDQiIGN5PSIxNi45NjQ2NDAxIiByPSI0LjI5NjIzOTg0Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHktMyIgZmlsbD0iIzBDQkUwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuOTY0NjQwLCAyOS42MzMwNDApIHJvdGF0ZSgtOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTE2Ljk2NDY0MCwgLTI5LjYzMzA0MCkgIiBjeD0iMTYuOTY0NjQwMSIgY3k9IjI5LjYzMzA0MDQiIHI9IjQuMjk2MjM5ODQiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=',
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
        name: 'You'
      },
    });
    this.chatService.sendMessageUsingPOST(msg).subscribe();
  }

}
