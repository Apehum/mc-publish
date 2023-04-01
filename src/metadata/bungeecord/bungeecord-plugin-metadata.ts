import Dependency from "../../metadata/dependency";
import ModConfig from "../../metadata/mod-config";
import ModConfigDependency from "../mod-config-dependency";
import DependencyKind from "../dependency-kind";

function getDependencyEntries(container: any, kind: DependencyKind = DependencyKind.Depends): Dependency[] {
    if (!Array.isArray(container)) {
        return [];
    }

    return container.map(dependency => new ModConfigDependency({
        id: dependency,
        kind,
    }))
}

export default class BungeeCordPluginMetadata extends ModConfig {
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
        this.loaders = ["BungeeCord"];
        this.dependencies = getDependencyEntries(config.depends)
            .concat(getDependencyEntries(config.softDepends, DependencyKind.Suggests));
    }
}
