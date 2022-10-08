export interface AuthControllerI<T, P> {
  Login: (req: T, res: P) => object
  Logout: (req: T, res: P) => void
  RefreshToken: (req: T, res: P) => Promise<string>
}
