import Dependency from "../../metadata/dependency";
import ModConfig from "../../metadata/mod-config";
import DependencyKind from "../dependency-kind";
import ModConfigDependency from "../mod-config-dependency";

function getDependencyEntries(container: any, kind: DependencyKind = DependencyKind.Depends): Dependency[] {
    if (!Array.isArray(container)) {
        return [];
    }

    return container.map(dependency => new ModConfigDependency({
        id: dependency,
        kind,
    }))
}

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
        if (config["folia-supported"]) this.loaders.push("folia");
        this.dependencies = getDependencyEntries(config.depend)
            .concat(getDependencyEntries(config.softdepend, DependencyKind.Suggests));
    }
}
