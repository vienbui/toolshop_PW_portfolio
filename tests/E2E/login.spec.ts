import { test, expect } from '@playwright/test';
import { LoginPage} from "../../src/pages/LoginPage";
import { HomePage } from '../../src/pages/HomePage';

test.describe('Login feature', () => {
    let loginPage: LoginPage
    let homePage: HomePage

    test.beforeEach('', async ({page}) => {
        loginPage = new LoginPage(page)
        homePage = new HomePage(page)

        await loginPage.navigateToLoginPage()
        await expect(page).toHaveURL('/auth/login')
    })
    
    test('Login success', async ({page}) => {
        

        await loginPage.login('customer@practicesoftwaretesting.com', 'welcome01')

        await expect(homePage.getHomePageLogo()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toBeVisible()
        await expect(homePage.getUserNameMenu()).toContainText('Jane Doe')
        
    })
})