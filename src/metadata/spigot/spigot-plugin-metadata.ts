import Dependency from "../../metadata/dependency";
import ModConfig from "../../metadata/mod-config";

export default class SpigotPluginMetadata extends ModConfig {
    public readonly id: string;
    public readonly name: string;
    public readonly version: string;
    public readonly loaders: string[];
    public readonly dependencies: Dependency[];

    constructor(config: Record<string, unknown>) {
        super(config);
        this.name = String(config.name ?? "");
        this.id = this.name;
        this.version = String(config.version ?? "*");
        this.loaders = ["spigot", "paper"];
        this.dependencies = [];
        // todo: deps?
    }
}
