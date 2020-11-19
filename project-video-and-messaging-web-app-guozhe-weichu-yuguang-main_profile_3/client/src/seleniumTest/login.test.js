const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('chromedriver');
const fetch = require('node-fetch');

let driver;
beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
});
afterAll(async () => {
  await driver.quit();
});

beforeEach(async () => {
  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');
});
async function loginOK() {
  await driver
    .findElement(By.className('userName'))
    .sendKeys('timqi@seas.upenn.edu');
  await driver
    .findElement(By.className('pass'))
    .sendKeys('12345', Key.RETURN);
  driver.wait(until.urlIs('http://localhost:3000'), 200);
}

async function loginFailure() {
  await driver
    .findElement(By.className('userName'))
    .sendKeys('timqi@seas.upenn.edu');
  await driver
    .findElement(By.className('pass'))
    .sendKeys('', Key.RETURN);
}

async function loginNoPass() {
  await driver
    .findElement(By.className('userName'))
    .sendKeys('timqi@seas.upenn.edu', Key.RETURN);
}

async function loginNoUserName() {
  await driver
    .findElement(By.className('pass'))
    .sendKeys('abc', Key.RETURN);
}

it('login failed', async () => {
  await loginFailure();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/login');
  await driver
    .findElement(By.className('LoginStatus'))
    .getText()
    .then((text) => {
      expect(text).not.toBe('');
    });
});

it('login without password', async () => {
  await loginNoPass();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/login');
  await driver
    .findElement(By.className('LoginStatus'))
    .getText()
    .then((text) => {
      expect(text).not.toBe('');
    });
});

it('login without username', async () => {
  await loginNoUserName();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/login');
  await driver
    .findElement(By.className('LoginStatus'))
    .getText()
    .then((text) => {
      expect(text).not.toBe('');
    });
});

it('go to register page', async () => {
  driver.wait(until.urlIs('http://localhost:3000/Register'));
  await driver.findElement(By.className('RegisterLink')).click();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/Register');
});

it('back to login after register', async () => {
  await driver.get('http://localhost:3000/login');
  driver.wait(until.urlIs('http://localhost:3000'));
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000');
});
