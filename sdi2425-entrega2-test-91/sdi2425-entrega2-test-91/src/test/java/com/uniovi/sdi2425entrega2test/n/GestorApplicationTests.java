/*
package com.uniovi.gestor;

import com.uniovi.gestor.pageobjects.*;
import com.uniovi.gestor.services.InsertSampleDataService;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class GestorApplicationTests {

    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    static String Geckodriver = "geckodriver.exe";
    static WebDriver driver = getDriver(PathFirefox, Geckodriver);
    static String URL = "http://localhost:8090";

    @Autowired
    private InsertSampleDataService insertSampleDataService;

    public static WebDriver getDriver(String PathFirefox, String Geckodriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckodriver);
        driver = new FirefoxDriver();
        return driver;
    }

    @BeforeEach
    public void setUp(){
        driver.navigate().to(URL);
    }

    @AfterEach
    public void tearDown(){
        driver.manage().deleteAllCookies();
    }

    @BeforeAll
    static public void begin() {}

    @AfterAll
    static public void end() {
        driver.quit();
    }

    @Test
    @Order(1)
    @Transactional
    public void PR01() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");
        String checkText = "12345678Z"; //como siempre es el primer usuario en la lista su propio dni siempre estará presente
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(2)
    @Transactional
    public void PR02() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S","Us3r@1-PASSW");
        String checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(3)
    @Transactional
    public void PR03() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "","");
        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/login"));
    }

    @Test
    @Order(4)
    @Transactional
    public void PR04() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver,"10000001S" ,"1234");
        String checkText = PO_HomeView.getP().getString("login.message", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(5)
    @Transactional
    public void PR05() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S","Us3r@1-PASSW");
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(6)
    @Transactional
    public void PR06() {
        List<WebElement> logoutLink = driver.findElements(By.linkText("Desconectar"));
        assertTrue(logoutLink.isEmpty());
    }

    @Test
    @Order(7)
    @Transactional
    public void PR07() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Agregar empleado");
        PO_PrivateView.fillFormAddEmployee(driver, "07112884L", "Pablo", "Perez Alvarez");
        PO_ListView.goToLastPage(driver);
        String checkText = "07112884L";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(8)
    @Transactional
    public void PR08() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Agregar empleado");

        driver.findElement(By.className("btn-primary")).click();

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/employee/add"));

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(9)
    @Transactional
    public void PR09() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Agregar empleado");

        PO_PrivateView.fillFormAddEmployee(driver, "123", "Pablo", "Perez Alvarez");

        String checkText = PO_HomeView.getP().getString("Error.signup.dni.invalid", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(10)
    @Transactional
    public void PR010() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Agregar empleado");

        PO_PrivateView.fillFormAddEmployee(driver, "12345678Z", "Pablo", "Perez Alvarez");

        String checkText = PO_HomeView.getP().getString("Error.dni.duplicate", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(11)
    @Transactional
    public void PR011() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCL", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");
        PO_ListView.goToLastPage(driver);
        String checkText = "1234BCL";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(12)
    @Transactional
    public void PR012A() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicle/add"));
    }

    @Test
    @Order(13)
    @Transactional
    public void PR012B() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "", "Toyota", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicle/add"));
    }

    @Test
    @Order(14)
    @Transactional
    public void PR012C() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicle/add"));
    }

    @Test
    @Order(15)
    @Transactional
    public void PR012D() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "Toyota", "", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicle/add"));
    }

    @Test
    @Order(16)
    @Transactional
    public void PR013() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "123", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.addvehicle.plate.invalid",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.addvehicle.plate.invalid",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(17)
    @Transactional
    public void PR014A() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCF", "ASDFGHJKLQWERTYUII", "Toyota", "Corolla", "Diésel");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.vin.length",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.vin.length",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(18)
    @Transactional
    public void PR014B() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCF", "ASDFGHJKLQWERTYU", "Toyota", "Corolla", "Diésel");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.vin.length",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.vin.length",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(19)
    @Transactional
    public void PR015() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.plate.duplicate",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.plate.duplicate",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(20)
    @Transactional
    public void PR016() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Agregar vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BGD", "0FAFP08192R123456", "Toyota", "Corolla", "Diésel");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.vin.duplicate",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.vin.duplicate",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(21)
    @Transactional
    public void PR017() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Ver empleados");

        int numEmployees = insertSampleDataService.getNumEmployees() ;

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"employeeTable\"]/tbody/tr"));
            totalCount += employeeRows.size();
            next = PO_PrivateView.goToNextPage(driver);
        }

        Assertions.assertEquals(numEmployees, totalCount, "El número de empleados no coincide");
    }

    @Test
    @Order(22)
    @Transactional
    public void PR018() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");


        WebElement secondEditLink = driver.findElement(By.xpath("(//table[@id='employeeTable']//a[contains(text(),'Modificar')])[3]"));
        secondEditLink.click();

        String dni = "58435079Z";
        String name = "Marcos";
        String lastName = "Caraduje Martínez";
        String role = "ROLE_ADMIN";

        PO_PrivateView.filFormEditEmployee(driver, dni, name, lastName);

        WebElement dniElement = driver.findElement(By.id("dni"));
        Assertions.assertEquals(dni, dniElement.getText());

        WebElement nameElement = driver.findElement(By.id("name"));
        Assertions.assertEquals(name, nameElement.getText());

        WebElement lastNameElement = driver.findElement(By.id("lastName"));
        Assertions.assertEquals(lastName, lastNameElement.getText());

        WebElement roleElement = driver.findElement(By.id("role"));
        Assertions.assertEquals(role, roleElement.getText());

        PO_LoginView.logOut(driver);

        PO_LoginView.fillForm(driver, dni, "Us3r@2-PASSW");

        String url = driver.getCurrentUrl();

        Assertions.assertTrue(url.contains("/employee/list"));
    }

    @Test
    @Order(23)
    @Transactional
    public void PR019() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");


        WebElement secondEditLink = driver.findElement(By.xpath("(//table[@id='employeeTable']//a[contains(text(),'Modificar')])[3]"));
        secondEditLink.click();

        String dni = "12345678Z";
        String name = "";
        String lastName = "";

        PO_PrivateView.filFormEditEmployee(driver, dni, name, lastName);


        List<WebElement> resultDni = PO_View.checkElementByKey(driver,  "Error.dni.duplicate" ,PO_Properties.getSPANISH());
        assertFalse(resultDni.isEmpty());

        List<WebElement> resultName = PO_View.checkElementByKey(driver,  "Error.empty", PO_Properties.getSPANISH());
        assertFalse(resultName.isEmpty());

        List<WebElement> resultLastName = PO_View.checkElementByKey(driver, "Error.empty", PO_Properties.getSPANISH());
        assertFalse(resultLastName.isEmpty());
    }

    @Test
    @Order(24)
    @Transactional
    public void PR020() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        int numCars = insertSampleDataService.getNumCars();

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"vehicleTable\"]/tbody/tr"));
            totalCount += vehicleRows.size();
            next = PO_ListView.goToNextPage(driver);
        }

        Assertions.assertEquals(totalCount, numCars, "El número de vehículos no coincide.");
    }

    @Test
    @Order(25)
    @Transactional
    public void PR021() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{0});
        assertFalse(found, "El vehículo no se ha eliminado correctamente.");
    }

    @Test
    @Order(26)
    @Transactional
    public void PR022() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"vehicleTable\"]/tbody/tr"));
        PO_ListView.goToLastPage(driver);
        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{vehicleRows.size() - 1});
        assertFalse(found, "El vehículo no se ha eliminado correctamente.");
    }

    @Test
    @Order(27)
    @Transactional
    public void PR023() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{0, 1, 2});
        assertFalse(found, "Los vehículos no se han eliminado correctamente.");
    }

    @Test
    @Order(28)
    @Transactional
    public void PR024() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));
        List<String> matriculasEsperadas = List.of("9101GHJ", "5678DFG", "3141MNP");
        for (WebElement row : rows) {
            List<WebElement> cells = row.findElements(By.tagName("td"));
            if (!cells.isEmpty()) {
                String matricula = cells.get(1).getText();
                assertTrue(matriculasEsperadas.contains(matricula));
            }
        }
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(29)
    @Transactional
    public void PR025() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S", "Us3r@1-PASSW");
        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Agregar trayecto");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("B3545CD");

        driver.findElement(By.cssSelector("button[type='submit']")).click();
        String checkText = PO_HomeView.getP().getString("journey.list", PO_Properties.getSPANISH());
        assertFalse(checkText.isEmpty());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(30)
    @Transactional
    public void PR026() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Agregar trayecto");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("5161PQR");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        WebElement errorMessage = driver.findElement(By.className("alert-danger"));
        String checkText = PO_HomeView.getP().getString("Error.journeyStarted", PO_Properties.getSPANISH());
        assertTrue(errorMessage.getText().contains(checkText));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(31)
    @Transactional
    public void PR027() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q", "Us3r@2-PASSW");
        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Agregar trayecto");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("5161PQR");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        WebElement errorMessage = driver.findElement(By.className("alert-danger"));
        String checkText = PO_HomeView.getP().getString("Error.vehicleInUse", PO_Properties.getSPANISH());
        assertTrue(errorMessage.getText().contains(checkText));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(32)
    @Transactional
    public void PR028() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000010R","Us3r@10-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Manolo", 1.2, 50.0, true, 100000, "Repostaje de prueba");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("B3545CA");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "vehicle.selection.refuel",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("vehicle.selection.refuel",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());

        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='refuelsTable']/tbody/tr"));
        boolean isPresent = false;
        for (WebElement row : rows) {
            if (row.getText().contains("Manolo")) {
                isPresent = true;
                break;
            }
        }
        Assertions.assertTrue(isPresent, "El repostaje no se ha añadido correctamente.");
    }

    @Test
    @Order(33)
    @Transactional
    public void PR029() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q","Us3r@2-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 100000, "Repostaje de prueba");

        WebElement errorMessage = driver.findElement(By.className("alert-danger"));
        String checkText = PO_HomeView.getP().getString("Error.journeyNotStarted", PO_Properties.getSPANISH());
        assertTrue(errorMessage.getText().contains(checkText));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(34)
    @Transactional
    public void PR030() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.clickSendButton(driver);
        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/refuel/add"));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(35)
    @Transactional
    public void PR031() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", -1.2, -50.0, true, 100000, "Repostaje de prueba");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.negative",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.negative",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(36)
    @Transactional
    public void PR032() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000010R","Us3r@10-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 100, "Repostaje de prueba");

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.odometer",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.odometer",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(37)
    @Transactional
    public void PR033() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000005L","Us3r@5-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("5161PQR") && row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]")).isDisplayed()) {
                WebElement finishButton = row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]"));
                finishButton.click();
                break;
            }
        }

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("55000000000");

        WebElement observationsField = driver.findElement(By.id("observations"));
        observationsField.clear();
        observationsField.sendKeys("Finalización del trayecto");

        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Finalizar')]"));
        submitButton.click();
        String checkText = PO_HomeView.getP().getString("journey.list", PO_Properties.getSPANISH());
        assertFalse(checkText.isEmpty());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(38)
    @Transactional
    public void PR034() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Agregar trayecto");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("9101GHJ");

        driver.findElement(By.cssSelector("button[type='submit']")).click();
        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");

        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("9101GHJ") && row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]")).isDisplayed()) {
                WebElement finishButton = row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]"));
                finishButton.click();
                break;
            }
        }

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();

        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Finalizar')]"));
        submitButton.click();
        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/end"));

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(39)
    @Transactional
    public void PR035() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("9101GHJ") && row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]")).isDisplayed()) {
                WebElement finishButton = row.findElement(By.xpath(".//td/a[contains(text(),'Finalizar')]"));
                finishButton.click();
                break;
            }
        }

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("-5");

        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Finalizar')]"));
        submitButton.click();
        WebElement errorMessage = driver.findElement(By.className("text-danger"));
        String checkText = PO_HomeView.getP().getString("Error.odometer.negativo", PO_Properties.getSPANISH());
        assertTrue(errorMessage.getText().contains(checkText));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(40)
    @Transactional
    public void PR036() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q","Us3r@2-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));

        for (WebElement row : rows) {
            List<WebElement> finalizarLinks = row.findElements(By.xpath(".//td/a[contains(text(),'Finalizar')]"));
            assertTrue(finalizarLinks.isEmpty());
        }

        driver.navigate().to("http://localhost:8090/journey/end");

        new WebDriverWait(driver, 10).until(ExpectedConditions.urlContains("/journey/list"));
        //nos devuelve a list si no existe ninguno en curso
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/journey/list"));
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(41)
    @Transactional
    public void PR037() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver, "text","Gestión de trayectos","text","Historial de trayectos de un vehículo");

        WebElement element= driver.findElement(By.id("plateNumber"));
        Select select = new Select(element);
        select.selectByVisibleText("5678DFG");

        List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr"));
        int numrows = employeeRows.size();
        while(PO_PrivateView.goToNextPage(driver)){
            employeeRows = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr"));
            numrows += employeeRows.size();
        }

        assertEquals( 16, numrows);

        element= driver.findElement(By.id("plateNumber"));
        select = new Select(element);
        select.selectByVisibleText("3141MNP");

        employeeRows = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr"));
        numrows = employeeRows.size();
        while(PO_PrivateView.goToNextPage(driver)){
            employeeRows = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr"));
            numrows += employeeRows.size();
        }
        assertEquals( 16, numrows);
    }

    @Test
    @Order(42)
    @Transactional
    public void PR038() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000010R","Us3r@10-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 100000, "Repostaje de prueba");
        PO_PrivateView.goThroughNav(driver,"text","Gestión de repostajes","text","Agregar repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 100100, "Repostaje de prueba2");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("B3545CA");

        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='refuelsTable']/tbody/tr"));
        int repsolCount = 0;
        for (WebElement row : rows) {
            if (row.getText().contains("Repsol")) {
                repsolCount++;
            }
        }
        Assertions.assertEquals(2, repsolCount,"Los repostajes asignados no figuran en la lista.");
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(43)
    @Transactional
    public void PR039() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q", "Us3r@2-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        int numVehicles = 13; // Número de vehiculos disponibles

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"vehicleTable\"]/tbody/tr"));
            totalCount += vehicleRows.size();
            next = PO_PrivateView.goToNextPage(driver);
        }

        Assertions.assertEquals(numVehicles, totalCount, "El número de empleados no coincide");
    }

    @Test
    @Order(44)
    @Transactional
    public void PR040(){
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q","Us3r@2-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Cambiar contraseña");

        PO_PrivateView.fillFormChangePassword(driver, "Us3r@2-PASSW", "Ahorasoyadministrad0r?", "Ahorasoyadministrad0r?");

        PO_LoginView.logOut(driver);

        PO_LoginView.fillForm(driver, "10000002Q","Ahorasoyadministrad0r?");

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/journey/list"));
    }

    @Test
    @Order(45)
    @Transactional
    public void PR041() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000013G", "Us3r@13-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Cambiar contraseña");

        PO_PrivateView.fillFormChangePassword(driver, "Us3r@2-PASSW", "Ahorasoyadministrad1r?", "Ahorasoyadministrad1r?");

        String checkText = PO_HomeView.getP().getString("Error.password.incorrect", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
    }

    @Test
    @Order(46)
    @Transactional
    public void PR042() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000013G", "Us3r@13-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Cambiar contraseña");

        PO_PrivateView.fillFormChangePassword(driver, "Us3r@13-PASSW", "contraseñadebil", "contraseñadebil");

        String checkText = PO_HomeView.getP().getString("Error.password.weak", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
    }

    @Test
    @Order(47)
    @Transactional
    public void PR043() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000013G", "Us3r@13-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Cambiar contraseña");

        PO_PrivateView.fillFormChangePassword(driver, "Us3r@13-PASSW", "Ahorasoyadministrad1r?", "Ahorasoyadministrad1r");

        String checkText = PO_HomeView.getP().getString("Error.password.passwordConfirm", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
    }

    @Test
    @Order(48)
    @Transactional
    public void PR044() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_NavView.changeLanguage(driver, "Spanish");
        String checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "Spanish");
        checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getSPANISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_PrivateView.goThroughNav(driver,"text","Gestión de vehículos","text","Ver vehículos");

        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getSPANISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "Spanish");
        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getSPANISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Ver trayectos");

        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getSPANISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "Spanish");
        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getSPANISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(49)
    @Transactional
    public void PR045() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_NavView.changeLanguage(driver, "English");
        String checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getENGLISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "German");
        checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getGERMAN());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("employees.title", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_PrivateView.goThroughNav(driver,"text","Vehicle management","text","View vehicles");

        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "German");
        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getGERMAN());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("vehicles.message.extra", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_PrivateView.goThroughNav(driver,"text","Journey management","text","View journeys");

        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "German");
        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getGERMAN());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_NavView.changeLanguage(driver, "English");
        checkText = PO_HomeView.getP().getString("journey.list.title", PO_Properties.getENGLISH());
        result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());
        PO_NavView.changeLanguage(driver, "Spanish");
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(50)
    @Transactional
    public void PR046() {
        driver.get("http://localhost:8090/employee/list");
        new WebDriverWait(driver, 10).until(ExpectedConditions.urlContains("/login"));
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/login"));
    }

    @Test
    @Order(51)
    @Transactional
    public void PR047() {
        driver.get("http://localhost:8090/vehicle/list");
        new WebDriverWait(driver, 10).until(ExpectedConditions.urlContains("/login"));
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/login"));
    }

    @Test
    @Order(52)
    @Transactional
    public void PR048() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S", "Us3r@1-PASSW");

        driver.get("http://localhost:8090/logs/list");

        String checkText = PO_HomeView.getP().getString("Error.forbidden", PO_Properties.getSPANISH());
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(53)
    @Transactional
    public void PR049() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX
        PO_LoginView.logOut(driver);                                                // LOGOUT
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGING-EX
        PO_LoginView.logOut(driver);                                                // LOUGOUT
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGING-EX

        driver.get("http://localhost:8090/logs/list");

        WebElement typeDrodown = driver.findElement(By.id("logTypeFilter"));
        Select select = new Select(typeDrodown);

        select.selectByVisibleText("PET");
        List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertFalse(employeeRows.isEmpty());

        typeDrodown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDrodown);
        select.selectByVisibleText("LOGIN-EX");
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(3, employeeRows.size());

        typeDrodown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDrodown);
        select.selectByVisibleText("LOGIN-ERR");
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());

        typeDrodown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDrodown);
        select.selectByVisibleText("LOGOUT");
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());
    }

    @Test
    @Order(54)
    @Transactional
    public void PR050() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR

        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX

        driver.get("http://localhost:8090/logs/list");

        WebElement typeDrodown = driver.findElement(By.id("logTypeFilter"));
        Select select = new Select(typeDrodown);

        select.selectByVisibleText("LOGIN-ERR");
        List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());

        List<WebElement> deleteButton = driver.findElements(By.xpath("//*[@id=\"deleteLogsBtn\"]"));
        deleteButton.get(0).click();
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertTrue(employeeRows.isEmpty());
    }

    @Test
    @Order(55)
    @Transactional
    public void PR057() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Historial de trayectos de un vehículo");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("3141MNP");
        WebElement boton = driver.findElement(By.cssSelector("a[href*='/journey/edit/']"));

        boton.click();

        WebElement startDateField = driver.findElement(By.id("startDate"));
        startDateField.clear();
        startDateField.sendKeys("2025-03-20T08:00");

        WebElement endDateField = driver.findElement(By.id("endDate"));
        endDateField.clear();
        endDateField.sendKeys("2025-03-20T18:00");

        WebElement odometerStartField = driver.findElement(By.id("odometerStart"));
        odometerStartField.clear();
        odometerStartField.sendKeys("500000");

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("500001");

        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();
        PO_ListView.goToLastPage(driver);
        List<WebElement> km = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr/td[4]"));
        assertFalse(km.isEmpty());
        assertEquals("1.0", km.get(0).getText());
        List<WebElement> nombre = driver.findElements(By.xpath("//*[@id=\"journeysTable\"]/tbody/tr/td[2]"));
        assertFalse(nombre.isEmpty());
        assertEquals("Pedro", nombre.get(0).getText());
        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(56)
    @Transactional
    public void PR058() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Historial de trayectos de un vehículo");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("3141MNP");
        WebElement boton = driver.findElement(By.cssSelector("a[href*='/journey/edit/']"));

        boton.click();

        WebElement startDateField = driver.findElement(By.id("startDate"));
        startDateField.clear();
        startDateField.sendKeys("2025-05-20T08:00");

        WebElement endDateField = driver.findElement(By.id("endDate"));
        endDateField.clear();
        endDateField.sendKeys("2025-03-20T18:00");

        WebElement odometerStartField = driver.findElement(By.id("odometerStart"));
        odometerStartField.clear();
        odometerStartField.sendKeys("500000");

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("500001");

        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.dateAfter",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.dateAfter",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(57)
    @Transactional
    public void PR059() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Historial de trayectos de un vehículo");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("3141MNP");
        WebElement boton = driver.findElement(By.cssSelector("a[href*='/journey/edit/']"));

        boton.click();

        WebElement startDateField = driver.findElement(By.id("startDate"));
        startDateField.clear();
        startDateField.sendKeys("2025-02-20T08:00");

        WebElement endDateField = driver.findElement(By.id("endDate"));
        endDateField.clear();
        endDateField.sendKeys("2025-03-20T18:00");

        WebElement odometerStartField = driver.findElement(By.id("odometerStart"));
        odometerStartField.clear();
        odometerStartField.sendKeys("500002");

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("500001");

        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.odometer.menor",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.odometer.menor",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());

        PO_LoginView.logOut(driver);
    }

    @Test
    @Order(58)
    @Transactional
    public void PR060() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de trayectos","text","Historial de trayectos de un vehículo");

        WebElement dropdown = driver.findElement(By.id("plateNumber"));
        Select select = new Select(dropdown);
        select.selectByValue("3141MNP");
        WebElement boton = driver.findElement(By.cssSelector("a[href*='/journey/edit/']"));

        boton.click();

        WebElement startDateField = driver.findElement(By.id("startDate"));
        startDateField.clear();
        startDateField.sendKeys("2025-02-20T08:00");

        WebElement endDateField = driver.findElement(By.id("endDate"));
        endDateField.clear();
        endDateField.sendKeys("2025-03-20T18:00");

        WebElement odometerStartField = driver.findElement(By.id("odometerStart"));
        odometerStartField.clear();
        odometerStartField.sendKeys("-57");

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("-20");

        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        List<WebElement> result = PO_PrivateView.checkElementByKey(driver, "Error.odometer.negativo",
                PO_Properties.getSPANISH());

        String checkText = PO_HomeView.getP().getString("Error.odometer.negativo",
                PO_Properties.getSPANISH());
        Assertions.assertEquals(checkText, result.get(0).getText());

        PO_LoginView.logOut(driver);
    }
}

 */