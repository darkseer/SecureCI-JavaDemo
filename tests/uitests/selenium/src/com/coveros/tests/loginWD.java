

import java.util.concurrent.TimeUnit;

import org.junit.*;

import static org.junit.Assert.*;

import org.openqa.selenium.*;
//import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

public class loginWD {
  private WebDriver driver;
  private String baseUrl;

  @Before
  public void setUp() throws Exception {
    driver = new HtmlUnitDriver();
    //driver = new FirefoxDriver();
    baseUrl = (String)System.getProperty ("web.url")
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

  @After
  public void tearDown() throws Exception {
    driver.quit();
  }
}
