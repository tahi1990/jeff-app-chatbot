package com.jeffapp.chatbot.controller;

import com.jeffapp.chatbot.model.Message;
import com.jeffapp.chatbot.service.DialogflowService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author tahi1990
 *
 */
@RestController
@RequestMapping("/message")
public class ChatController {

  DialogflowService dialogflowService;
  SimpMessageSendingOperations messagingTemplate;

  @Autowired
  public void setDialogflowService(DialogflowService dialogflowService) {
    this.dialogflowService = dialogflowService;
  }

  @Autowired
  public void setMessagingTemplate(
      SimpMessageSendingOperations messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  @PostMapping
  public ResponseEntity<Void> sendMessage(@RequestBody Message message) {
    List<Message> messages = dialogflowService.request(message.getSender(), message.getContent());

    for(Message mess : messages) {
      messagingTemplate.convertAndSend("/topic/message-" + message.getSender(), mess);
    }

    return ResponseEntity.status(HttpStatus.OK).build();
  }

}
