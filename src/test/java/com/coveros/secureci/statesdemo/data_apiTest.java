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

import com.coveros.secureci.statesdemo.data_api;

import static org.junit.Assert.*;

public class data_apiTest {

	private data_api game;



	@Test
	public void testVeryLongWord() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test1() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test2() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test3() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test4() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test5() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test6() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}
	@Test
	public void test7() throws Exception {
		String test=null;

		game = new data_api("test");
		test=game.states();
		//pass
		assertNotEquals(null, test);
		//fail
		//assertEquals(data_api.LOST, game.status());
	}

}
