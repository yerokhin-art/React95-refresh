// @vitest-environment node

import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readlink,
  rm,
  symlink,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  findInstalledPackageDir,
  findProjectRoot,
  formatReport,
  LinkSkillsError,
  linkAgentSkills,
  parseCliArgs
} from './link-agent-skills';

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map(root => rm(root, { recursive: true, force: true }))
  );
});

describe('react95-refresh-skills', () => {
  it('links a skill with a relative node_modules path', async () => {
    const root = await makeProject('consumer');
    const store = await makeStore();
    await linkPackage(root, store);

    const result = await linkAgentSkills({
      cwd: root,
      packageName: 'react95-refresh'
    });
    const dest = skillDest(root);

    expect(result.mode).toBe('link');
    expect(result.actions).toEqual([
      {
        skill: 'react95-usage',
        action: 'linked',
        dest,
        target: '../../node_modules/react95-refresh/dist/skills/react95-usage'
      }
    ]);
    expect(await readlink(dest)).toBe(
      '../../node_modules/react95-refresh/dist/skills/react95-usage'
    );
    expect(await readFile(path.join(dest, 'SKILL.md'), 'utf8')).toBe(
      '# Skill\n'
    );
    expect(formatReport(result)).toContain(
      'link .cursor/skills/react95-usage -> ../../node_modules/react95-refresh/dist/skills/react95-usage'
    );
  });

  it('keeps an existing link on the second run', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);

    await linkAgentSkills({ cwd: root, packageName: 'react95-refresh' });
    const again = await linkAgentSkills({
      cwd: root,
      packageName: 'react95-refresh'
    });

    expect(again.actions[0]?.action).toBe('already-linked');
    expect((await lstat(skillDest(root))).isSymbolicLink()).toBe(true);
  });

  it('does not replace a real skill directory unless forced', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);
    const dest = skillDest(root);
    await mkdir(dest, { recursive: true });
    await writeFile(path.join(dest, 'SKILL.md'), '# local\n');

    const skipped = await linkAgentSkills({
      cwd: root,
      packageName: 'react95-refresh'
    });
    expect(skipped.actions[0]?.action).toBe('skipped');
    expect(await readFile(path.join(dest, 'SKILL.md'), 'utf8')).toBe(
      '# local\n'
    );

    const replaced = await linkAgentSkills({
      cwd: root,
      force: true,
      packageName: 'react95-refresh'
    });
    expect(replaced.actions[0]?.action).toBe('linked');
    expect(await readFile(path.join(dest, 'SKILL.md'), 'utf8')).toBe(
      '# Skill\n'
    );
  });

  it('prints a dry run without creating .cursor', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);

    const result = await linkAgentSkills({
      cwd: root,
      dryRun: true,
      packageName: 'react95-refresh'
    });

    expect(result.actions[0]?.action).toBe('linked');
    expect(formatReport(result, true)).toContain('would link');
    await expect(lstat(path.join(root, '.cursor'))).rejects.toMatchObject({
      code: 'ENOENT'
    });
  });

  it('copies skill files when copy is requested', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);

    const result = await linkAgentSkills({
      copy: true,
      cwd: root,
      packageName: 'react95-refresh'
    });
    const dest = skillDest(root);

    expect(result.mode).toBe('copy');
    expect(result.fellBackToCopy).toBe(false);
    expect(result.actions[0]?.action).toBe('copied');
    expect((await lstat(dest)).isSymbolicLink()).toBe(false);
    expect(await readFile(path.join(dest, 'SKILL.md'), 'utf8')).toBe(
      '# Skill\n'
    );
  });

  it('links to a hoisted package from a nested project', async () => {
    const workspace = await makeProject('workspace');
    const app = path.join(workspace, 'apps', 'web');
    await mkdir(app, { recursive: true });
    await writeFile(
      path.join(app, 'package.json'),
      JSON.stringify({ name: 'web' })
    );
    await installPackage(workspace);

    const result = await linkAgentSkills({
      cwd: path.join(app, 'src'),
      packageName: 'react95-refresh'
    });

    expect(findProjectRoot(path.join(app, 'src'))).toBe(app);
    expect(findInstalledPackageDir(app, 'react95-refresh')).toBe(
      path.join(workspace, 'node_modules', 'react95-refresh')
    );
    expect(result.actions[0]?.target).toBe(
      '../../../../node_modules/react95-refresh/dist/skills/react95-usage'
    );
  });

  it('refuses to relink skills inside this package repository', async () => {
    const root = await makeProject('react95-refresh');

    await expect(
      linkAgentSkills({
        cwd: root,
        ownPackageRoot: root,
        packageName: 'react95-refresh'
      })
    ).rejects.toThrow(LinkSkillsError);
  });

  it('copies when the package is not installed in node_modules', async () => {
    const root = await makeProject('consumer');
    const own = await makeStore();

    const result = await linkAgentSkills({
      cwd: root,
      ownPackageRoot: own,
      packageName: 'react95-refresh'
    });

    expect(result.fellBackToCopy).toBe(true);
    expect(result.actions[0]?.action).toBe('copied');
    expect(formatReport(result)).toContain('not in node_modules');
    expect(await readFile(path.join(skillDest(root), 'SKILL.md'), 'utf8')).toBe(
      '# Skill\n'
    );
  });

  it('removes only a link that points at the packaged skill', async () => {
    const root = await makeProject('consumer');
    const packageDir = await installPackage(root);
    await linkAgentSkills({ cwd: root, packageName: 'react95-refresh' });

    const removed = await linkAgentSkills({
      command: 'unlink',
      cwd: root,
      packageName: 'react95-refresh'
    });
    expect(removed.actions.map(action => action.action)).toEqual(['removed']);
    await expect(lstat(skillDest(root))).rejects.toMatchObject({
      code: 'ENOENT'
    });
    expect(await readFile(path.join(packageDir, 'SKILL.md'), 'utf8')).toBe(
      '# Skill\n'
    );

    const again = await linkAgentSkills({
      command: 'unlink',
      cwd: root,
      packageName: 'react95-refresh'
    });
    expect(again.actions).toEqual([]);
  });

  it('leaves a real skill directory in place on unlink', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);
    const dest = skillDest(root);
    await mkdir(dest, { recursive: true });
    await writeFile(path.join(dest, 'SKILL.md'), '# local\n');

    const result = await linkAgentSkills({
      command: 'unlink',
      cwd: root,
      packageName: 'react95-refresh'
    });

    expect(result.actions[0]?.action).toBe('kept');
    expect(await readFile(path.join(dest, 'SKILL.md'), 'utf8')).toBe(
      '# local\n'
    );
  });

  it('can unlink after node_modules has been removed', async () => {
    const root = await makeProject('consumer');
    await installPackage(root);
    await linkAgentSkills({ cwd: root, packageName: 'react95-refresh' });
    await rm(path.join(root, 'node_modules'), { recursive: true, force: true });

    const result = await linkAgentSkills({
      command: 'unlink',
      cwd: root,
      packageName: 'react95-refresh'
    });

    expect(result.actions[0]?.action).toBe('removed');
    await expect(lstat(skillDest(root))).rejects.toMatchObject({
      code: 'ENOENT'
    });
  });

  it('parses commands and rejects conflicting arguments', () => {
    expect(
      parseCliArgs(['unlink', '--dry-run', '--dir', 'apps/web'])
    ).toMatchObject({
      command: 'unlink',
      dryRun: true,
      cwd: 'apps/web'
    });
    expect(parseCliArgs(['--dir=apps/web']).cwd).toBe('apps/web');
    expect(() => parseCliArgs(['--copy', 'unlink'])).toThrow(LinkSkillsError);
    expect(() => parseCliArgs(['link', 'unlink'])).toThrow(LinkSkillsError);
    expect(() => parseCliArgs(['--wat'])).toThrow(LinkSkillsError);
  });
});

async function makeProject(name: string): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'r95-skills-'));
  roots.push(root);
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ name }));
  return root;
}

async function makeStore(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'r95-store-'));
  roots.push(root);
  await writePackage(root);
  return root;
}

async function installPackage(projectRoot: string): Promise<string> {
  const packageRoot = path.join(projectRoot, 'node_modules', 'react95-refresh');
  await writePackage(packageRoot);
  return path.join(packageRoot, 'dist', 'skills', 'react95-usage');
}

async function linkPackage(projectRoot: string, store: string): Promise<void> {
  const packageRoot = path.join(projectRoot, 'node_modules', 'react95-refresh');
  await mkdir(path.dirname(packageRoot), { recursive: true });
  await symlink(store, packageRoot, 'dir');
}

async function writePackage(packageRoot: string): Promise<void> {
  const skillDir = path.join(packageRoot, 'dist', 'skills', 'react95-usage');
  await mkdir(skillDir, { recursive: true });
  await writeFile(path.join(skillDir, 'SKILL.md'), '# Skill\n');
  await writeFile(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ name: 'react95-refresh' })
  );
}

function skillDest(projectRoot: string): string {
  return path.join(projectRoot, '.cursor', 'skills', 'react95-usage');
}
