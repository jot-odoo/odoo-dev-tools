export type Config = {
    url: string;
    username: string;
    password: string;
    db: string;
};

export type Version = {
    server_version: string;
};

export type Module = {
    id: number;
    name: string;
    author: string;
    description: string;
    display_name: string;
    shortdesc: string;
    summary: string;
    dependencies_id: number[];
    icon: string;
};
export type Dependency = {
    depend_id: [number, string];
    id: number;
};

export type ModelGroup = {
    level: 'model_group';
    name: string;
    models: Model[];
};
export type Model = {
    level: 'model';
    id: number;
    info: string;
    display_name: string;
    field_id: number[];
    model: string;
    modules: string[];
    name: string;
    transient: boolean;
    view_ids: number[];
};
export type Field = {
    level: 'field';
    id: number;
    name: string;
    modules: string;
    readonly: boolean;
    required: string;
    relation: string;
    ttype: string;
    selectable: boolean;
    selection_ids: number[];
    column1: string;
    column2: string;
    complete_name: string;
    display_name: string;
    field_description: string;
    help: string;
};
export type Selection = {
    level: 'selection';
    id: number;
    name: string;
    display_name: string;
    value: string;
};
