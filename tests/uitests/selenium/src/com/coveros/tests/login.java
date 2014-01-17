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
		selenium = new DefaultSelenium("192.168.1.22", 4444, "*firefox", (String)System.getProperty ("web.url"));
		selenium.start();
	}

	@Test
	public void testLogin() throws Exception {
		selenium.open("/");
		selenium.type("id=edit-name", "admin");
		selenium.type("id=edit-pass", "test#123");
		selenium.click("id=edit-submit");
		selenium.waitForPageToLoad("30000");
		assertTrue("Failed to find front page marker.", selenium.isTextPresent("test"));
		selenium.click("link=Log out");
		selenium.waitForPageToLoad("30000");
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
