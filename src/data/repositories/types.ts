export interface IRepository<T> {
    get(filter?: any): Promise<T[]>;

    getById(id: string): Promise<T>;

    create(data: any): Promise<T>;

    update(id: string, data: any): Promise<T>;

    delete(id: string): Promise<T>;
}