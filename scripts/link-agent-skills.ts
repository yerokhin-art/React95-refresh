import { existsSync, readFileSync, realpathSync } from 'node:fs';
import {
  cp,
  lstat,
  mkdir,
  readdir,
  readlink,
  realpath,
  rm,
  symlink,
  unlink
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SKILLS_SEGMENT = ['dist', 'skills'] as const;

export class LinkSkillsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LinkSkillsError';
  }
}

export interface CliOptions {
  command: 'link' | 'unlink';
  force: boolean;
  copy: boolean;
  dryRun: boolean;
  help: boolean;
  cwd: string;
}

export type SkillAction =
  | 'linked'
  | 'already-linked'
  | 'copied'
  | 'removed'
  | 'kept'
  | 'skipped';

export interface SkillActionResult {
  skill: string;
  action: SkillAction;
  dest: string;
  target?: string;
  reason?: string;
}

export interface LinkAgentSkillsOptions {
  cwd?: string;
  command?: 'link' | 'unlink';
  force?: boolean;
  copy?: boolean;
  dryRun?: boolean;
  packageName: string;
  ownPackageRoot?: string;
}

export interface LinkAgentSkillsResult {
  projectRoot: string;
  sourceRoot: string | null;
  mode: 'link' | 'copy';
  fellBackToCopy: boolean;
  actions: SkillActionResult[];
}

export const HELP = `
Link react95-refresh Cursor agent skills into the current project.

Usage:
  react95-refresh-skills [link|unlink] [options]

Commands:
  link      Create .cursor/skills/<name> links (default)
  unlink    Remove links created by this command

Options:
  --dir <path>  Project directory (default: current directory)
  --copy        Copy skill files instead of linking
  --force       Replace an existing skill directory or link
  --dry-run     Print actions without writing
  -h, --help    Show this help

Install does not run this command. A link is a relative path to
node_modules/<package>/dist/skills, so the skill follows the
installed version. Use --copy when a symlink is not appropriate.
`.trim();

export function parseCliArgs(args: string[], cwd = process.cwd()): CliOptions {
  const options: CliOptions = {
    command: 'link',
    force: false,
    copy: false,
    dryRun: false,
    help: false,
    cwd
  };
  let sawCommand = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === undefined) continue;

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--copy') {
      options.copy = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--dir' || arg.startsWith('--dir=')) {
      const value = arg.startsWith('--dir=')
        ? arg.slice('--dir='.length)
        : args[index + 1];
      if (!value) {
        throw new LinkSkillsError('Missing path after --dir.');
      }
      if (!arg.startsWith('--dir=')) index += 1;
      options.cwd = value;
      continue;
    }
    if (arg === 'link' || arg === 'unlink') {
      if (sawCommand) {
        throw new LinkSkillsError(`Unexpected extra command: ${arg}`);
      }
      sawCommand = true;
      options.command = arg;
      continue;
    }
    throw new LinkSkillsError(`Unknown argument: ${arg}`);
  }

  if (options.copy && options.command === 'unlink') {
    throw new LinkSkillsError('--copy cannot be used with unlink.');
  }

  return options;
}

export function findProjectRoot(cwd: string): string {
  let dir = path.resolve(cwd);
  const fsRoot = path.parse(dir).root;

  while (true) {
    if (existsSync(path.join(dir, 'package.json'))) return dir;
    if (dir === fsRoot) return path.resolve(cwd);
    dir = path.dirname(dir);
  }
}

export function findOwnPackageRoot(moduleUrl: string): string {
  let dir = path.dirname(fileURLToPath(moduleUrl));
  const fsRoot = path.parse(dir).root;

  while (true) {
    if (existsSync(path.join(dir, 'package.json'))) return dir;
    if (dir === fsRoot) {
      throw new LinkSkillsError(
        'Could not locate package.json for this command.'
      );
    }
    dir = path.dirname(dir);
  }
}

export function findInstalledPackageDir(
  start: string,
  packageName: string
): string | null {
  let dir = path.resolve(start);
  const fsRoot = path.parse(dir).root;

  while (true) {
    const candidate = path.join(dir, 'node_modules', packageName);
    if (readPackageName(path.join(candidate, 'package.json')) === packageName) {
      return candidate;
    }
    if (dir === fsRoot) return null;
    dir = path.dirname(dir);
  }
}

