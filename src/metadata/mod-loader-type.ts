enum ModLoaderType {
    Fabric = 1,
    Forge,
    NeoForge,
    Quilt,
    BungeeCord,
    Velocity,
    Spigot,
}

namespace ModLoaderType {
    export function getValues(): ModLoaderType[] {
        return <ModLoaderType[]>Object.values(ModLoaderType).filter(x => typeof x === "number");
    }

    export function fromString(value: string): ModLoaderType {
        return getValues()
            .filter(x => ModLoaderType[x].toString().toLowerCase() === value.toLowerCase())[0];
    }

    export function toString(target: ModLoaderType): string {
        return ModLoaderType[target] ?? target.toString();
    }
}

export default ModLoaderType;
