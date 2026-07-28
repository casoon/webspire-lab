const PROJECT_STATUSES = ['brief', 'directions', 'refining', 'decided', 'shipped'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  schemaVersion: 1;
  slug: string;
  title: string;
  client: string;
  goal: string;
  primaryAction: string;
  audience: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  chosenDirection?: string;
  constraints: string[];
  briefing: {
    product: string;
    content: string;
    technicalBasis: string;
  };
  designFrame: {
    direction: string;
    typography: string;
    colors: string;
    layout: string;
    imagery: string;
    motion: string;
    signature: string;
    exceptions: string;
  };
}

const projectFiles = import.meta.glob<{ default: unknown }>('/lab.config/projects/*.json', {
  eager: true,
});

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false;
  const project = value as Record<string, unknown>;

  return (
    project.schemaVersion === 1 &&
    hasStringFields(project, [
      'slug',
      'title',
      'client',
      'goal',
      'primaryAction',
      'audience',
      'createdAt',
      'updatedAt',
    ]) &&
    typeof project.status === 'string' &&
    PROJECT_STATUSES.includes(project.status as ProjectStatus) &&
    Array.isArray(project.constraints) &&
    project.constraints.every((constraint) => typeof constraint === 'string') &&
    hasStringFields(project.briefing, ['product', 'content', 'technicalBasis']) &&
    hasStringFields(project.designFrame, [
      'direction',
      'typography',
      'colors',
      'layout',
      'imagery',
      'motion',
      'signature',
      'exceptions',
    ])
  );
}

function hasStringFields(value: unknown, fields: string[]) {
  if (!value || typeof value !== 'object') return false;
  return fields.every((field) => typeof (value as Record<string, unknown>)[field] === 'string');
}

/** Projektdateien sind klein, bewusst lesbar und werden über Git versioniert. */
export function getProjects(): Project[] {
  return Object.values(projectFiles)
    .map((module) => module.default)
    .filter(isProject)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.slug.localeCompare(b.slug));
}
