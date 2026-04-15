// Set Authorization header if access token is available
if (pm.environment.get("accessToken")) {
  pm.request.headers.add({
    key: "Authorization",
    value: `Bearer ${pm.environment.get("accessToken")}`,
  });
}
