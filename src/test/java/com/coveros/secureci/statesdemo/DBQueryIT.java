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

import com.coveros.secureci.statesdemo.data_api;

import static org.junit.Assert.*;

public class DBQueryIT {

	private data_api game;

	@Test
 	@Category(com.coveros.secureci.statesdemo.DBQueryIT.class)
	public void FirstIntTest() throws Exception {

		//pass
		System.out.println("foooo!!!1");
		assertNotEquals(1, 2);
		//fail
		//assertEquals(Hangman.LOST, game.status());
	}

}
