import os
import pathlib
import unittest
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

from papers.models import UserRead
from accounts.models import CustomUser

# Sets up web driver using Google chrome
driver = webdriver.Chrome()

class IndexTests(StaticLiveServerTestCase):

    def test_title(self):
        """Make sure title is correct"""

        driver.get(self.live_server_url+reverse('index'))
        self.assertEqual(driver.title, "Inspire Searcher")

    def test_errors(self):
        """Make sure form input is valid"""

        driver.get(self.live_server_url+reverse('index'))
        paper_form_input = driver.find_element_by_id("id_paper_url")
        paper_form_input.send_keys("test")
        paper_form_input.submit()
        try:
            driver.find_element_by_id("errors")
            return 0
        except NoSuchElementException:
            return 1

        paper_form_input = driver.find_element_by_id("id_paper_url")
        paper_form_input.send_keys("test.test")
        paper_form_input.submit()
        try:
            driver.find_element_by_id("errors")
            return 0
        except NoSuchElementException:
            return 1


    def test_valid(self):
        """Make sure no errors on correct input"""
        driver.get(self.live_server_url+reverse('index'))
        paper_form_input = driver.find_element_by_id("id_paper_url")
        paper_form_input.send_keys("inspirehep.net")
        paper_form_input.submit()
        try:
            driver.find_element_by_id("errors")
            return 1
        except NoSuchElementException:
            return 0

    def test_redirect(self):
        """Make sure redirect on correct input"""
        driver.get(self.live_server_url+reverse('index'))
        initial_url = driver.current_url
        paper_form_input = driver.find_element_by_id("id_paper_url")
        paper_form_input.send_keys("inspirehep.net")
        paper_form_input.submit()
        self.assertTrue(driver.current_url != initial_url)
