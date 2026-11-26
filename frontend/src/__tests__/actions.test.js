import {
  authenticateAction,
  loginAction,
  logoutAction,
  registerAction,
  registrationSuccessMessage
} from "../actions/auth/authActions";
import { changePassword } from "../actions/auth/changePasswordActions";
import * as types from "../types/actionTypes";

const jsonResponse = (body, ok = true) =>
  Promise.resolve({ ok, json: () => Promise.resolve(body) });

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

describe("auth actions", () => {
  it("authenticateAction stores the token, leaves /login and dispatches", async () => {
    const dispatch = jest.fn(action => action);
    const push = jest.fn();
    await authenticateAction({ token: "abc" }, dispatch, "/login", push)();
    expect(localStorage.getItem("ecom_token")).toBe("abc");
    expect(push).toHaveBeenCalledWith("/");
    expect(dispatch).toHaveBeenCalledWith({ type: types.AUTHENTICATED });
  });

  it("authenticateAction stays on any other page", async () => {
    const push = jest.fn();
    await authenticateAction({ token: "abc" }, jest.fn(), "/book", push)();
    expect(push).not.toHaveBeenCalled();
  });

  it("logoutAction forgets the token", () => {
    localStorage.setItem("ecom_token", "abc");
    expect(logoutAction()).toEqual({ type: types.UNAUTHENTICATED });
    expect(localStorage.getItem("ecom_token")).toBeNull();
  });

  it("registrationSuccessMessage builds its action", () => {
    expect(registrationSuccessMessage()).toEqual({
      type: types.REGISTRATION_SUCCESS_MESSAGE
    });
  });

  it("loginAction posts the credentials to the JWT endpoint", async () => {
    fetch.mockReturnValue(jsonResponse({ token: "t" }));
    const body = await loginAction({ username: "u", password: "p" })();
    expect(body).toEqual({ token: "t" });
    const [url, conf] = fetch.mock.calls[0];
    expect(url).toBe("http://127.0.0.1:8000/auth/jwt/create/");
    expect(conf.method).toBe("POST");
    expect(JSON.parse(conf.body)).toEqual({ username: "u", password: "p" });
  });

  it("registerAction posts to the djoser create endpoint", async () => {
    fetch.mockReturnValue(jsonResponse({ id: 1 }));
    expect(await registerAction({ username: "u" })()).toEqual({ id: 1 });
    expect(fetch.mock.calls[0][0]).toBe("http://127.0.0.1:8000/auth/users/create/");
  });
});

describe("changePassword", () => {
  it("sends the stored JWT and dispatches request then success", async () => {
    localStorage.setItem("ecom_token", "abc");
    fetch.mockReturnValue(jsonResponse({}, true));
    const dispatch = jest.fn(action => action);
    await changePassword({ new_password: "x" })(dispatch);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("JWT abc");
    expect(dispatch.mock.calls.map(c => c[0].type)).toEqual([
      types.IS_CHANGING_PASSWORD,
      types.CHANGE_PASSWORD_SUCCESS
    ]);
  });

  it("dispatches failure when the API refuses", async () => {
    fetch.mockReturnValue(jsonResponse({}, false));
    const dispatch = jest.fn(action => action);
    await changePassword({})(dispatch);
    const last = dispatch.mock.calls[1][0];
    expect(last.type).toBe(types.CHANGE_PASSWORD_FAILURE);
    expect(last.err.message).toBe("Invalid credentials, please try again.");
  });
});
