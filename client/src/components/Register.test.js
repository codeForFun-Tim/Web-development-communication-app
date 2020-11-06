
const rootUrl = 'http://localhost:3000';
const {
  Builder, By, Key, until,
} = require('selenium-webdriver');
require('chromedriver');
require('selenium-webdriver/chrome');
const fetch = require('node-fetch');

let driver;
beforeAll(async () => { driver = await new Builder().forBrowser('chrome').build(); });
afterAll(async () => { await driver.quit(); });

beforeEach(async () => {
  driver.wait(until.urlIs('http://localhost:3000/Register'));
  await driver.get('http://localhost:3000/Register');
});


async function registerOK() {
  await fetch(`${rootUrl}/user/timqi`, { method: 'DELETE' })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(async () => {
      await driver.findElement(By.className('userName')).sendKeys('timqi@seas.upenn.edu');
      await driver.findElement(By.className('nickName')).sendKeys('timqi');
      await driver.findElement(By.className('pass')).sendKeys('12345');
      await driver.findElement(By.className('registerBtn2')).click();
    })
    .catch((err) => console.log(err));
}

async function registerNoEmail() {
  await driver.findElement(By.className('nickName')).sendKeys('timqi');
  await driver.findElement(By.className('pass')).sendKeys('abc', Key.RETURN);
}

async function registerNoPass() {
  await driver.findElement(By.className('nickName')).sendKeys('cis557');
  await driver.findElement(By.className('userName')).sendKeys('def', Key.RETURN);
}

async function registerNoUser() {
  await driver.findElement(By.className('pass')).sendKeys('123');
  await driver.findElement(By.className('email')).sendKeys('123@gmail.com', Key.RETURN);
}

it('register with no email', async () => {
  await registerNoEmail();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/Register');
  await driver.findElement(By.className('RegisterStatus')).getText().then((text) => {
    expect(text).not.toBe('');
  });
});

it('register with no pass', async () => {
  await registerNoPass();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/Register');
  await driver.findElement(By.className('RegisterStatus')).getText().then((text) => {
    expect(text).not.toBe('');
  });
});

it('register with no user', async () => {
  await registerNoUser();
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/Register');
  await driver.findElement(By.className('RegisterStatus')).getText().then((text) => {
    expect(text).not.toBe('');
  });
});

// it('register successfully', async () => {
//   await driver.findElement(By.className('signinlink')).click();
//   const url = await driver.getCurrentUrl();
//   expect(url).toBe('http://localhost:3000/Login');
// });

// it('signup success', async () => {
//   driver.wait(until.urlIs('http://localhost:3000'));
//   await registerOK();
//   const url = await driver.getCurrentUrl();
//   expect(url).toBe('http://localhost:3000');
// });

// test('back to register page after register', async () => {
//   driver.wait(until.urlIs('http://localhost:3000'));
//   await driver.get('http://localhost:3000/Register').then(() => driver.sleep(10000));
//   const url = await driver.getCurrentUrl();
//   expect(url).toBe('http://localhost:3000');
// });

