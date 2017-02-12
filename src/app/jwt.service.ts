import { Injectable } from 'injection-js';

import crypto = require('crypto');

const algorithmMap = {
    HS256: 'sha256',
    HS384: 'sha384',
    HS512: 'sha512',
    RS256: 'RSA-SHA256'
};

const typeMap = {
    HS256: 'hmac',
    HS384: 'hmac',
    HS512: 'hmac',
    RS256: 'sign'
};

function verify(input: string, key: string, method: string, type: 'hmac' | 'sign', signature: string) {
    if (type === 'hmac') {
        return (signature === sign(input, key, method, type));
    } else if (type === 'sign') {
        return crypto.createVerify(method).update(input).verify(key, base64urlUnescape(signature), 'base64');
    } else {
        throw new Error('Algorithm type not recognized');
    }
}

function sign(input: string, key: string, method: string, type: 'hmac' | 'sign') {
    let base64str: string;

    if (type === 'hmac') {
        base64str = crypto.createHmac(method, key).update(input).digest('base64');
    } else if (type === 'sign') {
        base64str = crypto.createSign(method).update(input).sign(key, 'base64');
    } else {
        throw new Error('Algorithm type not recognized');
    }

    return base64urlEscape(base64str);
}

function base64urlDecode(str: string): string {
    return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str: string): string {
    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}

function base64urlEncode(str: string): string {
    return base64urlEscape(new Buffer(str).toString('base64'));
}

function base64urlEscape(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

@Injectable()
export class JwtService {

    constructor() { }

    encode<T>(payload: T, key: string, algorithm = 'HS256', header = { typ: 'JWT', alg: algorithm }) {
        // Check key
        if (!key) {
            throw new Error('Require key');
        }

        let signingMethod = algorithmMap[algorithm];
        let signingType = typeMap[algorithm];

        if (!signingMethod || !signingType) {
            throw new Error('Algorithm not supported');
        }

        // create segments, all segments should be base64 string
        let segments: string[] = [];

        segments.push(base64urlEncode(JSON.stringify(header)));
        segments.push(base64urlEncode(JSON.stringify(payload)));
        segments.push(sign(segments.join('.'), key, signingMethod, signingType));

        return segments.join('.');
    }

    decode<T>(token: string, key: string): T | null {
        // check token
        if (!token) {
            return null; // throw new Error('No token supplied');
        }
        // check segments
        let segments = token.split('.');
        if (segments.length !== 3) {
            return null; // throw new Error('Not enough or too many segments');
        }

        // All segment should be base64
        let headerSeg = segments[0];
        let payloadSeg = segments[1];
        let signatureSeg = segments[2];

        // base64 decode and parse JSON
        let header = JSON.parse(base64urlDecode(headerSeg));
        let payload = <T>JSON.parse(base64urlDecode(payloadSeg));

        let signingType = typeMap[header.alg];
        let signingMethod = <string>algorithmMap[header.alg];

        if (!signingMethod || !signingType) {
            return null; // throw new Error('Algorithm not supported');
        }

        // verify signature. `sign` will return base64 string.
        let signingInput = [headerSeg, payloadSeg].join('.');
        if (!verify(signingInput, key, signingMethod, signingType, signatureSeg)) {
            return null; // throw new Error('Signature verification failed');
        }

        return payload;
    }
}
