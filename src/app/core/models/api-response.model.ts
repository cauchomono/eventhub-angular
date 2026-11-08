export interface ApiResponseModel<T> {
    data :T;
    meta: MetaInterface;

}

export interface MetaInterface{
    timestamp:string;
    "requestId":string;
}
