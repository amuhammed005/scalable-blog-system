// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 200
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// Check that the response has a 'message' property
pm.test("Response has success message", function () {
  pm.expect(responseBodyJson).to.have.property(
    "message",
    "Post deleted successfully",
  );
});

// Check that response time is reasonable (less than 2000ms)
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
