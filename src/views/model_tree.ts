import * as vscode from 'vscode';
import Odoo from '../odoo';
import { Field, Model, ModelGroup, Selection } from '../odoo/types';

type Item = Field | Model | ModelGroup | Selection;

export class ModelProvider implements vscode.TreeDataProvider<Item> {
    client: Odoo;
    constructor(client: Odoo) {
        this.client = client;
    }

    getTreeItem(element: Item): vscode.TreeItem {
        switch (element.level) {
            case 'field':
                return this.renderField(element);
            case 'model':
                return this.renderModel(element);
            case 'model_group':
                return this.renderModelGroup(element);
            case 'selection':
                return this.renderSelection(element);
        }
    }

    private renderModelGroup(element: ModelGroup) {
        return new vscode.TreeItem(
            element.name,
            vscode.TreeItemCollapsibleState.Collapsed
        );
    }

    private renderSelection(element: Selection) {
        const item = new vscode.TreeItem(element.value);
        item.description = element.name;
        return item;
    }

    private renderField(element: Field) {
        const item = new vscode.TreeItem(
            element.name,
            element.relation || element.ttype === 'selection'
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None
        );
        item.description = element.ttype;
        item.tooltip = `${element.field_description}\n${
            element.help ? element.help : ''
        }\nFrom modules: ${element.modules}`;
        return item;
    }

    private renderModel(element: Model) {
        const item = new vscode.TreeItem(
            element.model,
            vscode.TreeItemCollapsibleState.Collapsed
        );
        return item;
    }

    getChildren(element?: Item): Thenable<Item[]> {
        if (!element) {
            return this.client.getModels();
        }
        switch (element.level) {
            case 'model':
                return this.client.getFields(element.field_id);
            case 'field':
                if (element.relation) {
                    return this.client.getFieldsByModel(element.relation);
                } else {
                    return this.client.getSelectionOptions(
                        element.selection_ids
                    );
                }
            case 'model_group':
                return new Promise<Item[]>((resolve) =>
                    resolve(element.models)
                );
            default:
                return new Promise((resolve) => resolve([]));
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<
        Item | undefined | null | void
    > = new vscode.EventEmitter<Item | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Item | undefined | null | void> =
        this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
