export default function ErrorResponse(
    message?: string,
    details?: unknown ,
    statusCode?: number,
) {
    const err = details instanceof Error ? details.message : "An unexpected error occurred";

    return new Response(
        JSON.stringify({ 
            error: err || "Internal Server Error", 
            message: message || "An unexpected error occurred" 
        }),
        { status: statusCode || 500 }
    );
}
  