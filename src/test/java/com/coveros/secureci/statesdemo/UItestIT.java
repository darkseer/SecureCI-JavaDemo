/*
 * sample - Class com.coveros.secureci.statesdemo.HangmanTest
 * 
 * Copyright 2010 Coveros, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.coveros.secureci.statesdemo;

import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;

import com.coveros.secureci.statesdemo.Hangman;

import static org.junit.Assert.*;

import java.io.File;

public class UItestIT {

	private Hangman game;

	@Test
 	@Category(com.coveros.secureci.statesdemo.UItestIT.class)
	public void SecondIntTest()  throws InterruptedException {
		//System.setProperty("webdriver.gecko.driver", "/home/buckholz/gecko/geckodriver");

		
		// Create a new instance of the Firefox driver
		FirefoxBinary binary = new FirefoxBinary(new File("/usr/bin/firefox"));
		FirefoxProfile profile = new FirefoxProfile();
		WebDriver driver = new FirefoxDriver(binary, profile);
		
        //Launch the Online Store Website
		driver.get("https://cnn.com");
 
        // Print a Log In message to the screen
        System.out.println("Successfully opened the website www.google.com");
 
		//Wait for 5 Sec
		Thread.sleep(5);
		
        // Close the driver
        driver.quit();
    }
}
