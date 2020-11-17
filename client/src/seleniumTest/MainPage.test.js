/* eslint-disable no-undef */
import Avatar from '../images/AvatarCat.png';
import audioDemo from '../media/audioDemo.mp3';
import videoDemo from '../media/videoDemo.mp4';

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

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
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

// use the driver to mock user's actions of sending image
async function mockUserAction1() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/main'));
  await driver.get('http://localhost:3000/main');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(
    until.elementLocated(By.id('textarea')),
    10000,
  );
  // enter text in the textbox
  const imgDiv = `<img src=${Avatar} alt="The picture is gone.">`;

  await textbox.sendKeys(imgDiv, Key.RETURN);
  // click on 'submit' button
  await driver.findElement(By.id('submitbtu')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.className('me')), 10000);
}

describe('Functional Test Sending Image', () => {
  it('test webpage updated correctly', async () => {
    // call the mock function
    const element = await mockUserAction1();
    expect(element).not.toBeNull();
    // expect(returnedText).toBe('test message');
  });
});

// use the driver to mock user's actions of sending audio
async function mockUserAction2() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/main'));
  await driver.get('http://localhost:3000/main');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(
    until.elementLocated(By.id('textarea')),
    10000,
  );
  // enter text in the textbox
  const audioDiv =
    '<audio controls>' +
    `<source src=${audioDemo} type="audio/mpeg">` +
    'Your browser does not support the audio element.' +
    '</audio>';
  await textbox.sendKeys(audioDiv, Key.RETURN);
  // click on 'submit' button
  await driver.findElement(By.id('submitbtu')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.className('me')), 10000);
}

describe('Functional Test Sending Audio', () => {
  it('test webpage updated correctly', async () => {
    // call the mock function
    const element = await mockUserAction2();
    expect(element).not.toBeNull();
    // expect(returnedText).toBe('test message');
  });
});

// use the driver to mock user's actions of sending video
async function mockUserAction3() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/main'));
  await driver.get('http://localhost:3000/main');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(
    until.elementLocated(By.id('textarea')),
    10000,
  );
  // enter text in the textbox
  const videoDiv =
    '<video width="320" height="240" controls>' +
    `<source src=${videoDemo} type="video/mp4">` +
    'Your browser does not support the video tag.' +
    '</video>';
  await textbox.sendKeys(videoDiv, Key.RETURN);
  // click on 'submit' button
  await driver.findElement(By.id('submitbtu')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.className('me')), 10000);
}

describe('Functional Test Sending Video', () => {
  it('test webpage updated correctly', async () => {
    // call the mock function
    const element = await mockUserAction3();
    expect(element).not.toBeNull();
    // expect(returnedText).toBe('test message');
  });
});
