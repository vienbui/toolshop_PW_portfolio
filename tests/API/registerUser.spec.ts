import { expect, test } from "@playwright/test";
import { UserRoutes } from "../../src/routes/user.routes";

test.describe("register user", () => {
  let userId: string;
  const BASE_API_URL = process.env.API_URL;

  if (!BASE_API_URL) throw new Error("API_URL has not set in .env");

  test("register user", async ({ request }) => {
    const registerUrl = `${BASE_API_URL}/${UserRoutes.registerUser}`;

    const email = `chloe${Date.now()}@example.com`;

    const userRegister = {
      first_name: "chloe",
      last_name: "test",
      address: {
        street: "Street 1",
        house_number: "12",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA",
      },
      phone: "0987654321",
      dob: "1970-01-01",
      password: "SuperSecure@123",
      email: email,
    };

    const response = await request.post(registerUrl, { data: userRegister });

    const responseBody = await response.json();
    userId = responseBody.id;

    expect(response.status()).toBe(201);
    expect(responseBody.email).toBe(email);
    expect(responseBody.password).toBeUndefined();
    expect(responseBody.id).toBeTruthy();
  });

  test.afterEach(async ({ request }) => {
    if (!userId) return ;
    
      const loginUserURL = `${BASE_API_URL}/${UserRoutes.loginUser}`;
      const loginResponse = await request.post(loginUserURL, {
        data: {
          email: "admin@practicesoftwaretesting.com",
          password: "welcome01",
        },
      });

      const loginResponseBody = await loginResponse.json();
      const loginToken = loginResponseBody.access_token;

      const deleteUserURL = `${BASE_API_URL}/${UserRoutes.deleteUser}/${userId}`;
      const responseDelete = await request.delete(deleteUserURL, {
        headers: { Authorization: `Bearer ${loginToken}` },
      });

      expect(responseDelete.status()).toBe(204);
    }
  );
});
