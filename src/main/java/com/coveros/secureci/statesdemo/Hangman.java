/*
 * sample - Class com.coveros.secureci.statesdemo.Hangman
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

import org.flywaydb.core.Flyway;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.apache.commons.dbcp.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.logging.*;

import java.util.LinkedHashSet;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;

/**
 * This guessing game is similar to the "Hangman" game popular with children in
 * the United States. The player tries to guess a word, one letter at a time.
 * The player guesses letters until they have either successfully guessed the
 * word or have reached the maximum number of incorrect guesses allowed.
 */
public class Hangman {
	// Help me
	public static final int IN_PROGRESS = 0;
	public static final int WON = 1;
	public static final int LOST = -1;
	private static final int NUM_LETTERS = 26;
	private static final int DEFAULT_INCORRECT_GUESSES = 6;
	private String answer;
	private int incorrectGuessesAllowed;
	private Set<String> guessedLetters;
	private String dbdriver="org.h2.Driver";
	private String dburl="jdbc:h2:mem:country";
	private String dbuser="speaker"; 
	private String dbpassword="test123";
	private String hibernate_dialect=null;

	public Hangman(final String answer, final int incorrectGuessesAllowed) {
		this.answer = answer;
		this.incorrectGuessesAllowed = incorrectGuessesAllowed;
		this.guessedLetters = new LinkedHashSet<String>(NUM_LETTERS);
		try {
			this.flyway();
			System.out.println("Props1:" + this.dbdriver);
			System.out.println("Props2:" + this.dburl);
			System.out.println("Props3:" + this.dbuser);
			System.out.println("Props4:" + this.dbpassword);
			System.out.println("Props5:" + this.hibernate_dialect);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Hangman(final String answer) {
		this(answer, DEFAULT_INCORRECT_GUESSES);
		try {
			this.flyway();
			System.out.println("Props1:" + this.dbdriver);
			System.out.println("Props2:" + this.dburl);
			System.out.println("Props3:" + this.dbuser);
			System.out.println("Props4:" + this.dbpassword);
			System.out.println("Props5:" + this.hibernate_dialect);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String states() throws Exception {

		Statement stmt = null;
		String query = "select id,state_name,capital_name from states;";
		String states = new String();

		try {
			Connection con = null;
			Properties connectionProps = new Properties();
			connectionProps.put("user", this.dbuser);
			connectionProps.put("password", this.dbpassword);

			// con =
			// DriverManager.getConnection("jdbc:h2:tcp://127.0.0.1:9902/mem:country",
			// connectionProps);
			con = DriverManager.getConnection(this.dburl, connectionProps);

			stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				String state_name = rs.getString("state_name");
				String capital_name = rs.getString("capital_name");
				int id = rs.getInt("id");

				states = states + "<p>" + state_name + "\t" + capital_name + "\t" + id + "</p>";
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}

		return states;
	}

	public BasicDataSource dataSource() {
		BasicDataSource ds = new BasicDataSource();
		/*
		 * ds.setDriverClassName(env.getProperty("db.driver"));
		 * ds.setUrl(env.getProperty("db.url"));
		 * LOGGER.info("PROPERTIES: Loaded property: db.url" +
		 * env.getProperty("db.url"));
		 * 
		 * ds.setUsername(env.getProperty("db.user"));
		 * ds.setPassword(env.getProperty("db.password"));
		 */

		ds.setDriverClassName(this.dbdriver);
		// ds.setUrl("jdbc:h2:tcp://127.0.0.1:9902/mem:country");
		ds.setUrl(this.dburl);
		ds.setUsername(this.dbuser);
		ds.setPassword(this.dbpassword);
		return ds;
	}

	public Flyway flyway() {
		Flyway flyway = new Flyway();
		flyway.setBaselineOnMigrate(true);

		flyway.setDataSource(dataSource());
		flyway.clean();
		flyway.repair();
		flyway.migrate();
		System.out.println("Flyway Migration Complete");
		try {
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			InputStream input = classLoader.getResourceAsStream("env.properties");
		    Properties properties = new Properties();
		    if (input != null ){
		      properties.load(input);
		      this.dbdriver=new String(properties.getProperty("db.driver"));
		      this.dburl=new String(properties.getProperty("db.url"));
		      this.hibernate_dialect=new String(properties.getProperty("hibernate.dialect"));
		      this.dbuser=new String(properties.getProperty("db.user"));
		      this.dbpassword=new String(properties.getProperty("db.password"));
		    }
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return flyway;
	}

}
