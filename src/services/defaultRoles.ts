import { db } from "@/lib/firebase";
import {
  getUserSettings,
  markDefaultRolesSeeded,
} from "@/modules/auth/services/userSettings";
import { createScope, listOwnedScopes } from "@/services/scopes";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

type DefaultAreaSeed = {
  area: string;
  roles: string[];
};

const defaultRoles: DefaultAreaSeed[] = [
  {
    area: "Vínculos",
    roles: ["Pareja", "Hijo / Familia", "Amigo / Comunidad"],
  },
  {
    area: "Carrera",
    roles: [
      "Profesional Front-End",
      "Educador / Mentor",
      "Emprendedor / Creador de producto",
      "Aprendiz",
    ],
  },
  {
    area: "Bienestar",
    roles: ["Cuidador de mi salud", "Hombre espiritual"],
  },
  {
    area: "Recursos",
    roles: ["Administrador de mis finanzas"],
  },
  {
    area: "Expresión",
    roles: ["Creador"],
  },
  {
    area: "Dirección",
    roles: ["Arquitecto de mi visión"],
  },
];

export const DEFAULT_ROLES_SEED_VERSION = 1;

const activeSeeds = new Map<string, Promise<void>>();

function normalizeSeedLabel(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

async function createMissingRoles(params: {
  scopeId: string;
  uid: string;
  roles: string[];
}) {
  const { scopeId, uid, roles } = params;
  const rolesCollection = collection(db, "scopes", scopeId, "roles");
  const snap = await getDocs(rolesCollection);
  const existingTitles = new Set(
    snap.docs.map((docSnap) => {
      const data = docSnap.data() as { title?: string };
      return normalizeSeedLabel(data.title ?? "");
    })
  );

  const missingRoles = roles.filter((role) => !existingTitles.has(normalizeSeedLabel(role)));
  if (missingRoles.length === 0) return;

  const batch = writeBatch(db);

  for (const title of missingRoles) {
    batch.set(doc(rolesCollection), {
      title,
      createdBy: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

async function seedDefaultRolesInternal(uid: string) {
  const [settings, ownedScopes] = await Promise.all([
    getUserSettings(uid),
    listOwnedScopes(uid),
  ]);

  const scopesByArea = new Map(
    ownedScopes.map((scope) => [normalizeSeedLabel(scope.name), scope] as const)
  );
  let activeScopeId = settings.activeScopeId;

  for (const areaSeed of defaultRoles) {
    const areaKey = normalizeSeedLabel(areaSeed.area);
    let scope = scopesByArea.get(areaKey);

    if (!scope) {
      const scopeId = await createScope({
        uid,
        name: areaSeed.area,
      });
      scope = {
        id: scopeId,
        name: areaSeed.area,
        ownerId: uid,
      };
      scopesByArea.set(areaKey, scope);
    }

    if (!activeScopeId) {
      activeScopeId = scope.id;
    }

    await createMissingRoles({
      scopeId: scope.id,
      uid,
      roles: areaSeed.roles,
    });
  }

  await markDefaultRolesSeeded({
    uid,
    version: DEFAULT_ROLES_SEED_VERSION,
    activeScopeId,
  });
}

export function seedDefaultRoles(uid: string) {
  const activeSeed = activeSeeds.get(uid);
  if (activeSeed) return activeSeed;

  const seedPromise = seedDefaultRolesInternal(uid).finally(() => {
    activeSeeds.delete(uid);
  });

  activeSeeds.set(uid, seedPromise);
  return seedPromise;
}
