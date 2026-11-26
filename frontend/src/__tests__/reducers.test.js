import authReducer from "../reducers/auth/authReducer";
import changePasswordReducer from "../reducers/auth/changePasswordReducer";
import rootReducer from "../reducers";
import * as types from "../types/actionTypes";

describe("authReducer", () => {
  it("starts logged out with no message", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({
      authenticated: false,
      registration_message: ""
    });
  });

  it("logs in and out", () => {
    const loggedIn = authReducer(undefined, { type: types.AUTHENTICATED });
    expect(loggedIn.authenticated).toBe(true);
    const loggedOut = authReducer(loggedIn, { type: types.UNAUTHENTICATED });
    expect(loggedOut.authenticated).toBe(false);
  });

  it("shows the registration message without changing the login state", () => {
    const state = authReducer(
      { authenticated: false, registration_message: "" },
      { type: types.REGISTRATION_SUCCESS_MESSAGE }
    );
    expect(state.authenticated).toBe(false);
    expect(state.registration_message).toBe(
      "You have been registered successfully."
    );
    expect(
      authReducer(state, { type: types.AUTHENTICATED }).registration_message
    ).toBe("");
  });

  it("ignores unknown actions", () => {
    const state = { authenticated: true, registration_message: "x" };
    expect(authReducer(state, { type: "OTHER" })).toBe(state);
  });
});

describe("changePasswordReducer", () => {
  it("tracks a change from request to success", () => {
    let state = changePasswordReducer(undefined, { type: "@@INIT" });
    expect(state.isChangingPassword).toBe(false);
    state = changePasswordReducer(state, { type: types.IS_CHANGING_PASSWORD });
    expect(state).toEqual({ isChangingPassword: true, err: null, resp_message: "" });
    state = changePasswordReducer(state, { type: types.CHANGE_PASSWORD_SUCCESS });
    expect(state.isChangingPassword).toBe(false);
    expect(state.resp_message).toBe("Password Changes successfully.");
  });

  it("keeps the error and clears the message on failure", () => {
    const err = new Error("bad");
    const state = changePasswordReducer(
      { isChangingPassword: true, err: null, resp_message: "old" },
      { type: types.CHANGE_PASSWORD_FAILURE, err }
    );
    expect(state).toEqual({ isChangingPassword: false, err, resp_message: "" });
  });
});

it("combines both reducers under auth and change_password", () => {
  const state = rootReducer(undefined, { type: "@@INIT" });
  expect(Object.keys(state).sort()).toEqual(["auth", "change_password"]);
});
