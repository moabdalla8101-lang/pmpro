/**
 * Utility function to remove "Project" prefix from knowledge area names
 * @param name - The knowledge area name (e.g., "Project Integration Management")
 * @returns The name without "Project" prefix (e.g., "Integration Management")
 */
export function removeProjectPrefix(name: string): string {
  if (!name) return name;
  return name.replace(/^Project\s+/i, '').trim();
}



