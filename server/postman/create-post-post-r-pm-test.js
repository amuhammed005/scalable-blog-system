// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 201
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

// Check that the response is an object (created post)
pm.test("Response is a created post object", function () {
  pm.expect(responseBodyJson).to.be.an("object");
});

// Check that the post has required properties
pm.test("Created post has required properties", function () {
  pm.expect(responseBodyJson).to.have.property("id");
  pm.expect(responseBodyJson).to.have.property("title");
  pm.expect(responseBodyJson).to.have.property("content");
  pm.expect(responseBodyJson).to.have.property("userId");
  pm.expect(responseBodyJson).to.have.property("createdAt");
  pm.expect(responseBodyJson).to.have.property("updatedAt");
  pm.expect(responseBodyJson).to.have.property("user").that.is.an("object");
});

// Check that the user object has required properties
pm.test("User object has required properties", function () {
  const user = responseBodyJson.user;
  pm.expect(user).to.have.property("id");
  pm.expect(user).to.have.property("username");
  pm.expect(user).to.have.property("email");
  pm.expect(user).to.have.property("name");
});

// Optionally, store the created post ID for later use
pm.test("Store post ID for future tests", function () {
  pm.environment.set("createdPostId", responseBodyJson.id);
});

// Check that response time is reasonable (less than 2000ms)
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
