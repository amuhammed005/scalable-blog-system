// Parse the response body as JSON
const responseBodyJson = pm.response.json();

// Check that the status code is 200
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// Check that the response has a 'posts' property that is an array
pm.test("Response has posts array", function () {
  pm.expect(responseBodyJson).to.have.property("posts").that.is.an("array");
});

// Check that the response has a 'pagination' object
pm.test("Response has pagination object", function () {
  pm.expect(responseBodyJson)
    .to.have.property("pagination")
    .that.is.an("object");
});

// Check that pagination has required properties
pm.test("Pagination has required properties", function () {
  const pagination = responseBodyJson.pagination;
  pm.expect(pagination).to.have.property("page");
  pm.expect(pagination).to.have.property("limit");
  pm.expect(pagination).to.have.property("total");
  pm.expect(pagination).to.have.property("pages");
});

// Check that response time is reasonable (less than 2000ms)
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
