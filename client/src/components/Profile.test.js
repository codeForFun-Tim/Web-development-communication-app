/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
// import selenium functions
const { Builder, By, Key, until } = require('selenium-webdriver');

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
  driver.wait(until.urlIs('http://localhost:3000/profile'));
  await driver.get('http://localhost:3000/profile');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(
    until.elementLocated(By.id('newPassword')),
    10000,
  );
  return driver.wait(until.elementLocated(By.id('userName')), 10000);
}

test('test webpage updated correctly', async () => {
  const element = await mockUserAction();
  // retrieve the content of the element
  const returnedText = await element.getText();
  // test the values
  expect(element).not.toBeNull();
  expect(returnedText).toEqual('data.name');
});
