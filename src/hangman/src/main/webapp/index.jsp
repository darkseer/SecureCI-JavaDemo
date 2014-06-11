<?xml version="1.0" encoding="utf-8"?>
<%@ page language="java" pageEncoding="utf-8" %>
<%@ page import="com.coveros.secureci.sample.Hangman, java.io.*, java.util.*" %>

<!--
  sample - index.jsp
 
  Copyright 2010 Coveros, Inc.
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<%
	String status = "Please enter a letter.";
	Hangman hangman = null;

	// word passed in (for testing)	
	String word = request.getParameter("word");
	if (null != word)  {
	  hangman = new Hangman(word);
		session.setAttribute("hangman", hangman);		
	}

	String newGame = request.getParameter("new");
	hangman = (Hangman)(session.getAttribute("hangman"));
	if ((null == hangman) || (null != newGame)) {
	  // read a file of words
	  List<String> words = new ArrayList<String>();
 		InputStream in = config.getServletContext().getResourceAsStream("/WEB-INF/dictionary.txt");
 		BufferedReader reader = new BufferedReader(new InputStreamReader(in));
 		String line = null;
 		while (null != (line = reader.readLine())) {
 			if (!line.isEmpty()) {
 				words.add(line);
 			}
 		}
 		
 		// pick a random word from the list
 		Random random = new Random();
 		int rndNum = random.nextInt(words.size());
	  hangman = new Hangman(words.get(rndNum));
		session.setAttribute("hangman", hangman);		
	}
	
	String letter = request.getParameter("letter");
	if ((null != letter) && (0 < letter.length())) {
		char guess = letter.charAt(0);
		try {
      hangman.guess(guess);
      if (Hangman.WON == hangman.status()) {
        status = "<span class='won'>You won!!!</span>";
      } else if (Hangman.LOST == hangman.status()) {
	      status = "<span class='lost'>You lost!</span> The word was: <br/>" + hangman.showAnswer();
      }
		} catch (IllegalStateException ise) {
      status = "<span class='lost'>You lost!</span> The word was: <br/>" + hangman.showAnswer();
    } catch (IllegalArgumentException iae) {
      status = "Guesses must be letters.";
		}
	}
	
	int remaining = hangman.getIncorrectGuessesAllowed() - hangman.getIncorrectGuesses().size();	
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Hangman</title>
	  <link rel="stylesheet" href="stylesheets/screen.css" type="text/css" media="screen" charset="utf-8"/>
	  <link rel="stylesheet" href="stylesheets/print.css" type="text/css" media="print" charset="utf-8"/>
	  <!--[if lte IE 6]><link rel="stylesheet" href="stylesheets/lib/ie.css" type="text/css" media="screen" charset="utf-8"/><![endif]-->
	</head>

	<body>
		<div id="page">
		  <div id="header">
		    <h1>Hangedman</h1>
            <p><em>A demonstration web application for continuous delivery.</em></p>
		  </div>
		  
		  <div id="body" class="wrapper">
		    <div id="introduction">
		      <h2 style="color:blue;"><%= hangman.showCurrentDisplay() %></h2>
		      <h3><%=status%></h3>
		      <% if (Hangman.IN_PROGRESS == hangman.status()) { %>
			      <form action="<%= request.getRequestURI() %>" method="post" class="hform">
			        <fieldset>
			          <input maxlength="1" size="5" type="text" name="letter" value="" id="letter"/>
			          <input type="submit" name="submit" value="Guess" class="button"/>
			        </fieldset>        
			      </form>
		      <% } else { %>
			      <form action="<%= request.getRequestURI() %>" method="post" class="hform">
			        <fieldset>
			          <input type="hidden" name="new" value="true"/>
			          <input type="submit" name="submit" value="New Game" class="button"/>
			        </fieldset>        
			      </form>
		      <% } %>
		    </div>
		    <div id="resources">
		      <h3>Number of Incorrect Guesses Remaining:</h3>
		      <p><%= remaining %></p>
		      <img src="images/hangman-<%= remaining %>.png" alt="<%= remaining %> guesses left"/>
		      <% if (0 < hangman.getIncorrectGuesses().size()) { %>
			      <h3>Incorrect Guesses:</h3>
			      <p><%= hangman.showIncorrectLetters() %></p>
		      <% } %>
		    </div>
		  </div>
		</div>
	</body>
</html>
