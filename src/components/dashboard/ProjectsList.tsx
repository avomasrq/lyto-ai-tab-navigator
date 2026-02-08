import { FolderOpen, ExternalLink } from 'lucide-react';
import type { Project } from '@/hooks/useDashboardData';

interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Projects</h3>
        </div>
        <p className="text-sm text-muted-foreground">No projects yet. Create your first project in the extension.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Projects</h3>
        <span className="ml-auto text-xs text-muted-foreground">{projects.length} total</span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-background/50 hover:border-primary/30 hover:bg-card transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium truncate">{project.title}</h4>
                {project.isActive && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary">
                    Active
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};
