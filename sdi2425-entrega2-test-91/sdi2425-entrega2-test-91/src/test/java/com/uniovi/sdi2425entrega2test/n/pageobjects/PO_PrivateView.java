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
}
