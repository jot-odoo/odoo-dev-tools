import * as vscode from 'vscode';
import Odoo, { Module } from '../odoo';

export class ModuleProvider implements vscode.TreeDataProvider<Module> {
    client: Odoo;
    constructor(client: Odoo) {
        this.client = client;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        Module | undefined | null | void
    > = new vscode.EventEmitter<Module | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<
        Module | undefined | null | void
    > = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Module): vscode.TreeItem {
        const item = new vscode.TreeItem(
            element.name,
            element.dependencies_id.length > 0
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None
        );
        item.description = element.display_name;
        item.tooltip = `${element.display_name} by ${
            element.author
        }\n${'='.repeat(
            element.display_name.length + element.author.length + 4
        )}\n${element.description}`;
        return item;
    }
    getChildren(element?: Module): Thenable<Module[]> {
        return this.client.getDependencies(element?.dependencies_id);
    }
}
