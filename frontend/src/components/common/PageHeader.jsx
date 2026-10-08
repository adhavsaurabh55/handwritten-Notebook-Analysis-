import Breadcrumb from './Breadcrumb';

function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className = '',
}) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-3" />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;

