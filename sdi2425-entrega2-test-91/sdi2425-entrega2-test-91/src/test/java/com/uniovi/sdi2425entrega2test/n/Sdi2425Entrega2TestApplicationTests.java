package com.uniovi.sdi2425entrega2test.n;

import com.uniovi.sdi2425entrega2test.n.pageobjects.PO_HomeView;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.json.simple.JSONObject;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.test.annotation.Rollback;
import com.uniovi.sdi2425entrega2test.n.pageobjects.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Sdi2425Entrega2TestApplicationTests {
    static String PathFirefox = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    static String Geckodriver = "geckodriver.exe";
    static WebDriver driver = getDriver(PathFirefox, Geckodriver);
    static String URL = "http://localhost:8081/users/login";

    public static WebDriver getDriver(String PathFirefox, String Geckodriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckodriver);
        driver = new FirefoxDriver();
        return driver;
    }

    @BeforeEach
    public void setUp() {
        driver.navigate().to(URL);
        RequestSpecification request = RestAssured.given();
        request.header("Content-Type", "application/json");
        Response response = request.post("http://localhost:8081/api/test/reset");
        Assertions.assertEquals(200, response.getStatusCode(), "Database reset failed");
    }

    @AfterEach
    public void tearDown() {
        driver.manage().deleteAllCookies();
    }

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
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/employee"));
    }

    @Test
    @Order(2)
    @Transactional
    public void PR02() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S","Us3r@1-PASSW");
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/journeys"));
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
        String checkText = "Dni o password incorrecto";
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
        String loginText = "Ha cerrado sesión correctamente";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", loginText);
        Assertions.assertEquals(loginText, result.get(0).getText());
    }

    @Test
    @Order(6)
    @Transactional
    public void PR06() {
        List<WebElement> logoutLink = driver.findElements(By.linkText("Cerrar sesión"));
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
        String checkText = "07112884L";
        boolean found = PO_ListView.searchThroughPages(driver, checkText);
        assertTrue(found);
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

        String checkText = "El DNI no puede estar vacío";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        checkText = "El nombre no puede estar vacío";

        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        checkText = "El apellido no puede estar vacío";

        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/users/signup"));

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

        String checkText = "Formato dni invalido";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

    }

    @Test
    @Order(10)
    @Transactional
    public void PR010() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Agregar empleado");

        PO_PrivateView.fillFormAddEmployee(driver, "12345678Z", "Pablo", "Perez Alvarez");

        String checkText = "Este DNI ya está registrado";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        assertFalse(result.isEmpty());

    }


    @Test
    @Order(11)
    @Transactional
    public void PR011() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCL", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");
        String checkText = "1234BCL";
        PO_ListView.searchThroughPages(driver, checkText);
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(12)
    public void PR012A() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicles/add"));
    }

    @Test
    @Order(13)
    public void PR012B() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "", "Toyota", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicles/add"));
    }

    @Test
    @Order(14)
    public void PR012C() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "", "Corolla", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicles/add"));
    }

    @Test
    @Order(15)
    public void PR012D() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "Toyota", "", "Diésel");

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/vehicles/add"));
    }

    @Test
    @Order(16)
    public void PR013() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "123", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        String checkText = "Formato de matrícula inválido: La matrícula debe de seguir un formato válido Español";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);

        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(17)
    public void PR014A() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCF", "ASDFGHJKLQWERTYUII", "Toyota", "Corolla", "Diésel");

        String checkText = "El número de bastidor debe contener exactamente 17 caracteres";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);

        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(18)
    public void PR014B() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCF", "ASDFGHJKLQWERTYU", "Toyota", "Corolla", "Diésel");

        String checkText = "El número de bastidor debe contener exactamente 17 caracteres";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);

        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(19)
    public void PR015() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCD", "ASDFGHJKLQWERTYUI", "Toyota", "Corolla", "Diésel");

        String checkText = "Matrícula ya registrada en el sistema.";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);

        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(20)
    public void PR016() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Agregar Vehículo");

        PO_PrivateView.fillFormAddVehicle(driver, "1234BCP", "ASDFGHJKLQWERTYUA", "Toyota", "Corolla", "Diésel");

        String checkText = "Número de bastidor ya registrado en el sistema.";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }
    @Test
    @Order(21)
    @Transactional
    public void PR017() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Gestión de empleados","text","Lista de Empleados");

        int numEmployees = 16;

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> employeeRows = driver.findElements(By.xpath("//div[@class='table-responsive']/table/tbody/tr"));
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

        PO_PrivateView.goThroughNav(driver, "text", "Gestión de empleados", "text","Lista de Empleados");

        WebElement thirdEditLink = driver.findElement(
                By.xpath("(//div[@class='table-responsive']//table//tbody//tr//a[contains(@class, 'btn-warning') or contains(text(), 'Editar')])[3]")
        );
        thirdEditLink.click();

        String dni = "58435079Z";
        String name = "Marcos";
        String lastName = "Caraduje Martínez";

        PO_PrivateView.filFormEditEmployee(driver, dni, name, lastName);

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

        PO_PrivateView.goThroughNav(driver, "text", "Gestión de empleados", "text","Lista de Empleados");

        // Corregimos el XPath para usar la estructura real de la tabla
        WebElement thirdEditLink = driver.findElement(
                By.xpath("(//div[@class='table-responsive']//table//tbody//tr//a[contains(@class, 'btn-warning') or contains(text(), 'Editar')])[3]")
        );
        thirdEditLink.click();

        String dni = "12345678Z";
        String name = "";
        String lastName = "";

        PO_PrivateView.filFormEditEmployee(driver, dni, name, lastName);

        List<WebElement> resultDni = PO_View.checkElementBy(driver, "text", "Este DNI ya está registrado por otro empleado");
        assertFalse(resultDni.isEmpty());

        List<WebElement> resultName = PO_View.checkElementBy(driver, "text", "El nombre no puede estar vacío");
        assertFalse(resultName.isEmpty());

        List<WebElement> resultLastName = PO_View.checkElementBy(driver, "text", "El apellido no puede estar vacío");
        assertFalse(resultLastName.isEmpty());
    }


    @Test
    @Order(24)
    public void PR020() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Lista de Vehículos");

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"delete-form\"]/div/table/tbody/tr"));
            totalCount += vehicleRows.size();
            next = PO_ListView.goToNextPage(driver);
        }

        Assertions.assertEquals(19, totalCount, "El número de vehículos no coincide.");
    }

    @Test
    @Order(25)
    public void PR021() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Lista de Vehículos");

        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{0});
        assertFalse(found, "El vehículo no se ha eliminado correctamente.");
    }

    @Test
    @Order(26)
    public void PR022() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Lista de Vehículos");

        List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"delete-form\"]/div/table/tbody/tr"));
        PO_ListView.goToLastPage(driver);
        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{vehicleRows.size() - 1});
        assertFalse(found, "El vehículo no se ha eliminado correctamente.");
    }

    @Test
    @Order(27)
    public void PR023() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Lista de Vehículos");

        boolean found = PO_ListView.deleteVehiclesByIndexes(driver, new int[]{0, 1, 2});
        assertFalse(found, "Los vehículos no se han eliminado correctamente.");
    }

    @Test
    @Order(28)
    public void PR024() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        List<WebElement> rows = driver.findElements(By.xpath("//table[@id='journeyTable']/tbody/tr"));
        List<String> matriculasEsperadas = Arrays.asList("6543NRG", "Z0032BY", "4567CRD", "1234BCD");

        for (WebElement row : rows) {
            List<WebElement> cells = row.findElements(By.tagName("td"));
            if (!cells.isEmpty()) {
                String matricula = cells.get(1).getText();
                assertTrue(matriculasEsperadas.contains(matricula));
            }
        }
    }

    @Test
    @Order(29)
    public void PR025() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S", "Us3r@1-PASSW");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Agregar Trayecto");

        WebElement dropdown = driver.findElement(By.id("numberPlate"));
        Select select = new Select(dropdown);
        select.selectByValue("4567CRD");

        driver.findElement(By.cssSelector("button[type='submit']")).click();
        List<WebElement> errorMessages = driver.findElements(By.className("alert-danger"));
        assertTrue(errorMessages.isEmpty());

    }

    @Test
    @Order(30)
    public void PR026() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Agregar Trayecto");

        WebElement dropdown = driver.findElement(By.id("numberPlate"));
        Select select = new Select(dropdown);
        select.selectByValue("4567CRD");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        List<WebElement> errorMessages = driver.findElements(By.className("alert-danger"));
        assertFalse(errorMessages.isEmpty());
        assertTrue(errorMessages.get(0).getText().contains("Error: ya tienes un trayecto en curso con otro vehículo"));
    }

    @Test
    @Order(31)
    @Transactional
    public void PR027() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000002Q", "Us3r@2-PASSW");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Agregar Trayecto");

        WebElement dropdown = driver.findElement(By.id("numberPlate"));
        Select select = new Select(dropdown);
        select.selectByValue("1234BCD");

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        List<WebElement> errorMessages = driver.findElements(By.className("alert-danger"));
        assertFalse(errorMessages.isEmpty());
        assertTrue(errorMessages.get(0).getText().contains("Error: el vehículo seleccionado ya está en uso por otro empleado"));
    }


    @Test
    @Order(32)
    public void PR028() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Mis trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("1234BCD")) {
                List<WebElement> finishButtons = row.findElements(By.xpath(".//form/button[contains(text(),'Finalizar')]"));
                if (!finishButtons.isEmpty()) {
                    finishButtons.get(0).click();
                    break;
                }
            }
        }
        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("55000000000");

        WebElement commentsField = driver.findElement(By.id("comments"));
        commentsField.clear();
        commentsField.sendKeys("Finalización del trayecto");

        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Finalizar trayecto')]"));
        submitButton.click();

        List<WebElement> errorMessages = driver.findElements(By.className("alert-danger"));
        assertTrue(errorMessages.isEmpty());
    }


    @Test
    @Order(33)
    @Transactional
    public void PR029() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Mis trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("1234BCD")) {
                List<WebElement> finishButtons = row.findElements(By.xpath(".//form/button[contains(text(),'Finalizar')]"));
                if (!finishButtons.isEmpty()) {
                    finishButtons.get(0).click();
                    break;
                }
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

    }

    @Test
    @Order(34)
    @Transactional
    public void PR030() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Mis trayectos");
        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));

        for (WebElement row : rows) {
            if (row.getText().contains("1234BCD")) {
                List<WebElement> finishButtons = row.findElements(By.xpath(".//form/button[contains(text(),'Finalizar')]"));
                if (!finishButtons.isEmpty()) {
                    finishButtons.get(0).click();
                    break;
                }
            }
        }

        WebElement odometerEndField = driver.findElement(By.id("odometerEnd"));
        odometerEndField.clear();
        odometerEndField.sendKeys("-5");

        WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit' and contains(text(),'Finalizar')]"));
        submitButton.click();
        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/end"));
    }

    @Test
    @Order(35)
    @Transactional
    public void PR031() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));

        for (WebElement row : rows) {
            List<WebElement> finalizarLinks = row.findElements(By.xpath(".//td/a[contains(text(),'Finalizar')]"));
            assertTrue(finalizarLinks.isEmpty());
        }

        driver.navigate().to("http://localhost:8081/journeys/end/67ffd1bbf117290500b7e9ef?");

        new WebDriverWait(driver, 10).until(ExpectedConditions.urlContains("/journeys/list"));
        //nos devuelve a list si no existe ninguno en curso
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/journeys/list"));
    }

    @Test
    @Order(36)
    public void PR032() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");
        PO_PrivateView.goThroughNav(driver,"id","trayectos","text","Historial de trayectos de un vehículo");

        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));

        Assertions.assertEquals(5, rows.size());

    }

    @Test
    @Order(37)
    public void PR033() {
        driver.get("http://localhost:8081/employee/list");
        new WebDriverWait(driver, 10).until(ExpectedConditions.urlContains("/login"));
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/login"));
    }

    @Test
    @Order(38)
    public void PR034() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S", "Us3r@1-PASSW");

        driver.get("http://localhost:8081/logs/list");

        String checkText = "Acceso denegado: requiere privilegios de administrador";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(39)
    public void PR035() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX
        PO_LoginView.logOut(driver);                                 // LOGOUT
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX
        PO_LoginView.logOut(driver);                                 // LOGOUT
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX

        driver.get("http://localhost:8081/logs/list");

        WebElement typeDropdown = driver.findElement(By.id("logTypeFilter"));
        Select select = new Select(typeDropdown);
        select.selectByVisibleText("PET");
        WebElement filterButton = driver.findElement(By.id("filterButton"));
        filterButton.click();
        List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertFalse(employeeRows.isEmpty());

        typeDropdown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDropdown);
        select.selectByVisibleText("LOGIN-EX");


        filterButton = driver.findElement(By.id("filterButton"));
        filterButton.click();
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(3, employeeRows.size());


        typeDropdown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDropdown);
        select.selectByVisibleText("LOGIN-ERR");

        filterButton = driver.findElement(By.id("filterButton"));
        filterButton.click();
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());


        typeDropdown = driver.findElement(By.id("logTypeFilter"));
        select = new Select(typeDropdown);
        select.selectByVisibleText("LOGOUT");

        filterButton = driver.findElement(By.id("filterButton"));
        filterButton.click();
        employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());
    }

    @Test
    @Order(40)
    public void PR036() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR
        PO_LoginView.fillForm(driver, "12345678Z", "admin");         // LOGIN_ERR

        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r"); // LOGIN-EX

        driver.get("http://localhost:8081/logs/list");


        WebElement typeDropdown = driver.findElement(By.id("logTypeFilter"));
        Select select = new Select(typeDropdown);
        select.selectByVisibleText("LOGIN-ERR");


        WebElement filterButton = driver.findElement(By.id("filterButton"));
        filterButton.click();


        List<WebElement> employeeRows = driver.findElements(By.xpath("//*[@id=\"logsTable\"]/tbody/tr"));
        assertEquals(2, employeeRows.size());


        WebElement deleteButton = driver.findElement(By.xpath("//button[contains(@class, 'btn-danger')]"));
        deleteButton.click();


        try {
            typeDropdown = driver.findElement(By.id("logTypeFilter"));
            select = new Select(typeDropdown);
            select.selectByVisibleText("LOGIN-ERR"); // Esto debería fallar
            fail("Se esperaba que se lanzara una excepción al seleccionar 'LOGIN-ERR', pero no ocurrió.");
        } catch (Exception e) {
            assertTrue(true); //si se produce la excepción pasa el test
        }

    }

    @Test
    @Order(41)
    public void PR037() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"id","repostajes","text","Agregar Repostaje");

        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 1000000, "Repostaje de prueba");
        String checkText = "1234BCD - Mercedes Clase A";
        PO_ListView.searchThroughPages(driver, checkText);
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/refuels/vehicle/"));
    }
    @Test
    @Order(42)
    public void PR038() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S","Us3r@1-PASSW");

        PO_PrivateView.goThroughNav(driver,"id","repostajes","text","Agregar Repostaje");

        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 1000000, "Repostaje de prueba");
        String checkText = "No tienes ningún trayecto en curso";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/refuels/add"));
    }

    @Test
    @Order(43)
    public void PR039() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"id","repostajes","text","Agregar Repostaje");
        PO_ListView.clickSendButton(driver);

        List<WebElement> requiredFieldErrors = driver.findElements(By.cssSelector(":invalid"));
        assertFalse(requiredFieldErrors.isEmpty());

        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/refuels/add"));
    }

    @Test
    @Order(44)
    @Transactional
    public void PR040() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"text","Repostajes","text","Agregar Repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", -1.2, -50.0, true, 100000, "Repostaje de prueba");

        String checkText1 = "Formato de cantidad inválido: La cantidad debe de ser un número positivo";
        String checkText2 = "Formato de precio inválido: El precio debe de ser un número positivo";


        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText1);
        Assertions.assertEquals(checkText1, result.get(0).getText());

        List<WebElement> result2 = PO_View.checkElementBy(driver, "text", checkText2);
        Assertions.assertEquals(checkText2, result2.get(0).getText());
    }

    @Test
    @Order(45)
    @Transactional
    public void PR041() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver, "text", "Repostajes", "text", "Agregar Repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repsol", 1.2, 50.0, true, 100, "Repostaje de prueba");

        String checkText = "El valor del odómetro debe ser superior al del inicio del trayecto";

        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);

        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(46)
    public void PR042() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "12345678Z","@Dm1n1str@D0r");

        PO_PrivateView.goThroughNav(driver,"id","repostajes","text","Historial de repostajes de un vehículo");

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> rows = driver.findElements(By.xpath("/html/body/div/div/table/tbody/tr"));
            totalCount += rows.size();
            next = PO_ListView.goToNextPage(driver);
        }
        Assertions.assertEquals(10, totalCount);

        PO_PrivateView.goThroughNav(driver,"id","repostajes","text","Agregar Repostaje");
        PO_ListView.fillFormAddRefuel(driver, "Repostaje de prueba", 1.2, 50.0, true, 1000000, "Repostaje de prueba");

        String checkText = "1234BCD - Mercedes Clase A";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        List<WebElement> refuelRows = driver.findElements(By.xpath("/html/body/div/div/table/tbody/tr"));
        checkText = "Repostaje de prueba";
        WebElement stationCell = refuelRows.get(0).findElement(By.xpath("/html/body/div/div/table/tbody/tr[1]/td[4]"));
        String station = stationCell.getText();
        Assertions.assertEquals(checkText, station);
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/refuels/vehicle/"));

        totalCount = 0;
        next = true;
        while (next) {
            List<WebElement> rows = driver.findElements(By.xpath("/html/body/div/div/table/tbody/tr"));
            totalCount += rows.size();
            next = PO_ListView.goToNextPage(driver);
        }
        Assertions.assertEquals(11, totalCount);
    }

    @Test
    @Order(47)
    public void PR043() {
        PO_HomeView.clickOption(driver, "login", "class", "btn btn-primary");
        PO_LoginView.fillForm(driver, "10000001S", "Us3r@1-PASSW");

        PO_PrivateView.goThroughNav(driver,"text","Vehículos","text","Lista de Vehículos");

        int totalCount = 0;
        boolean next = true;
        while (next) {
            List<WebElement> vehicleRows = driver.findElements(By.xpath("//table/tbody/tr"));
            totalCount += vehicleRows.size();
            next = PO_ListView.goToNextPage(driver);
        }

        Assertions.assertEquals(18, totalCount, "El número de vehículos no coincide."); //uno menos que en el otro test, el unico con un trayec
    }

    @Test
    @Order(48)
    public void PR044() {
        JSONObject loginCredentials = new JSONObject();
        loginCredentials.put("dni", "10000001S");
        loginCredentials.put("password", "Us3r@1-PASSW");

        Response loginResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(loginCredentials.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/users/login");


        assertEquals(200, loginResponse.getStatusCode());
        String token = loginResponse.jsonPath().getString("token");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }


    @Test
    @Order(49)
    public void PR045() {
        JSONObject loginCredentials = new JSONObject();
        loginCredentials.put("dni", "10000001S");
        loginCredentials.put("password", "ContraseñaIncorrecta123!");

        Response loginResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(loginCredentials.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/users/login");

        assertEquals(401, loginResponse.getStatusCode());


        String errorMessage = loginResponse.jsonPath().getString("message");
        assertNotNull(errorMessage);
        assertTrue(errorMessage.contains("no autorizado"));
    }

    @Test
    @Order(50)
    public void PR046() {
        // Caso 1: Username vacío
        JSONObject emptyUsernameCredentials = new JSONObject();
        emptyUsernameCredentials.put("dni", "");
        emptyUsernameCredentials.put("password", "Us3r@1-PASSW");

        Response emptyUsernameResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(emptyUsernameCredentials.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/users/login");

        assertEquals(400, emptyUsernameResponse.getStatusCode());

        // Caso 2: Contraseña vacía
        JSONObject emptyPasswordCredentials = new JSONObject();
        emptyPasswordCredentials.put("dni", "10000001S");
        emptyPasswordCredentials.put("password", "");

        Response emptyPasswordResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(emptyPasswordCredentials.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/users/login");
        assertEquals(400, emptyPasswordResponse.getStatusCode());

        // Caso 3: Ambos campos vacíos
        JSONObject emptyCredentials = new JSONObject();
        emptyCredentials.put("dni", "");
        emptyCredentials.put("password", "");

        Response emptyCredentialsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(emptyCredentials.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/users/login");
        assertEquals(400, emptyCredentialsResponse.getStatusCode());
    }

    @Test
    @Order(51)
    public void PR047() {
        String token = PO_LoginView.loginApi("10000001S","Us3r@1-PASSW");

        Response vehiclesResponse = RestAssured.given()
                .header("token", token)
                .when()
                .get("http://localhost:8081/api/v1.0/vehicles/available");

        assertEquals(200, vehiclesResponse.getStatusCode());

        List<Object> vehicles = vehiclesResponse.jsonPath().getList("");
        assertNotNull(vehicles);
        assertFalse(vehicles.isEmpty());
        assertEquals(18, vehicles.size()); // 18 vehículos disponibles ya que uno está ocupado
        for (Object vehicleObj : vehicles) {
            Map<String,Object> vehicle = (Map<String,Object>)vehicleObj;
            assertEquals("LIBRE", vehicle.get("status"));
        }
    }

    @Test
    @Order(52)
    public void PR048() {

        String token = PO_LoginView.loginApi("10000001S","Us3r@1-PASSW");

        JSONObject journeyBody = new JSONObject();
        journeyBody.put("numberPlate", "4567CRD");

        Response journeyResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .header("token", token)
                .body(journeyBody.toString())
                .when()
                .post("http://localhost:8081/api/v1.0/journeys/add");
        assertEquals(201, journeyResponse.getStatusCode());
        assertTrue(journeyResponse.jsonPath().getString("journeyId") != null);
        String vehicleId = journeyResponse.jsonPath().getString("vehicleId");

        Response vehicleResponse = RestAssured.given()
                .header("token", token)
                .when()
                .get("http://localhost:8081/api/v1.0/journeys/vehicle/" + vehicleId);

        assertEquals(200, vehicleResponse.getStatusCode());
        assertEquals("OCUPADO", vehicleResponse.jsonPath().getString("status"));
    }


    @Test
    @Order(53)
    public void PR049() {
        String token = PO_LoginView.loginApi("10000001S","Us3r@1-PASSW");

        String knownVehicleId = "67f78c358c8c58e3e50db18a";

        Response journeysResponse = RestAssured.given()
                .header("token", token)
                .when()
                .get("http://localhost:8081/api/v1.0/journeys/vehicle/" + knownVehicleId);

        assertEquals(200, journeysResponse.getStatusCode());

        assertNotNull(journeysResponse.jsonPath().getList("vehicles"));

        assertNotNull(journeysResponse.jsonPath().getList("journeys"));

        assertEquals(knownVehicleId, journeysResponse.jsonPath().getString("currentVehicleId"));
    }

    @Test
    @Order(54)
    public void PR050() {
        String token = PO_LoginView.loginApi("12345678Z", "@Dm1n1str@D0r");
        assertNotNull(token);

        Response journeysResponse = RestAssured.given()
                .header("token", token)
                .when()
                .get("http://localhost:8081/api/v1.0/journeys/user");

        assertEquals(200, journeysResponse.getStatusCode());

        List<Object> journeys = journeysResponse.jsonPath().getList("");
        assertNotNull(journeys);

        assertEquals(147, journeys.size());
    }

    @Test
    @Order(57)
    public void PR057() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        String checkText = "Lista de vehículos disponibles";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        PO_LoginView.logOutAPI(driver);
    }

    @Test
    @Order(58)
    public void PR058() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "12345678Z", "");
        String checkText = "Error en inicio de sesión";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(59)
    public void PR059() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "12345678Z", "admin");
        String checkText = "Error en inicio de sesión";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }

    @Test
    @Order(60)
    public void PR060() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");
        String checkText = "Lista de vehículos disponibles";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        List<WebElement> vehicleRows = driver.findElements(By.xpath("//*[@id=\"vehiclesTableBody\"]/tr"));
        int totalCount = vehicleRows.size();

        for (int i = 0; i < vehicleRows.size(); i++) {
            WebElement statusCell = vehicleRows.get(i).findElement(By.xpath("td[7]/span"));
            String status = statusCell.getText();
            Assertions.assertEquals("LIBRE", status);
        }

        Assertions.assertEquals(18, totalCount, "El número de vehículos no coincide.");

        PO_LoginView.logOutAPI(driver);
    }

    @Test
    @Order(61)
    public void PR061() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "10000002Q", "Us3r@2-PASSW");

        WebElement button = driver.findElement(By.xpath("/html/body/div/div/table/tbody/tr[3]/td[8]/button"));
        button.click();
        driver.findElement(By.xpath("/html/body/div/div/div[2]/button")).click();
        String checkText = "4567CRD - BMW Serie 3";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        PO_LoginView.logOutAPI(driver);

    }

    @Test
    @Order(62)
    public void PR062() {
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();
        PO_LoginView.fillForm(driver, "10000002Q", "Us3r@2-PASSW");

        driver.findElement(By.linkText("Ver trayectos de cada vehículo")).click();

        List<WebElement> rows = driver.findElements(By.cssSelector("#journeysTableBody tr"));
        Assertions.assertTrue(rows.size() >= 3);

        PO_LoginView.logOutAPI(driver);
    }

    @Test
    @Order(63)
    public void PR063(){
        List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Funcionalidades API");
        elements.get(0).click();

        PO_LoginView.fillForm(driver, "12345678Z", "@Dm1n1str@D0r");

        elements = PO_View.checkElementBy(driver, "text", "Ver mis trayectos");
        elements.get(0).click();
        String checkText = "Mis trayectos";
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());

        List<WebElement> journeyRows = driver.findElements(By.xpath("//*[@id=\"journeysTableBody\"]/tr"));
        int totalCount = journeyRows.size();

        Assertions.assertEquals(147, totalCount, "El número de vehículos no coincide.");

        PO_LoginView.logOutAPI(driver);
    }


}

