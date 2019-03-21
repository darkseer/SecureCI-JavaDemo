package com.coveros.secureci.statesdemo;

public class SonarRuleViolator {

	public void infiniteLoop() {
		while (true) {
			/* Uncomment this to fix rule violation */
//			break;
		}
	}

}
