package com.jeffapp.chatbot.service;

import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.Intent;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.TextInput;
import com.google.cloud.dialogflow.v2.TextInput.Builder;
import com.google.common.base.Strings;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.jeffapp.chatbot.model.Message;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author tahi1990
 *
 */
@Service
public class DialogflowService {

  private final static String JEFF_APP = "Jeff App";

  @Value( "${google.dialogflow.projectid}" )
  private String projectId;

  private static final Logger logger = LogManager.getLogger(DialogflowService.class);

  public List<Message> request(String sessionId, String message) {
    List<Message> messages = new ArrayList<>();

    // Instantiates a client
    QueryResult queryResult = null;
    try (SessionsClient sessionsClient = SessionsClient.create()) {
      // Set the session name using the sessionId (UUID) and projectID (my-project-id)
      SessionName session = SessionName.of(projectId, sessionId);
      System.out.println("Session Path: " + session.toString());

      // Detect intents for each text input
      // Set the text (hello) and language code (en-US) for the query
      Builder textInput = TextInput.newBuilder().setText(message).setLanguageCode("en");

      // Build the query with the TextInput
      QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

      // Performs the detect intent request
      DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);

      // Display the query result
      queryResult = response.getQueryResult();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }

    if(queryResult != null) {
      for(Intent.Message msg : queryResult.getFulfillmentMessagesList()) {
        Message mess = new Message();
        mess.setSender(JEFF_APP);
        mess.setContent(queryResult.getFulfillmentText());


        if(msg.getCard() != null && !Strings.isNullOrEmpty(msg.getCard().getTitle())) {
          mess.setImage(msg.getCard().getImageUri());
          mess.setContent(msg.getCard().getTitle());
        }

        if(queryResult.getDiagnosticInfo().getFieldsMap().get("end_conversation") != null && queryResult.getDiagnosticInfo().getFieldsMap().get("end_conversation").getBoolValue()) {
          mess.setEnd(true);
        }

        messages.add(mess);

      }
    }

    return messages;
  }

}
