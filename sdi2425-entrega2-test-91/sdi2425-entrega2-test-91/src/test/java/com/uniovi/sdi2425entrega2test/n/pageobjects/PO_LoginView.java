package com.uniovi.sdi2425entrega2test.n.pageobjects;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.json.simple.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class PO_LoginView extends PO_NavView {

	static public void fillLoginForm(WebDriver driver, String dnip, String passwordp) {
		WebElement dni = driver.findElement(By.name("email"));
		dni.click();
		dni.clear();
		dni.sendKeys(dnip);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		//Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();	
	}

	static public void fillForm(WebDriver driver, String dnip, String passwordp) {
		WebDriverWait wait = new WebDriverWait(driver, 1);
		WebElement dni = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("dni")));
		dni.click();
		dni.clear();
		dni.sendKeys(dnip);
		WebElement password = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("password")));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		By boton = By.className("btn");
		wait.until(ExpectedConditions.elementToBeClickable(boton)).click();
	}

	static public void logOut(WebDriver driver){
		String loginText = "Ha cerrado sesión correctamente";
		PO_PrivateView.clickOption(driver, "logout", "text", loginText);
	}

	static public void logOutAPI(WebDriver driver){
		List<WebElement> elements = PO_View.checkElementBy(driver, "text", "Cerrar sesión");
		elements.get(0).click();
	}

	static public void login(WebDriver driver,String user, String password, String checkText) {
		clickOption(driver, "login", "class", "btn btn-primary");
		fillLoginForm(driver, user, password);
		//Comprobamos que entramos en la pagina privada del Profesor
		checkElementBy(driver, "text", checkText);
	}

	public static String loginApi(String dni, String password) {
		JSONObject loginBody = new JSONObject();
		loginBody.put("dni", dni);
		loginBody.put("password", password);

		Response response = RestAssured.given()
				.contentType(ContentType.JSON)
				.body(loginBody.toString())
				.when()
				.post("http://localhost:8081/api/v1.0/users/login");

		if (response.getStatusCode() == 200) {
			return response.jsonPath().getString("token");
		}
		return null;
	}
}
