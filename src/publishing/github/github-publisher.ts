import PublisherTarget from "../publisher-target";
import * as github from "@actions/github";
import File from "../../utils/io/file";
import ModPublisher from "../../publishing/mod-publisher";
import Dependency from "../../metadata/dependency";
import { mapStringInput, mapBooleanInput } from "../../utils/actions/input";
import VersionType from "../../utils/versioning/version-type";
import { env } from "process";

function getEnvironmentTag(): string | undefined {
    if (env.GITHUB_REF?.startsWith("refs/tags/")) {
        return env.GITHUB_REF.substring(10);
    }
    return undefined;
}

export default class GitHubPublisher extends ModPublisher {
    public get target(): PublisherTarget {
        return PublisherTarget.GitHub;
    }

    protected get requiresId(): boolean {
        return false;
    }

    protected get requiresModLoaders(): boolean {
        return false;
    }

    protected get requiresGameVersions(): boolean {
        return false;
    }
    protected async publishMod(_id: string, token: string, name: string, version: string, channel: string, _loaders: string[], _gameVersions: string[], _java: string[], changelog: string, files: File[], _dependencies: Dependency[], options: Record<string, unknown>): Promise<void> {
        const repo = github.context.repo;
        const octokit = github.getOctokit(token);
        const environmentTag = getEnvironmentTag();

        if (version.includes("SNAPSHOT")) {
            // removes snapshot build number, 2.0.0-SNAPSHOT+1 or 2.0.0-SNAPSHOT.1 or 2.1.0+1f48b7c-SNAPSHOT,
            // so version will be just 2.0.0-SNAPSHOT
            version = version.split("+")[0].split("-")[0] + "-SNAPSHOT";
        }

        let tag = mapStringInput(options.tag, null);
        let releaseId = 0;
        if (tag) {
            releaseId = await this.getReleaseIdByTag(tag, token);
        } else if (github.context.payload.release?.id) {
            releaseId = github.context.payload.release?.id;
        } else if (environmentTag) {
            releaseId = await this.getReleaseIdByTag(environmentTag, token);
        } else if (version) {
            releaseId = await this.getReleaseIdByTag(version, token);
        }

        const generated = !releaseId;
        const prerelease = mapBooleanInput(options.prerelease, channel !== VersionType.Release);
        if (!releaseId && (tag ??= environmentTag ?? version)) {
            const generateChangelog = mapBooleanInput(options.generateChangelog, !changelog);
            const draft = mapBooleanInput(options.draft, false);
            const commitish = mapStringInput(options.commitish, null);
            const discussion = mapStringInput(options.discussion, null);
            releaseId = await this.createRelease(tag, name, changelog, generateChangelog, draft, prerelease, commitish, discussion, token);
        }
        if (!releaseId) {
            throw new Error(`Cannot find or create release ${tag}`);
        }

        const existingAssets = generated ? [] : (await octokit.rest.repos.listReleaseAssets({ ...repo, release_id: releaseId })).data;
        for (const file of files) {
            const existingAsset = existingAssets.find(x => {
                // delete existing snapshot
                if (x.name.includes("SNAPSHOT")) {
                    const split = x.name.split("+");
                    const assetName = split.slice(0, split.length - 1).join("+");

                    if (file.name.includes(assetName) || file.path.includes(assetName)) {
                        return true;
                    }
                }

                return x.name === file.name || x.name === file.path;
            });
            if (existingAsset) {
                await octokit.rest.repos.deleteReleaseAsset({ ...repo, asset_id: existingAsset.id })
            }

            await octokit.rest.repos.uploadReleaseAsset({
                owner: repo.owner,
                repo: repo.repo,
                release_id: releaseId,
                name: file.name,
                data: <any>await file.getBuffer()
            });

            await octokit.rest.repos.updateRelease({
                owner: repo.owner,
                repo: repo.repo,
                release_id: releaseId,
                prerelease,
            });
        }
    }

    private async getReleaseIdByTag(tag: string, token: string): Promise<number | undefined> {
        const octokit = github.getOctokit(token);
        try {
            const response = await octokit.rest.repos.getReleaseByTag({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                tag
            });
            return response.status >= 200 && response.status < 300 ? response.data.id : undefined;
        } catch {
            return undefined;
        }
    }

    private async createRelease(tag: string, name: string, body: string, generateReleaseNotes: boolean, draft: boolean, prerelease: boolean, targetCommitish: string, discussionCategoryName: string, token: string): Promise<number | undefined> {
        const octokit = github.getOctokit(token);
        try {
            const response = await octokit.rest.repos.createRelease({
                tag_name: tag,
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                target_commitish: targetCommitish || undefined,
                name: name || undefined,
                body: body || undefined,
                draft,
                prerelease,
                discussion_category_name: discussionCategoryName || undefined,
                generate_release_notes: generateReleaseNotes,
            });
            return response.status >= 200 && response.status < 300 ? response.data.id : undefined;
        } catch {
            return undefined;
        }
    }
}
