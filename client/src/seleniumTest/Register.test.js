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
  driver.wait(until.urlIs('http://localhost:3000/register'));
  await driver.get('http://localhost:3000/register');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(until.elementLocated(By.id('email')), 10000);
  // enter text in the textbox
  await textbox.sendKeys('newlion@gail.com');
  // locate the textbox, provide a timeout
  const textbox1 = await driver.wait(until.elementLocated(By.id('userName')), 10000);
  // enter text in the textbox
  await textbox1.sendKeys('newlion');
  // locate the textbox, provide a timeout
  const textbox2 = await driver.wait(until.elementLocated(By.id('password')), 10000);
  // enter text in the textbox
  await textbox2.sendKeys('321321321');

  // click on 'Register' button
  await driver.findElement(By.id('submitBtn')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('error')), 10000);
}

test('failed register, test webpage updated correctly', async () => {
  // call the mock function
  //fetch = jest.fn(() => Promise.resolve({ json: () => ({ message: 'success', data: [{ player: 'tester', point: 2, id: 1 }] }) }));
  const element = await mockUserAction();
  // retrieve the content of the element
  const returnedText = await element.getText();
  // test the values
  expect(element).not.toBeNull();
  expect(returnedText).toEqual('Failed, existed user, change your email and username');
  const url = await driver.getCurrentUrl();
  expect(url).toBe('http://localhost:3000/register');
});

// use the driver to mock user's actions
async function mockUserActionSuc() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/register'));
  await driver.get('http://localhost:3000/register');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(until.elementLocated(By.id('email')), 10000);
  // enter text in the textbox
  var randomPart = Math.ceil((Math.random() * 46656))
  await textbox.sendKeys(`${randomPart}newlion@gail.com`);
  // locate the textbox, provide a timeout
  const textbox1 = await driver.wait(until.elementLocated(By.id('userName')), 10000);
  // enter text in the textbox
  await textbox1.sendKeys(`${randomPart}newlion`);
  // locate the textbox, provide a timeout
  const textbox2 = await driver.wait(until.elementLocated(By.id('password')), 10000);
  // enter text in the textbox
  await textbox2.sendKeys('321321321');

  // click on 'Register' button
  await driver.findElement(By.id('submitBtn')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('error')), 10000);
}

test('successful register, test webpage updated correctly', async () => {
  // retrieve the content of the element
  const element = await mockUserActionSuc();
  // retrieve the content of the element
  const returnedText = await element.getText();
  // test the values
  expect(element).not.toBeNull();
  expect(returnedText).toEqual('Successful, please wait');
});