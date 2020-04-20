package com.jeffapp.chatbot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeffapp.chatbot.model.Message;
import com.jeffapp.chatbot.service.DialogflowService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(Lifecycle.PER_CLASS)
public class ChatbotApplicationIntegrationTests {

  private final static String URI = "/message";
  private final static String SESSIONID = "sessionId";

  @MockBean
  private DialogflowService dialogflowService;

  @MockBean
  private SimpMessagingTemplate messagingTemplate;

  @Autowired
  private WebApplicationContext wac;

  private MockMvc mockMvc;

  @BeforeAll
  public void setup() {
    this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
  }

  @Test
  public void testPostMessage() throws Exception {
    Message message = new Message();
    message.setSender("Sender");
    message.setContent("Content");

    ObjectMapper mapper = new ObjectMapper();
    String jsonString = mapper.writeValueAsString(message);

    List<Message> messages = Arrays.asList(message);
    given(dialogflowService.request("Sender", "Content")).willReturn(messages);

    // Post Message
    this.mockMvc
        .perform(MockMvcRequestBuilders.post(URI)
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonString)
            .accept(MediaType.APPLICATION_JSON))
        .andDo(print()).andExpect(status().isOk());
  }

}