export async function linkAgentSkills(
  options: LinkAgentSkillsOptions
): Promise<LinkAgentSkillsResult> {
  const cwd = options.cwd ?? process.cwd();
  const command = options.command ?? 'link';
  const projectRoot = findProjectRoot(cwd);
  const force = options.force ?? false;
  const dryRun = options.dryRun ?? false;
  const requestedCopy = options.copy ?? false;

  if (
    options.ownPackageRoot &&
    (await sameDirectory(projectRoot, options.ownPackageRoot))
  ) {
    throw new LinkSkillsError(
      'This repository already contains the agent skills in .cursor/skills. ' +
        'Run this command from a project that depends on the package.'
    );
  }

  const installed = findInstalledPackageDir(projectRoot, options.packageName);
  const resolved = resolveSkillSource({
    command,
    installed,
    ownPackageRoot: options.ownPackageRoot,
    packageName: options.packageName,
    requestedCopy
  });
  const destRoot = path.join(projectRoot, '.cursor', 'skills');
  const skillNames =
    command === 'unlink'
      ? await skillsForUnlink(
          resolved.sourceRoot,
          destRoot,
          options.packageName
        )
      : await skillsForLink(resolved.sourceRoot);

  const actions: SkillActionResult[] = [];
  for (const skill of skillNames) {
    const source = path.join(resolved.sourceRoot ?? '', skill);
    const dest = path.join(destRoot, skill);
    actions.push(
      await applySkill({
        command,
        copy: resolved.mode === 'copy',
        dest,
        destRoot,
        dryRun,
        force,
        packageName: options.packageName,
        skill,
        source: resolved.sourceRoot ? source : null
      })
    );
  }

  return {
    projectRoot,
    sourceRoot: resolved.sourceRoot,
    mode: resolved.mode,
    fellBackToCopy: resolved.fellBackToCopy,
    actions: actions.filter(
      action => !(action.action === 'kept' && action.reason === 'not linked')
    )
  };
}

export function formatReport(
  result: LinkAgentSkillsResult,
  dryRun = false
): string {
  if (result.actions.length === 0) {
    return 'No matching agent skills to update.';
  }

  const lines = result.actions.map(action => {
    const dest = relativeTo(result.projectRoot, action.dest);
    const prefix = dryRun && isWrite(action.action) ? 'would ' : '';
    if (action.action === 'linked') {
      return `${prefix}link ${dest} -> ${action.target}`;
    }
    if (action.action === 'copied') {
      return `${prefix}copy ${dest}`;
    }
    if (action.action === 'removed') {
      return `${prefix}remove ${dest}`;
    }
    if (action.action === 'already-linked') {
      return `already linked ${dest} -> ${action.target}`;
    }
    if (action.action === 'kept') {
      return `kept ${dest} (${action.reason})`;
    }
    return `skipped ${dest} (${action.reason})`;
  });

  if (result.fellBackToCopy) {
    lines.push(
      'Copied because the package is not in node_modules. Install it and rerun without --copy to symlink the skill to the installed version.'
    );
  }

  return lines.join('\n');
}

export function hasConflicts(result: LinkAgentSkillsResult): boolean {
  return result.actions.some(action => action.action === 'skipped');
}

function resolveSkillSource(input: {
  command: 'link' | 'unlink';
  installed: string | null;
  ownPackageRoot?: string;
  packageName: string;
  requestedCopy: boolean;
}): {
  sourceRoot: string | null;
  mode: 'link' | 'copy';
  fellBackToCopy: boolean;
} {
  if (input.installed) {
    const sourceRoot = path.join(input.installed, ...SKILLS_SEGMENT);
    if (input.command === 'link' && !existsSync(sourceRoot)) {
      throw new LinkSkillsError(
        `The installed ${input.packageName} package has no dist/skills directory. Update the package to a version that ships agent skills.`
      );
    }
    return {
      sourceRoot: existsSync(sourceRoot) ? sourceRoot : null,
      mode: input.requestedCopy ? 'copy' : 'link',
      fellBackToCopy: false
    };
  }

  const ownSkills = input.ownPackageRoot
    ? path.join(input.ownPackageRoot, ...SKILLS_SEGMENT)
    : null;
  if (input.command === 'unlink') {
    return {
      sourceRoot: ownSkills && existsSync(ownSkills) ? ownSkills : null,
      mode: 'link',
      fellBackToCopy: false
    };
  }

  if (!ownSkills || !existsSync(ownSkills)) {
    throw new LinkSkillsError(
      `Could not find ${input.packageName} in node_modules. Install the package in this project, then run the command from the project directory.`
    );
  }

  return {
    sourceRoot: ownSkills,
    mode: 'copy',
    fellBackToCopy: !input.requestedCopy
  };
}

