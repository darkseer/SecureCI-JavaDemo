/*
 * sample - Class com.coveros.secureci.sample.Hangman
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

package com.coveros.secureci.sample;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This guessing game is similar to the "Hangman" game popular with children in
 * the United States. The player tries to guess a word, one letter at a time.
 * The player guesses letters until they have either successfully guessed the
 * word or have reached the maximum number of incorrect guesses allowed.
 */
public class Hangman {

	public static final int IN_PROGRESS = 0;
	public static final int WON = 1;
	public static final int LOST = -1;
	private static final int NUM_LETTERS = 26;
	private static final int DEFAULT_INCORRECT_GUESSES = 6;
	private String answer;
	private int incorrectGuessesAllowed;
	private Set<String> guessedLetters;

	public Hangman(final String answer, final int incorrectGuessesAllowed) {
		this.answer = answer;
		this.incorrectGuessesAllowed = incorrectGuessesAllowed;
		this.guessedLetters = new LinkedHashSet<String>(NUM_LETTERS);
	}

	public Hangman(final String answer) {
		this(answer, DEFAULT_INCORRECT_GUESSES);
	}

	public String showAnswer() {
		return this.getAnswer();
	}

	private String getAnswer() {
		return this.answer;
	}

	private String getAnswerLowerCase() {
		final String answer = this.getAnswer();
		return answer.toLowerCase();
	}

	public int getIncorrectGuessesAllowed() {
		return this.incorrectGuessesAllowed;
	}

	public void setIncorrectGuessesAllowed(final int incorrectGuessesAllowed) {
		this.incorrectGuessesAllowed = incorrectGuessesAllowed;
	}

	private void addGuessedLetter(final String s) {
		this.guessedLetters.add(s);
	}

	private Set<String> getGuessedLetters() {
		// returns a copy, so the user can play with it safely
		return new LinkedHashSet<String>(this.guessedLetters);
	}

	public boolean guess(final char c) {
		if (Hangman.IN_PROGRESS != this.status()) {
			throw new IllegalStateException("Game is over. No more guessing.");
		}
		if (!Character.isLetter(c)) {
			throw new IllegalArgumentException("Guesses must be letters.");
		}
		final String s = Character.toString(c);
		this.addGuessedLetter(s.toLowerCase()); // duplicates will be ignored
		return this.getAnswerLowerCase().contains(s);
	}

	public String showCurrentDisplay() {
		// include underscore in class just in case it is otherwise empty
		final Pattern p = Pattern.compile("[^" + this.showCorrectLetters() + "_]");
		final Matcher m = p.matcher(this.answer);
		String display = m.replaceAll("_");
		display = display.replaceAll("(.)", "$1 ");
		return display;
	}

	public Set<String> getIncorrectGuesses() {
		final String answerLc = this.getAnswerLowerCase();
		Set<String> incorrect = new LinkedHashSet<String>(); // want to keep order
		final Set<String> guesses = this.getGuessedLetters();
		for (String guess : guesses) {
			if (!answerLc.contains(guess)) {
				incorrect.add(guess);
			}
		}
		return incorrect;
	}

	private static String setToString(final Set<String> set) {
		StringBuilder sb = new StringBuilder();
		for (String letter : set) {
			sb.append(letter);
		}
		return sb.toString();
	}

	public String showIncorrectLetters() {
		final Set<String> incorrect = this.getIncorrectGuesses();
		return Hangman.setToString(incorrect);
	}

	private String showCorrectLetters() {
		final Set<String> incorrect = this.getIncorrectGuesses();
		Set<String> correct = new LinkedHashSet<String>(this.getGuessedLetters());
		correct.removeAll(incorrect);
		return Hangman.setToString(correct);
	}

	public int status() {
		int status;
		final String answer = this.getAnswer();
		String correctGuesses = this.showCurrentDisplay();
		correctGuesses = correctGuesses.replaceAll("(\\s)", "");
		if (answer.equals(correctGuesses)) {
			status = Hangman.WON;
		} else {
			final Set<String> incorrect = this.getIncorrectGuesses();
			final int maxIncorrectGuesses = this.getIncorrectGuessesAllowed();
			if (incorrect.size() < maxIncorrectGuesses) {
				status = Hangman.IN_PROGRESS;
			} else {
				status = Hangman.LOST;
			}
		}
		return status;
	}

  // Bogus method to add more code without coverage
	public int status2() {
		int status;
		final String answer = this.getAnswer();
		String correctGuesses = this.showCurrentDisplay();
		correctGuesses = correctGuesses.replaceAll("(\\s)", "");
		if (answer.equals(correctGuesses)) {
			status = Hangman.WON;
		} else {
			final Set<String> incorrect = this.getIncorrectGuesses();
			final int maxIncorrectGuesses = this.getIncorrectGuessesAllowed();
			if (incorrect.size() < maxIncorrectGuesses) {
				status = Hangman.IN_PROGRESS;
			} else {
				status = Hangman.LOST;
			}
		}
		return status;
	}

}
