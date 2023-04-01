import Dependency from "../../metadata/dependency";
import ModConfig from "../../metadata/mod-config";
import DependencyKind from "../dependency-kind";
import ModConfigDependency from "../mod-config-dependency";

function getDependencyEntries(container: any): Dependency[] {
    if (!Array.isArray(container)) {
        return [];
    }

    return container.map(dependency => new ModConfigDependency({
        id: dependency.id,
        kind: dependency.optional ? DependencyKind.Suggests : DependencyKind.Depends,
    }))
}

export default class VelocityPluginMetadata extends ModConfig {
    public readonly id: string;
    public readonly name: string;
    public readonly version: string;
    public readonly loaders: string[];
    public readonly dependencies: Dependency[];

    constructor(config: Record<string, unknown>) {
        super(config);
        this.id = String(config.id ?? "");
        this.name = String(config.name ?? "");
        this.version = String(config.version ?? "*");
        this.loaders = ["velocity"];
        this.dependencies = getDependencyEntries(config.dependencies);
    }
}
