'use client';

import { Project } from '@/types/project';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    draft: 'bg-yellow-100 text-yellow-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            statusColors[project.status]
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Updated {formatDate(project.updated_at)}</span>
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </button>
      </div>
    </div>
  );
} 