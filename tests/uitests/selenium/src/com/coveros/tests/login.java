package com.coveros.tests;

import com.thoughtworks.selenium.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;

public class login {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		selenium = new DefaultSelenium("selenium.demo.secureci.com", 4444, "*firefox", (String)System.getProperty ("web.url"));
		selenium.start();
	}

	@Test
	public void testLogin() throws Exception {

		selenium.open("/hangman/");
		assertTrue("Failed to find front page marker.", selenium.isTextPresent("hangman"));
		selenium.type("id=letter", "a");
		selenium.click("name=submit");
		selenium.waitForPageToLoad("30000");
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
