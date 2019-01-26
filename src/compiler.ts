export default interface Compiler<U> {
  compile<T>(schema: T): U
}
