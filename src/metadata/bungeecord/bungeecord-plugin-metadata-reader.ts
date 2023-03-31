import ModMetadata from "../../metadata/mod-metadata";
import ZippedModMetadataReader from "../../metadata/zipped-mod-metadata-reader";
import BungeeCordPluginMetadata from "./bungeecord-plugin-metadata";
import yaml from "yaml";

export default class BungeeCordPluginMetadataReader extends ZippedModMetadataReader {
    constructor() {
        super("bungee.yml");
    }

    protected loadConfig(buffer: Buffer): Record<string, unknown> {
        return yaml.parse(buffer.toString("utf8"));
    }

    protected createMetadataFromConfig(config: Record<string, unknown>): ModMetadata {
        return new BungeeCordPluginMetadata(config);
    }
}
