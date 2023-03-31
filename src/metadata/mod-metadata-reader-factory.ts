import FabricModMetadataReader from "./fabric/fabric-mod-metadata-reader";
import ForgeModMetadataReader from "./forge/forge-mod-metadata-reader";
import QuiltModMetadataReader from "./quilt/quilt-mod-metadata-reader";
import ModLoaderType from "./mod-loader-type";
import ModMetadataReader from "./mod-metadata-reader";
import BungeeCordPluginMetadataReader from "./bungeecord/bungeecord-plugin-metadata-reader";
import SpigotPluginMetadataReader from "./spigot/spigot-plugin-metadata-reader";
import VelocityPluginMetadataReader from "./velocity/velocity-plugin-metadata-reader";

export default class ModMetadataReaderFactory {
    public create(loaderType: ModLoaderType): ModMetadataReader {
        switch (loaderType) {
            case ModLoaderType.Fabric:
                return new FabricModMetadataReader();

            case ModLoaderType.Forge:
                return new ForgeModMetadataReader();

            case ModLoaderType.Quilt:
                return new QuiltModMetadataReader();

            case ModLoaderType.BungeeCord:
                return new BungeeCordPluginMetadataReader();

            case ModLoaderType.Velocity:
                return new VelocityPluginMetadataReader();

            case ModLoaderType.Spigot:
                return new SpigotPluginMetadataReader();

            default:
                throw new Error(`Unknown mod loader "${ModLoaderType.toString(loaderType)}"`);
        }
    }
}
