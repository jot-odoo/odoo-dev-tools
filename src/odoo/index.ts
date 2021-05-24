import API from './api';
import {
    Config,
    Dependency,
    Model,
    ModelGroup,
    Field,
    Selection,
    Module,
} from './types';

class Odoo {
    api: API;
    constructor(config: Config) {
        this.api = new API(config);
    }

    async getModules(ids?: number[]) {
        const fields = [
            'id',
            'name',
            'author',
            'description',
            'display_name',
            'shortdesc',
            'summary',
            'dependencies_id',
            'icon',
        ];
        const module_ids: Module[] = (await this.api.execute_kw(
            'ir.module.module',
            ids ? 'read' : 'search_read',
            [ids || [['state', '=', 'installed']]],
            {
                fields,
            }
        )) as Module[];
        return module_ids;
    }
    async getDependencies(ids?: number[]) {
        if (!ids) {
            return this.getModules();
        }
        const dependencies = (await this.api.execute_kw(
            'ir.module.module.dependency',
            'read',
            [ids],
            {
                fields: ['id', 'depend_id'],
            }
        )) as Dependency[];
        const modules = dependencies.map((dep) => dep.depend_id[0]);
        return this.getModules(modules);
    }
    async getModels() {
        const fields = [
            'id',
            'info',
            'display_name',
            'field_id',
            'model',
            'modules',
            'name',
            'transient',
            'view_ids',
        ];
        const models = (await this.api.execute_kw(
            'ir.model',
            'search_read',
            [[]],
            {
                fields,
            }
        )) as Model[];
        models.sort((a, b) => (a.model > b.model ? 1 : -1));
        const modelGroups: { [key: string]: Model[] } = {};
        models.forEach((model) => {
            model.level = 'model';
            if (model.model === '_unknown') {
                return;
            }
            const modelGroup = model.model.split('.', 1)[0];
            if (!modelGroups[modelGroup]) {
                modelGroups[modelGroup] = [];
            }
            modelGroups[modelGroup] = [...modelGroups[modelGroup], model];
        });
        const model_groups: ModelGroup[] = Object.entries(modelGroups).map(
            (val) => ({
                level: 'model_group',
                name: val[0],
                models: val[1],
            })
        );
        return model_groups;
    }
    async getFieldsByModel(model: string) {
        const fields = ['field_id'];
        const models = (await this.api.execute_kw(
            'ir.model',
            'search_read',
            [[['model', '=', model]]],
            {
                fields,
            }
        )) as { field_id: number[] }[];
        const fs = await this.getFields(models[0].field_id);
        fs.forEach((el) => (el.level = 'field'));
        return fs;
    }
    async getFields(ids: number[]) {
        const fields = [
            'id',
            'name',
            'modules',
            'readonly',
            'required',
            'relation',
            'ttype',
            'selectable',
            'selection_ids',
            'column1',
            'column2',
            'complete_name',
            'display_name',
            'field_description',
            'help',
        ];
        const results = (await this.api.execute_kw(
            'ir.model.fields',
            'read',
            [ids],
            {
                fields,
            }
        )) as Field[];
        results.forEach((el) => (el.level = 'field'));
        return results;
    }
    async getSelectionOptions(selection_ids: number[]) {
        const fields = ['id', 'name', 'display_name', 'value'];
        const results = (await this.api.execute_kw(
            'ir.model.fields.selection',
            'read',
            [selection_ids],
            {
                fields,
            }
        )) as Selection[];
        results.forEach((el) => (el.level = 'selection'));
        return results;
    }
}

export default Odoo;
