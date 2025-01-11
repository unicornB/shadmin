export interface IBase {
    id?: number;
    createdAt?: string;
    updatedAt?: string
}
export interface IPageRequest {
    page?: number;
    limit?: number;
}