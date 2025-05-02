package com.uniovi.sdi2425entrega2test.n.pageobjects;

import com.uniovi.sdi2425entrega2test.n.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class PO_PrivateView extends PO_NavView {
    static public void goThroughNav(WebDriver driver,String type1,String text1,String type2,String text2){
        List<WebElement> elements = PO_View.checkElementBy(driver, type1,
                text1);
        elements.get(0).click();
        elements = PO_View.checkElementBy(driver, type2, text2);
        elements.get(0).click();
    }

    static public void fillFormAddEmployee(WebDriver driver, String dnip, String namep, String lastNamep)
    {
        WebElement dniInput = driver.findElement(By.id("dni"));
        dniInput.clear();
        dniInput.sendKeys(dnip);
        WebElement nameInput = driver.findElement(By.id("name"));
        nameInput.clear();
        nameInput.sendKeys(namep);
        WebElement lastNameInput = driver.findElement(By.id("lastName"));
        lastNameInput.clear();
        lastNameInput.sendKeys(lastNamep);
        driver.findElement(By.className("btn-primary")).click();
    }

    static public void fillFormAddVehicle(WebDriver driver, String numberPlatep, String vinp, String brandp,
                                          String modelp, String fuelp)
    {
        WebElement numberPlate = driver.findElement(By.id("numberPlate"));
        numberPlate.clear();
        numberPlate.sendKeys(numberPlatep);
        WebElement vin = driver.findElement(By.id("vin"));
        vin.clear();
        vin.sendKeys(vinp);
        WebElement brand = driver.findElement(By.id("brand"));
        brand.clear();
        brand.sendKeys(brandp);
        WebElement model = driver.findElement(By.id("model"));
        model.clear();
        model.sendKeys(modelp);
        WebElement fuelDropdown = driver.findElement(By.id("fuelType"));
        Select fuelSelect = new Select(fuelDropdown);
        fuelSelect.selectByVisibleText(fuelp);
        driver.findElement(By.className("btn-primary")).click();
    }

    static public boolean goToNextPage(WebDriver driver) {
        List<WebElement> elements = PO_View.checkElementBy(driver, "free", "//a[contains(@class, 'page-link')]");

        // Obtiene la página actual
        int currentPageIndex = -1;
        for (int i = 0; i < elements.size(); i++) {
            WebElement parent = elements.get(i).findElement(By.xpath("./.."));
            if (parent.getAttribute("class").contains("active")) {
                currentPageIndex = i;
                break;
            }
        }

        if (currentPageIndex != -1 && currentPageIndex + 1 < elements.size()) {
            String nextText = elements.get(currentPageIndex + 1).getText().trim();
            // Comprueba si la siguiente página es un dígito (no "Última")
            if (nextText.matches("\\d+")) {
                elements.get(currentPageIndex + 1).click();
                return true;
            }
        }
        return false;
    }

    static public void fillFormChangePassword(WebDriver driver, String current, String passwordp, String newpasswordp){
        WebElement dniInput = driver.findElement(By.id("password"));
        dniInput.clear();
        dniInput.sendKeys(current);
        WebElement nameInput = driver.findElement(By.id("newPassword"));
        nameInput.clear();
        nameInput.sendKeys(passwordp);
        WebElement lastNameInput = driver.findElement(By.id("confirmNewPassword"));
        lastNameInput.clear();
        lastNameInput.sendKeys(newpasswordp);
        driver.findElement(By.className("btn-primary")).click();
    }

    static public void filFormEditEmployee(WebDriver driver, String dnip, String namep, String lastnamep){
        WebElement dniInput = driver.findElement(By.id("dni"));
        dniInput.clear();
        dniInput.sendKeys(dnip);
        WebElement nameInput = driver.findElement(By.id("name"));
        nameInput.clear();
        nameInput.sendKeys(namep);
        WebElement lastNameInput = driver.findElement(By.id("lastName"));
        lastNameInput.clear();
        lastNameInput.sendKeys(lastnamep);

        WebElement roleDropdown = driver.findElement(By.id("role"));
        Select select = new Select(roleDropdown);
        select.selectByVisibleText("ADMINISTRADOR");

        driver.findElement(By.className("btn-primary")).click();
    }

}
