import * as xmlrpc from 'xmlrpc';
import { URL } from 'url';
import { Config, Version } from './types';

class Odoo_API {
    url: string;
    host: string;
    port: number;
    common: xmlrpc.Client;
    models: xmlrpc.Client;
    uid: Promise<number>;
    db: string;
    username: string;
    password: string;
    constructor(config: Config) {
        this.url = config.url;
        const url = new URL(config.url);
        this.host = url.hostname;
        this.port = parseInt(url.port);
        this.common = xmlrpc.createClient({
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common',
        });
        this.models = xmlrpc.createClient({
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object',
        });
        this.db = config.db;
        this.username = config.username;
        this.password = config.password;
        this.uid = this.authenticate();
    }
    async authenticate(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.common.methodCall(
                'authenticate',
                [this.db, this.username, this.password, {}],
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                }
            );
        });
    }
    async version(): Promise<Version> {
        return new Promise((resolve, reject) => {
            this.common.methodCall('version', [], (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    async execute_kw(
        model: string,
        method: string,
        args: any[],
        options?: any
    ) {
        const uid = await this.uid;
        return new Promise((resolve, reject) => {
            this.models.methodCall(
                'execute_kw',
                [this.db, uid, this.password, model, method, args, options],
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                }
            );
        });
    }
}

export default Odoo_API;
