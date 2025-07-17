export type SafeResult<T = any, E = string> = 
    | { data: T, error: undefined }
    | { data: undefined, error: E }