export type Dictionary<T> = {
    [Key: string]: T;
};
export type Module = {
    prefix: string;
    params: Dictionary<Value>;
};
export type Value = number | string;
