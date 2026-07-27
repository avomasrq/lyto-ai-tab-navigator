import type { Project } from '@/hooks/useDashboardData';
import { Panel, PanelEmpty } from './Panel';

interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => (
  <Panel
    title="Projects"
    meta={projects.length > 0 ? `${projects.length}` : undefined}
    className="h-full"
    bodyClassName="overflow-y-auto max-h-[320px]"
  >
    {projects.length === 0 ? (
      <PanelEmpty>Nothing here yet. Your first project from the extension will show up on this list.</PanelEmpty>
    ) : (
      <ul className="divide-y divide-border/50">
        {projects.map((project) => (
          <li key={project.id} className="group px-5 py-3.5 transition-colors hover:bg-muted/40">
            <div className="flex items-baseline gap-2">
              <h4 className="text-[13.5px] font-medium text-foreground truncate">{project.title}</h4>
              {project.isActive && (
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  active
                </span>
              )}
              <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground/50">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            {project.description && (
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/70 line-clamp-2">
                {project.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    )}
  </Panel>
);