async function skillsForLink(sourceRoot: string | null): Promise<string[]> {
  if (!sourceRoot || !existsSync(sourceRoot)) {
    throw new LinkSkillsError(
      'No packaged agent skills were found. Rebuild or update the package.'
    );
  }
  const names = await listSkillNames(sourceRoot);
  if (names.length === 0) {
    throw new LinkSkillsError(
      `No agent skills with SKILL.md were found in ${sourceRoot}.`
    );
  }
  return names;
}

async function skillsForUnlink(
  sourceRoot: string | null,
  destRoot: string,
  packageName: string
): Promise<string[]> {
  if (sourceRoot && existsSync(sourceRoot)) {
    const names = await listSkillNames(sourceRoot);
    if (names.length > 0) return names;
  }
  if (!existsSync(destRoot)) return [];

  const entries = await readdir(destRoot);
  const names: string[] = [];
  for (const name of entries) {
    const dest = path.join(destRoot, name);
    try {
      const stat = await lstat(dest);
      if (!stat.isSymbolicLink()) continue;
      const current = await readlink(dest);
      if (pointsAtPackagedSkill(current, packageName, name)) names.push(name);
    } catch {
      // A dest entry that disappears mid-scan is not one of our links.
    }
  }
  names.sort();
  return names;
}

async function listSkillNames(skillsDir: string): Promise<string[]> {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const names = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => existsSync(path.join(skillsDir, name, 'SKILL.md')));
  names.sort();
  return names;
}

async function applySkill(input: {
  command: 'link' | 'unlink';
  copy: boolean;
  dest: string;
  destRoot: string;
  dryRun: boolean;
  force: boolean;
  packageName: string;
  skill: string;
  source: string | null;
}): Promise<SkillActionResult> {
  const existing = await inspectDest(input.dest);

  if (input.command === 'unlink') {
    return unlinkSkill(input, existing);
  }

  if (!input.source) {
    throw new LinkSkillsError(`Missing packaged skill: ${input.skill}`);
  }

  const target = input.copy
    ? undefined
    : symlinkTarget(input.destRoot, input.source);

  if (
    existing.kind === 'link' &&
    target &&
    linksMatch(input.dest, target, existing.current)
  ) {
    return {
      skill: input.skill,
      action: 'already-linked',
      dest: input.dest,
      target
    };
  }

  if (existing.kind !== 'missing' && !input.force) {
    return {
      skill: input.skill,
      action: 'skipped',
      dest: input.dest,
      reason:
        existing.kind === 'link'
          ? 'links somewhere else; rerun with --force'
          : 'already exists; rerun with --force'
    };
  }

  if (!input.dryRun) {
    if (existing.kind !== 'missing') await removeExisting(input.dest);
    await mkdir(input.destRoot, { recursive: true });
    if (input.copy) {
      await cp(input.source, input.dest, { recursive: true });
    } else if (target) {
      await createLink(target, input.dest);
    }
  }

  return {
    skill: input.skill,
    action: input.copy ? 'copied' : 'linked',
    dest: input.dest,
    target
  };
}

