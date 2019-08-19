const OktaJwtVerifier = require('@okta/jwt-verifier');

class JWTVerfier {
    constructor(oktaAuthorizationServerURI, client_id) {
        if (oktaAuthorizationServerURI) {
            this.JwtVerifier = new OktaJwtVerifier({
                issuer: oktaAuthorizationServerURI,
                clientId: client_id
            });
        }
    }

    verifyAccessToken(accessToken) {
        if (!this.JwtVerifier) {
            throw new Error('JwtVerifier not initialized');
        }

        return this.JwtVerifier.verifyAccessToken(accessToken);
    }
}

module.exports = JWTVerfier;