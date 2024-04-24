export interface IRepository {
  execute(params: object): Promise<object | null>
}
