import { test, expect } from '@playwright/test';
import { LoginPage} from "../../src/pages/LoginPage";
import { HomePage } from '../../src/pages/HomePage';

test.describe('Login feature', () => {
    let loginPage: LoginPage
    let homePage: HomePage
      const USER = {
              valid:   { email: 'customer@practicesoftwaretesting.com', password: 'welcome01', username:'Jane Doe' },
              invalid: { email: 'noexist@example.com',   password: 'wrongpass'       },

        }
   
    test.beforeEach('', async ({page}) => {
        loginPage = new LoginPage(page)
        homePage = new HomePage(page)
        
        await loginPage.navigateToLoginPage()
        await expect(page).toHaveURL('/auth/login')
    })

    test('TC01- Login success', async ({page}) => {
    
        await loginPage.login(USER.valid.email, USER.valid.password)

        await expect(page).toHaveURL('/account')
        await expect(homePage.getHomePageLogo()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toContainText(USER.valid.username)
        
    })

     test('TC02- Login with wrong password', async ({page}) => {
        
        await loginPage.login(USER.valid.email, USER.invalid.password)       

        await expect(page).not.toHaveURL('/account')
        await expect(loginPage.getErrorMsg()).toBeVisible()
        await expect(loginPage.getErrorMsg()).toContainText("Invalid email or password")        
    })

     test('TC03- Login with unregistered email', async ({page}) => {
        
        await loginPage.login(USER.invalid.email, USER.invalid.password)       

        await expect(page).not.toHaveURL('/account')
        await expect(loginPage.getErrorMsg()).toBeVisible()
        await expect(loginPage.getErrorMsg()).toContainText("Invalid email or password")        
    })

     test('TC04- Login with empty fields', async ({page}) => {
        
        await loginPage.loginWithEmpty()
                
        await expect(page).not.toHaveURL('/account')

        await expect(loginPage.getEmailErrorMsg()).toBeVisible()
        await expect(loginPage.getPasswordErrorMsg()).toBeVisible()       
    })

       test('TC05- Sign out', async ({page}) => {
        
        await loginPage.login(USER.valid.email, USER.valid.password)

        await expect(homePage.getHomePageLogo()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toContainText(USER.valid.username)

        await homePage.signOut()
        await expect(page).toHaveURL('/auth/login')

        await expect(loginPage.getEmailElement()).toBeVisible()
           
    })
})