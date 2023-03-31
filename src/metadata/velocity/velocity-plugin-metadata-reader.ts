import ModMetadata from "../../metadata/mod-metadata";
import ZippedModMetadataReader from "../../metadata/zipped-mod-metadata-reader";
import VelocityPluginMetadata from "./velocity-plugin-metadata";

export default class VelocityPluginMetadataReader extends ZippedModMetadataReader {
    constructor() {
        super("velocity-plugin.json");
    }

    protected loadConfig(buffer: Buffer): Record<string, unknown> {
        return JSON.parse(buffer.toString("utf8"));
    }

    protected createMetadataFromConfig(config: Record<string, unknown>): ModMetadata {
        return new VelocityPluginMetadata(config);
    }
}