async function unlinkSkill(
  input: {
    dest: string;
    dryRun: boolean;
    packageName: string;
    skill: string;
  },
  existing: DestState
): Promise<SkillActionResult> {
  if (existing.kind === 'missing') {
    return {
      skill: input.skill,
      action: 'kept',
      dest: input.dest,
      reason: 'not linked'
    };
  }

  const owned =
    existing.kind === 'link' &&
    pointsAtPackagedSkill(existing.current, input.packageName, input.skill);

  if (!owned) {
    return {
      skill: input.skill,
      action: 'kept',
      dest: input.dest,
      reason:
        existing.kind === 'link'
          ? 'link does not point at this package'
          : 'real directory; remove it manually'
    };
  }

  if (!input.dryRun) await unlink(input.dest);
  return {
    skill: input.skill,
    action: 'removed',
    dest: input.dest,
    target: existing.kind === 'link' ? existing.current : undefined
  };
}

async function createLink(target: string, dest: string): Promise<void> {
  try {
    await symlink(
      target,
      dest,
      process.platform === 'win32' ? 'junction' : 'dir'
    );
  } catch (error) {
    if (errorCode(error) === 'EPERM' || errorCode(error) === 'EACCES') {
      throw new LinkSkillsError(
        `Could not create a symlink at ${dest}. Rerun with --copy.`
      );
    }
    throw error;
  }
}

function symlinkTarget(destRoot: string, source: string): string {
  if (process.platform === 'win32') return source;
  return path.relative(destRoot, source);
}

function linksMatch(dest: string, expected: string, current: string): boolean {
  const base = path.dirname(dest);
  return path.resolve(base, current) === path.resolve(base, expected);
}

function pointsAtPackagedSkill(
  target: string,
  packageName: string,
  skill: string
): boolean {
  const normalized = target.split('\\').join('/');
  const suffix = `${packageName}/dist/skills/${skill}`;
  return normalized === suffix || normalized.endsWith(`/${suffix}`);
}

type DestState =
  | { kind: 'missing' }
  | { kind: 'link'; current: string }
  | { kind: 'other' };

async function inspectDest(dest: string): Promise<DestState> {
  try {
    const stat = await lstat(dest);
    if (stat.isSymbolicLink()) {
      return { kind: 'link', current: await readlink(dest) };
    }
    return { kind: 'other' };
  } catch (error) {
    if (errorCode(error) === 'ENOENT') return { kind: 'missing' };
    throw error;
  }
}

async function removeExisting(dest: string): Promise<void> {
  const stat = await lstat(dest);
  if (stat.isSymbolicLink()) {
    await unlink(dest);
    return;
  }
  await rm(dest, { recursive: true, force: true });
}

async function sameDirectory(left: string, right: string): Promise<boolean> {
  const [canonicalLeft, canonicalRight] = await Promise.all([
    canonical(left),
    canonical(right)
  ]);
  return canonicalLeft === canonicalRight;
}

async function canonical(target: string): Promise<string> {
  try {
    return await realpath(target);
  } catch {
    return path.resolve(target);
  }
}

function readPackageName(manifestPath: string): string | null {
  if (!existsSync(manifestPath)) return null;
  try {
    const json = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      name?: unknown;
    };
    return typeof json.name === 'string' ? json.name : null;
  } catch {
    return null;
  }
}

function relativeTo(root: string, target: string): string {
  const relative = path.relative(root, target);
  return relative.split(path.sep).join('/');
}

function isWrite(action: SkillAction): boolean {
  return action === 'linked' || action === 'copied' || action === 'removed';
}

function errorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

async function main(): Promise<void> {
  try {
    const options = parseCliArgs(process.argv.slice(2));
    if (options.help) {
      console.log(HELP);
      return;
    }

    const ownPackageRoot = findOwnPackageRoot(import.meta.url);
    const packageName = readPackageName(
      path.join(ownPackageRoot, 'package.json')
    );
    if (!packageName) {
      throw new LinkSkillsError(
        'Could not read the package name for this command.'
      );
    }

    const result = await linkAgentSkills({
      command: options.command,
      copy: options.copy,
      cwd: options.cwd,
      dryRun: options.dryRun,
      force: options.force,
      ownPackageRoot,
      packageName
    });
    console.log(formatReport(result, options.dryRun));
    if (hasConflicts(result)) process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

if (isDirectRun()) {
  await main();
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return (
      pathToFileURL(realpathSync(entry)).href ===
      pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href
    );
  } catch {
    return false;
  }
}
