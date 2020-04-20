package com.jeffapp.chatbot.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author tahi1990
 *
 */
@NoArgsConstructor
public class Message {

  @Getter @Setter
  private String sender;

  @Getter @Setter
  private String content;

  @Getter @Setter
  private String image;

  @Getter @Setter
  private boolean end;

}
