export default function ErrorResponse(message, details, statusCode, res) {
    const err = details instanceof Error ? details.message : "An unexpected error occurred";
    if (res) {
        return res.status(statusCode || 500).json({
            error: err || "Internal Server Error",
            message: message || "An unexpected error occurred"
        });
    }
    // Fallback for cases where res is not provided
    return {
        status: statusCode || 500,
        data: {
            error: err || "Internal Server Error",
            message: message || "An unexpected error occurred"
        }
    };
}
