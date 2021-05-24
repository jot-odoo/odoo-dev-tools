import * as vscode from 'vscode';
import Odoo from './odoo';

export const getOdooVersion = async (client: Odoo) => {
    try {
        const uid = await client.api.uid;
        const version = await client.api.version();
        vscode.window.showInformationMessage(
            `Odoo is up and running!\n
            Version: ${version.server_version}\t\n
            User ID: ${uid}`
        );
    } catch (error) {
        vscode.window.showErrorMessage(`
            Cannot connect to Odoo!\n
            Is the server running?
        `);
    }
};
