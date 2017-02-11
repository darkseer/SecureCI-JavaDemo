package com.coveros.tests;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
//import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

import org.junit.*;
import java.util.concurrent.TimeUnit;

public class startPage {
  private WebDriver driver;
  private String baseUrl;
  private String proxyUrl;

  @Before
  public void setUp() throws Exception {
    baseUrl = (String)System.getProperty ("web.url");
    proxyUrl = (String)System.getProperty ("web.proxy");
    
    Proxy proxy = new org.openqa.selenium.Proxy();
    proxy.setHttpProxy(proxyUrl); //.setFtpProxy(proxyUrl).setSslProxy(proxyUrl);
    DesiredCapabilities capabilities = new DesiredCapabilities();
    capabilities.setCapability(CapabilityType.PROXY, proxy);
    
    driver = new HtmlUnitDriver(capabilities);
    //driver = new FirefoxDriver(capabilities);
    //baseUrl = "http://174.129.76.79/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void checkHeader() throws Exception {
	driver.get(baseUrl + "hangman/");
    assertEquals("Hangedman", driver.findElement(By.cssSelector("#header h1")).getText());
  }
  
  @Test
  public void checkStart() throws Exception {
	  driver.get(baseUrl + "hangman/");
	  WebElement word = driver.findElement(By.cssSelector("#introduction h2"));
	  assertTrue("Initial hangman phrase is not empty", word.getText().matches("[_ ]+"));
  }
  
  @Test
  public void testLetter() throws Exception {
	  String letter = "a";

	  driver.get(baseUrl + "hangman/");
	  driver.findElement(By.id("letter")).clear();
	  driver.findElement(By.id("letter")).sendKeys(letter);
	  driver.findElement(By.name("submit")).click();
	  WebElement word = driver.findElement(By.cssSelector("#introduction h2"));
	  String newText = word.getText();
	  if( newText.contains( letter ) ) {
		  assertTrue("Failed to find letter '" + letter + "' in word", newText.contains( letter ) );
	  } else {
		  WebElement guesses = driver.findElement(By.xpath("//div[@id='resources']/p[2]"));
		  assertEquals(letter, guesses.getText());
	  }
  }
  
  @Test
  public void testNumber() throws Exception {
	  String letter = "3";

	  driver.get(baseUrl + "hangman/");
	  driver.findElement(By.id("letter")).clear();
	  driver.findElement(By.id("letter")).sendKeys(letter);
	  driver.findElement(By.name("submit")).click();
	  WebElement error = driver.findElement(By.cssSelector("#introduction h3"));
	  assertEquals("Guesses must be letters.", error.getText());
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
  }
}
