import ModMetadata from "../../metadata/mod-metadata";
import ZippedModMetadataReader from "../../metadata/zipped-mod-metadata-reader";
import SpigotPluginMetadata from "./spigot-plugin-metadata";
import yaml from "yaml";

export default class SpigotPluginMetadataReader extends ZippedModMetadataReader {
    constructor() {
        super("plugin.yml");
    }

    protected loadConfig(buffer: Buffer): Record<string, unknown> {
        return yaml.parse(buffer.toString("utf8"));
    }

    protected createMetadataFromConfig(config: Record<string, unknown>): ModMetadata {
        return new SpigotPluginMetadata(config);
    }
}
