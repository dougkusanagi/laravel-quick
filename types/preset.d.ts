export type BreezeStack =
	| "blade"
	| "livewire"
	| "livewire-functional"
	| "vue"
	| "api";
export type Database = "sqlite" | "mysql" | "mariadb" | "pgsql" | "sqlsrv";
export type JetstreamStack = "livewire" | "inertia";
export type JetstreapOptionals = "api" | "ssr" | "teams" | "verification";
export type Scaffolding = "" | "breeze" | "jet";
// export type Test = "pest" | "php-unit";
export enum Test {
	Pest = 0,
	PhpUnit = 1,
}

export interface Preset {
	id?: string;
	name: string;
	cwp: string;
	test: Test;
	git: boolean;
	dark_mode: boolean;
	database: Database;
	scaffolding: Scaffolding;
	breeze_stack: BreezeStack;
	jetstream_stack: JetstreamStack;
	jetstream_optionals: JetstreapOptionals[];
}
