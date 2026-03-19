We are going to build a REST API for managing bookmarks, users can save URLs, tag them, and retrieve them later with filtering. Consider all endpoints should validate the data that comes.

1. Create project: Node.js with Express and TypeScript, SQLite file for storage.
1.1. Environment-based configuration (no hardcoded values for port, database path, etc.)
2. Architecture of the project: We are going to use 3 layers, application -> Business (services) -> Domain (access to DB SQLite)
3. Add configuration and migration for the DB, we are going to use only one table to save the information Title: varchar(100), Url varchar(200), description varchar(500), tags varchar(500).
4. Add a middleware: this middleware is going to transform the responses:
4.1. Add custom exceptions, this custom exception will receive an string or an array of string (errors), and the original error will be logged in the middleware:
BadRequestException, by default this exception will return Http status code 400
BookmarkNotFoundException, by default this exception will return Http status code 404
BookmarkException, this will receive an additional param the http status code (unauthorized or simply an 500)
This exceptions will be handle by the middleware
4.2. Http 2xx:
No transformation.
Http different from 2xx:
{
    detail: string,
    httpStatus: number,
    errors: string[],
}
5. Create Add a bookmark (URL, title, optional description, tags)
{
    title:string, //required
    Url: string, //Valid url
    description?: string,//Optional
    tags: string[]//optional
}, this data will by saved in Bookmark table, for tags it will be saved split by comma
6. Create Get List all bookmarks with optional filtering by tag. (single tag) GET /bookmark&tag={tagName}
7. Create Get a single bookmark by ID. POST /bookmark
8. Create Update a bookmark. Validate if book mark exists and model is valid. PUT /bookmark
9. Create Delete a bookmark. Validate if book mark exists DELETE /bookmark
10. Create a health check endpoint: GET /health