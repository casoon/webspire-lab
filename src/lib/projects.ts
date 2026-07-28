const PROJECT_STATUSES = ['brief', 'directions', 'refining', 'decided', 'shipped'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  schemaVersion: 1;
  slug: string;
  title: string;
  client: string;
  goal: string;
  ctas: {
    primary: string;
    secondary: string[];
  };
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

function toProject(value: unknown): Project | null {
  if (!value || typeof value !== 'object') return null;
  const project = value as Record<string, unknown>;

  if (
    project.schemaVersion === 1 &&
    hasStringFields(project, [
      'slug',
      'title',
      'client',
      'goal',
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
  ) {
    const ctas = ctasOf(project);
    return ctas ? { ...(project as Omit<Project, 'ctas'>), ctas } : null;
  }

  return null;
}

function hasStringFields(value: unknown, fields: string[]) {
  if (!value || typeof value !== 'object') return false;
  return fields.every((field) => typeof (value as Record<string, unknown>)[field] === 'string');
}

function ctasOf(project: Record<string, unknown>): Project['ctas'] | null {
  const ctas = project.ctas;
  if (ctas && typeof ctas === 'object') {
    const value = ctas as Record<string, unknown>;
    if (
      typeof value.primary === 'string' &&
      Array.isArray(value.secondary) &&
      value.secondary.length <= 2 &&
      value.secondary.every((cta) => typeof cta === 'string')
    ) {
      return { primary: value.primary, secondary: value.secondary };
    }
    return null;
  }

  return typeof project.primaryAction === 'string'
    ? { primary: project.primaryAction, secondary: [] }
    : { primary: '', secondary: [] };
}

/** Projektdateien sind klein, bewusst lesbar und werden über Git versioniert. */
export function getProjects(): Project[] {
  return Object.values(projectFiles)
    .map((module) => module.default)
    .map(toProject)
    .filter((project): project is Project => project !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.slug.localeCompare(b.slug));
}
