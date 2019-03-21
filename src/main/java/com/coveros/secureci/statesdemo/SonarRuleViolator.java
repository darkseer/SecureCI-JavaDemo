package com.coveros.secureci.statesdemo;

import java.io.File;
import java.io.IOException;

public class SonarRuleViolator {

	public void infiniteLoop() {
		while (true) {
			/* Uncomment this to fix rule violation */
//			break;
		}
	}
	
	public static void doSomethingWhichThrowsException(int q) {
		  try {
		    throw new RuntimeException();
		  } finally {
		    for (int i = 0; i < 10; i ++) {
		      //...
		      if (q == i) {
		        break; // ignored
		      }
		    }

		    /* Noncompliant - prevents the RuntimeException from being propagated */
		    return;    
		  }
		}
}
