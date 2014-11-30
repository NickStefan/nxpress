# nxpress

Blog Post: http://www.nickstefan.net/blog/view/express-routing

I will be building an express like framework piece by piece, one commit at a time, with comments and lots of annotations. There are tests beginning with 4th commit. Most of the commits/comments are best understood by starting with server.js and nxpress.js.

- [x] 1st commit = not much
- [x] 2nd commit = single request handler directly listening to an http.createServer()
- [x] 3rd commit = simplified version of nested routing and app.use('/',myRoutes) api
- [x] 4th commit = almost identical code pattern and api to express routing and app.use('/',myRoutes) api, but much easier to understand than the express codebase due to:
	  * less error and edge case handling
	  * less options and defaults being passed around
	  * no non-routing middleware
	  * lots of comments and annotations

Still TODO:
- [ ] request and response built in headers and status codes
- [ ] middleware
- [ ] view engine and static files
- [ ] more...
