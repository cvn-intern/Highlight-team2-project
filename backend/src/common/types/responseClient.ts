export interface ResponseClient {
    statusCode: number;
    success: boolean;
    message: any;
    error: string;
    data: any;
}