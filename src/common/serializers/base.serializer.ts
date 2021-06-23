export abstract class BaseSerializerService<E, T> {
  abstract serialize(entity: E): Promise<T>;

  serializeCollection(values: E[]): Promise<T[]> {
    return Promise.all<T>(values.map((value) => this.serialize(value)));
  }
}
