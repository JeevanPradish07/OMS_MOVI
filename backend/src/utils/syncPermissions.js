import Permission from '../models/Permission.js';
import { generatePermissionDefinitions } from '../config/permissionsConfig.js';

export const syncPermissions = async () => {
  const definitions = generatePermissionDefinitions();
  let created = 0;
  for (const def of definitions) {
    const exists = await Permission.findOne({ name: def.name });
    if (!exists) {
      await Permission.create(def);
      created++;
    }
  }
  if (created > 0) {
    console.log(`✅ Synced ${created} new permission(s) from config`);
  } else {
    console.log('✅ Permissions in sync (0 new)');
  }
};
