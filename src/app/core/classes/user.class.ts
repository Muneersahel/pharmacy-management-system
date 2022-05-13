export class AuthUser {
  constructor(
    private _accessToken: string,
    private _refreshToken: string,
    private _tokenExpirationDate: Date
  ) {}

  get accessToken() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._accessToken;
  }

  get refreshToken() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._refreshToken;
  }

  get tokenExpirationDate() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }

    return this._tokenExpirationDate;
  }
}
