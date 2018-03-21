import { Injectable } from 'injection-js';

function _p8(s?: boolean) {
    let p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p ;
}

@Injectable()
export class UuidService {
    constructor() {

    }

    public generate(): string {
        return _p8() + _p8(true) + _p8(true) + _p8();
    }
}
