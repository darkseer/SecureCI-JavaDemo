/*
 * sample - Class com.coveros.secureci.sample.HangmanTest
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

import org.junit.Test;

import com.coveros.secureci.sample.Hangman;

import static org.junit.Assert.*;

public class HangmanTest {

	private Hangman game;

	@Test
	public void testGameSetup() throws Exception {
		game = new Hangman("word");
		assertEquals("word", game.showAnswer());
		assertEquals(6, game.getIncorrectGuessesAllowed());
		game = new Hangman("beautiful", 3);
		assertEquals(3, game.getIncorrectGuessesAllowed());
	}

	@Test
	public void testGuesses() throws Exception {
		game = new Hangman("layers");
		assertFalse(game.guess('b'));
		assertTrue(game.guess('s'));
		assertTrue(game.guess('e'));
		assertFalse(game.guess('z'));
	}

	@Test
	public void testShowCurrentDisplay() throws Exception {
		game = new Hangman("chair");
		assertEquals("_ _ _ _ _ ", game.showCurrentDisplay());
		assertTrue(game.guess('h'));
		assertEquals("_ h _ _ _ ", game.showCurrentDisplay());
		assertTrue(game.guess('r'));
		assertEquals("_ h _ _ r ", game.showCurrentDisplay());
		assertFalse(game.guess('z'));
		assertEquals("_ h _ _ r ", game.showCurrentDisplay());
		game.guess('c');
		game.guess('a');
		game.guess('i');
		assertEquals("c h a i r ", game.showCurrentDisplay());
	}

	@Test
	public void testCurrentDisplayWithRepeatedLetters() throws Exception {
		game = new Hangman("tasty");
		game.guess('t');
		assertEquals("t _ _ t _ ", game.showCurrentDisplay());
	}

	@Test
	public void testSavingIncorrectLetters() throws Exception {
		game = new Hangman("loquacious");
		game.guess('o');
		assertEquals("", game.showIncorrectLetters());
		game.guess('t');
		assertEquals("t", game.showIncorrectLetters());
		game.guess('j');
		assertEquals("tj", game.showIncorrectLetters());
	}

	@Test
	public void testWinning() throws Exception {
		game = new Hangman("easy");
		game.guess('s');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('a');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('y');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('e');
		assertEquals(Hangman.WON, game.status());
	}

	@Test
	public void testLosing() throws Exception {
		game = new Hangman("hard");
		game.guess('b');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('c');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('e');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('a');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('f');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('g');
		assertEquals(Hangman.IN_PROGRESS, game.status());
		game.guess('i');
		assertEquals(Hangman.LOST, game.status());
	}

	@Test
	public void testGuessingAfterGameOver() throws Exception {
		game = new Hangman("to");
		game.guess('t');
		game.guess('o');

		try {
			game.guess('e');
			fail("Should not allow guessing after game over");
		} catch (IllegalStateException ise) {
			// expected
		}
	}

	@Test
	public void testVeryLongWord() throws Exception {
		game = new Hangman("supercalifragilistic");
		game.guess('s');
		game.guess('u');
		game.guess('p');
		game.guess('e');
		game.guess('r');
		game.guess('c');
		game.guess('a');
		game.guess('l');
		game.guess('i');
		game.guess('f');
		game.guess('g');
		game.guess('t');
		assertEquals(Hangman.WON, game.status());
	}

}
