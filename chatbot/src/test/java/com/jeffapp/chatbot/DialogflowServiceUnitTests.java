package com.jeffapp.chatbot;


import com.jeffapp.chatbot.model.Message;
import com.jeffapp.chatbot.service.DialogflowService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class DialogflowServiceUnitTests {

  @Test
  public void testRequest() {
    DialogflowService dialogflowService = new DialogflowService();
    ReflectionTestUtils.setField(dialogflowService, "projectId", "jeff-app-chatbot-htsnrj");

    String sessionId = UUID.randomUUID().toString();
    List<Message> messages = dialogflowService.request(sessionId, "Hi");
    assertTrue(messages.size() > 0);

    messages = dialogflowService.request(sessionId, "Hiep");
    assertTrue(messages.size() > 0);

    messages = dialogflowService.request(sessionId, "Nguyen");
    assertTrue(messages.size() > 0);

    messages = dialogflowService.request(sessionId, "tahi1990@gmail.com");
    assertTrue(messages.size() > 0);

    messages = dialogflowService.request(sessionId, "08/11/1990");
    assertTrue(messages.size() > 0);

    messages = dialogflowService.request(sessionId, "Home");
    assertTrue(messages.size() > 0);
  }

}
