<?xml version="1.0" encoding="utf-8"?>
<%@ page language="java" pageEncoding="utf-8"%>
<%@ page
	import="com.coveros.secureci.sample.Hangman, java.io.*, java.util.*"%>

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
	String status = "Please enter a letter please.";
	Hangman hangman = new Hangman("test");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Hangman</title>
<link rel="stylesheet" href="stylesheets/screen.css" type="text/css"
	media="screen" charset="utf-8" />
<link rel="stylesheet" href="stylesheets/print.css" type="text/css"
	media="print" charset="utf-8" />
<!--[if lte IE 6><link rel="stylesheet" href="stylesheets/lib/ie.css" type="text/css" media="screen" charset="utf-8"/><![endif]-->
</head>

<body>

	<h1>Hangman</h1>
	<p>
		<em>Not the coolest app in the world</em>
	</p>



	<p><%=hangman.states()%></p>

</body>
</html>
