/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
// import selenium functions
const {
  Builder, By, until,
} = require('selenium-webdriver');

// declare the -web- driver
let driver;

beforeAll(async () => {
  // initialize the driver before running the tests
  try {
    driver = await new Builder().forBrowser('firefox').build();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
});

// use the driver to mock user's actions
async function mockUserAction() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(until.elementLocated(By.id('userName')), 10000);
  // enter text in the textbox
  await textbox.sendKeys('tester');
  // locate the textbox, provide a timeout
  const textbox1 = await driver.wait(until.elementLocated(By.id('password')), 10000);
  // enter text in the textbox
  await textbox1.sendKeys('123');

  // click on 'Sign In' button
  await driver.findElement(By.id('loginBtn')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('error')), 10000);
}

test('failed login, test webpage updated correctly', async () => {
  // call the mock function
  //fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ player: 'tester', point: 2, id: 1 }] }) }));
  const element = await mockUserAction();
  // retrieve the content of the element
  const returnedText = await element.getText();
  // test the values
  expect(element).not.toBeNull();
  expect(returnedText).toEqual('Incorrect Username or Password/Account Locked Out. Please try again in 5 mins.');
});

// use the driver to mock user's actions
async function mockUserActionSuc() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(until.elementLocated(By.id('userName')), 10000);
  // enter text in the textbox
  await textbox.sendKeys('newlion@gmail.com');
  // locate the textbox, provide a timeout
  const textbox1 = await driver.wait(until.elementLocated(By.id('password')), 10000);
  // enter text in the textbox
  await textbox1.sendKeys('321321321');

  // click on 'Sign In' button
  await driver.findElement(By.id('loginBtn')).click();
}

test('successful login, test webpage updated correctly', async () => {
  // call the mock function
  await mockUserActionSuc();
  // retrieve the content of the element
  // test the values
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/main');
});