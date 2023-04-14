
/**
 * Builder for API errors
 */
class ApiError extends Error {
    statusCode: number;

    public static build(): ApiError {
        return new ApiError();
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public setMessage(status: string) {
        this.message = status;
        return this;
    }

    public setStatusCode(status: number) {
        this.statusCode = status;
        return this;
    }
}
