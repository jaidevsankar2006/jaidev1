export function notFoundHandler(_request, response) {
  response.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, _request, response, _next) {
  if (error.code === "ER_DUP_ENTRY") {
    response.status(409).json({ message: "A record with the same unique value already exists." });
    return;
  }

  if (error.code === "ER_NO_SUCH_TABLE") {
    response.status(500).json({ message: "Database schema is missing. Import the MySQL schema first." });
    return;
  }

  response.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
}
