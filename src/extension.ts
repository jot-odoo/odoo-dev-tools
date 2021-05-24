import * as vscode from 'vscode';
import { getOdooVersion } from './commands';
import Odoo from './odoo';
import { ModuleProvider } from './views/module_tree';
import { ModelProvider } from './views/model_tree';
import { Config } from './odoo/types';

export function activate(context: vscode.ExtensionContext) {
    const config: Config = {
        url: vscode.workspace
            .getConfiguration('odoo-dev-tools')
            .get('server.url') as string,
        username: vscode.workspace
            .getConfiguration('odoo-dev-tools')
            .get('server.username') as string,
        password: vscode.workspace
            .getConfiguration('odoo-dev-tools')
            .get('server.password') as string,
        db: vscode.workspace
            .getConfiguration('odoo-dev-tools')
            .get('server.database') as string,
    };
    const client = new Odoo(config);
    context.subscriptions.push(
        vscode.commands.registerCommand('odoo-dev-tools.getVersion', () =>
            getOdooVersion(client)
        )
    );
    const moduleProvider = new ModuleProvider(client);
    vscode.window.registerTreeDataProvider('modules', moduleProvider);
    context.subscriptions.push(
        vscode.commands.registerCommand('modules.refreshEntry', () =>
            moduleProvider.refresh()
        )
    );
    const modelProvider = new ModelProvider(client);
    vscode.window.registerTreeDataProvider('models', modelProvider);
    context.subscriptions.push(
        vscode.commands.registerCommand('models.refreshEntry', () =>
            modelProvider.refresh()
        )
    );
}

export function deactivate() {}
