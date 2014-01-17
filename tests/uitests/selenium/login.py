from selenium import selenium
import unittest, time, re

class test2_remote(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("192.168.1.8", 4444, "*firefox", "http://www.bbc.co.uk/")
        self.selenium.start()
    
    def test_test2_remote(self):
        sel = self.selenium
        sel.open("/")
        sel.click("link=News")
        sel.wait_for_page_to_load("30000")
        sel.click("link=Tech")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
