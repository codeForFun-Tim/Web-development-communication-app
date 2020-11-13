/* eslint-disable no-undef */

const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');

chrome.setDefaultService(
  new chrome.ServiceBuilder(chromedriver.path).build(),
);
// declare the -web- driver
let driver;
jest.setTimeout(100000);
beforeAll(async () => {
  // initialize the driver before running the tests
  driver = await new Builder().forBrowser('chrome').build();
});

// use the driver to mock user's actions
async function mockUserAction() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/main'));
  await driver.get('http://localhost:3000/main');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(
    until.elementLocated(By.id('textarea')),
    10000,
  );
  // enter text in the textbox
  await textbox.sendKeys('test message', Key.RETURN);
  // click on 'submit' button
  await driver.findElement(By.id('submitbtu')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.className('me')), 10000);
}

describe('Functional Test', () => {
  it('test webpage updated correctly', async () => {
    // call the mock function
    const element = await mockUserAction();
    expect(element).not.toBeNull();
    // expect(returnedText).toBe('test message');
  });
});

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
});
