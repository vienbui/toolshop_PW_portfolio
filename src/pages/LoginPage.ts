import { Page, Locator } from "@playwright/test";

export class LoginPage {
    private page:Page
    private email:Locator
    private password:Locator
    private loginBtn:Locator
    private signInLink:Locator
    private errorMessage:Locator


    constructor(page:Page) {
        this.page = page
        this.signInLink = page.locator(`[data-test='nav-sign-in']`)
        this.email = page.locator(`#email`)
        this.password = page.locator('#password')
        this.loginBtn = page.locator('.btnSubmit')
        this.errorMessage =page.locator('[data-test="login-error"]')
    }

    async navigateToLoginPage(){
        await this.page.goto('/')
        await this.signInLink.click()
    }

    async inputEmail(email:string){
        await this.email.fill(email)
    }

    async inputPassword(password:string){
        await this.password.fill(password)
    }

    async clickLoginBtn(){
        await this.loginBtn.click()
    }

    async login(email:string,password:string){
        await this.inputEmail(email)
        await this.inputPassword(password)
        await this.clickLoginBtn()
    }

    getErrorMsg(){
        return this.errorMessage
    }


}